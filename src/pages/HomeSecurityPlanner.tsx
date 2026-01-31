import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccordionSection from '../components/AccordionSection';
import FloorplanCanvas from '../components/floorplan/FloorplanCanvas';
import HomeSecurityFunnelSteps from '../components/HomeSecurityFunnelSteps';
import { useLayoutConfig } from '../components/LayoutConfig';
import {
  DEVICE_CATALOG,
  DEVICE_KEYS,
  isRotatableDevice,
  isWallAnchored,
  type FloorplanDeviceType,
} from '../components/floorplan/deviceCatalog';
import {
  autoSnapToNearestWall,
  findRoomAtPoint,
  getPlacementRotation,
  getWallInsetPosition,
  snapToGrid,
} from '../components/floorplan/floorplanUtils';
import { track } from '../lib/analytics';
import type {
  EntryPoints,
  FloorplanFloor,
  FloorplanPlacement,
  FloorplanRoom,
  FloorplanRoomKind,
  FloorplanWall,
  HomeSecurityFitCheckAnswers,
  HomeSecurityFloorplan,
  PrecisionPlannerDraft,
} from '@/lib/homeSecurityFunnel';
import {
  buildHomeSecurityPlannerPlan,
  deriveHomeSecurityQuoteAddOns,
  type PlannerPlan,
  type PlannerTierKey,
} from '../lib/homeSecurityPlannerEngine';
import { migrateFloorplanPlacements } from '../lib/homeSecurityFunnel';
import { loadRetailFlow, updateRetailFlow } from '../lib/retailFlow';

const priorityOptions = ['Security', 'Packages', 'Water'] as const;
const wallOptions: Array<{ value: FloorplanWall; label: string }> = [
  { value: 'n', label: 'North' },
  { value: 's', label: 'South' },
  { value: 'e', label: 'East' },
  { value: 'w', label: 'West' },
];

const exteriorDoorLabelKeywords = ['front', 'back', 'side', 'patio', 'garage entry', 'slider'];

const isExteriorDoorLabel = (label: string) => {
  const normalized = label.toLowerCase();
  return exteriorDoorLabelKeywords.some((keyword) => normalized.includes(keyword));
};

const createDoor = (
  label: string,
  options?: { wall?: FloorplanWall; offset?: number; exterior?: boolean },
): FloorplanRoom['doors'][number] => ({
  id: `door-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
  label,
  wall: options?.wall ?? 's',
  offset: options?.offset ?? 0.5,
  exterior: options?.exterior ?? isExteriorDoorLabel(label),
});

const createWindow = (
  label: string,
  options?: { wall?: FloorplanWall; offset?: number },
): FloorplanRoom['windows'][number] => ({
  id: `window-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
  label,
  wall: options?.wall ?? 's',
  offset: options?.offset ?? 0.5,
});

const deriveExteriorDoors = (entryPoints?: EntryPoints): string[] | undefined => {
  if (!entryPoints) return undefined;
  if (entryPoints === '1-2') {
    return ['Front door'];
  }
  if (entryPoints === '3-4') {
    return ['Front door', 'Back door', 'Garage entry'];
  }
  return ['Front door', 'Back door', 'Side door', 'Patio slider', 'Garage entry'];
};

const deriveDraftFromFitCheck = (answers?: HomeSecurityFitCheckAnswers): PrecisionPlannerDraft => {
  if (!answers) return {};
  const derivedDoors = deriveExteriorDoors(answers.entryPoints);
  const sizeBand =
    answers.homeSize === 'small' ? 'small' : answers.homeSize === 'typical' ? 'medium' : answers.homeSize === 'large' ? 'large' : undefined;
  return {
    exteriorDoors: derivedDoors,
    sizeBand,
  };
};

const floorLabels = ['Floor 1', 'Floor 2', 'Floor 3'] as const;

const createFloor = (index: number): FloorplanFloor => ({
  id: `floor-${index + 1}`,
  label: floorLabels[index],
  rooms: [],
});

const createEmptyFloorplan = (count: 1 | 2 | 3): HomeSecurityFloorplan => ({
  version: 'v1',
  floors: Array.from({ length: count }, (_, index) => createFloor(index)),
  placements: [],
});

const clampRotation = (value: number) => Math.min(Math.max(value, 0), 360);

type PlacementInput = Omit<FloorplanPlacement, 'id' | 'source'> & { id?: string };

const userPlacementSource: FloorplanPlacement['source'] = 'user_added';
const suggestedPlacementSource: FloorplanPlacement['source'] = 'suggested';

export const createUserPlacement = (input: PlacementInput): FloorplanPlacement => ({
  id: input.id ?? `placement-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
  ...input,
  source: userPlacementSource,
});

export const generateSuggestedPlacements = (inputs: PlacementInput[]): FloorplanPlacement[] => {
  return inputs.map((input, index) => ({
    id: input.id ?? `suggested-${index + 1}`,
    ...input,
    source: suggestedPlacementSource,
  }));
};

const roomKindOptions: Array<{ value: FloorplanRoomKind; label: string }> = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'living', label: 'Living' },
  { value: 'hall', label: 'Hall' },
  { value: 'garage', label: 'Garage' },
  { value: 'basement', label: 'Basement' },
  { value: 'other', label: 'Other' },
];

const createRoom = (name: string, index: number, rectOverride?: FloorplanRoom['rect']): FloorplanRoom => ({
  id: `room-${name.toLowerCase().replace(/\\s+/g, '-')}-${index + 1}`,
  name,
  kind: undefined,
  rect: rectOverride ?? { x: 24, y: 24 + index * 70, w: 160, h: 56 },
  doors: [],
  windows: [],
});

const applyTemplateToFloors = (
  template: 'apartment' | 'ranch' | '2-story',
  floorplan: HomeSecurityFloorplan,
  garage: PrecisionPlannerDraft['garage'],
): HomeSecurityFloorplan => {
  const nextFloors = floorplan.floors.map((floor) => ({ ...floor, rooms: [...floor.rooms] }));
  const addDefaultDoors = (rooms: FloorplanRoom[], options: { includeBackDoor?: boolean; includeGarageEntry?: boolean }) => {
    if (rooms.length === 0) return rooms;
    const livingRoom = rooms.find((room) => room.name.toLowerCase().includes('living'));
    const hallRoom = rooms.find((room) => room.name.toLowerCase().includes('hall'));
    const fallbackRoom = livingRoom ?? hallRoom ?? rooms[0];
    const nextRooms = rooms.map((room) => ({ ...room }));

    const addDoorToRoom = (room: FloorplanRoom, door: FloorplanRoom['doors'][number]) => {
      room.doors = [...room.doors, door];
    };

    if (fallbackRoom) {
      const target = nextRooms.find((room) => room.id === fallbackRoom.id);
      if (target) {
        addDoorToRoom(
          target,
          createDoor('Front door', {
            wall: 's',
            offset: 0.5,
            exterior: true,
          }),
        );
      }
    }

    if (options.includeBackDoor && fallbackRoom) {
      const target = nextRooms.find((room) => room.id === fallbackRoom.id);
      if (target) {
        addDoorToRoom(
          target,
          createDoor('Back door', {
            wall: 'n',
            offset: 0.5,
            exterior: true,
          }),
        );
      }
    }

    if (options.includeGarageEntry && garage && garage !== 'none') {
      const garageRoom =
        nextRooms.find((room) => room.name.toLowerCase().includes('garage')) ??
        nextRooms.find((room) => room.name.toLowerCase().includes('hall')) ??
        fallbackRoom;
      if (garageRoom) {
        addDoorToRoom(
          garageRoom,
          createDoor('Garage entry', {
            wall: 'e',
            offset: 0.5,
            exterior: true,
          }),
        );
      }
    }

    return nextRooms;
  };

  if (template === 'apartment') {
    const target = nextFloors[0];
    if (target) {
      target.rooms = [
        createRoom('Living', 0, { x: 24, y: 24, w: 220, h: 90 }),
        createRoom('Kitchen', 1, { x: 260, y: 24, w: 160, h: 90 }),
        createRoom('Bedroom', 2, { x: 24, y: 140, w: 180, h: 80 }),
        createRoom('Bath', 3, { x: 220, y: 140, w: 120, h: 80 }),
      ];
      target.rooms = addDefaultDoors(target.rooms, { includeGarageEntry: true });
    }
  }

  if (template === 'ranch') {
    const target = nextFloors[0];
    if (target) {
      target.rooms = [
        createRoom('Living', 0, { x: 24, y: 24, w: 220, h: 80 }),
        createRoom('Kitchen', 1, { x: 260, y: 24, w: 160, h: 80 }),
        createRoom('Primary Bedroom', 2, { x: 24, y: 120, w: 200, h: 80 }),
        createRoom('Bath', 3, { x: 240, y: 120, w: 120, h: 80 }),
        createRoom('Hall', 4, { x: 24, y: 210, w: 200, h: 60 }),
      ];
      target.rooms = addDefaultDoors(target.rooms, { includeBackDoor: true, includeGarageEntry: true });
    }
  }

  if (template === '2-story') {
    const first = nextFloors[0];
    const second = nextFloors[1];
    if (first) {
      first.rooms = [
        createRoom('Living', 0, { x: 24, y: 24, w: 220, h: 90 }),
        createRoom('Kitchen', 1, { x: 260, y: 24, w: 160, h: 90 }),
        createRoom('Hall', 2, { x: 24, y: 140, w: 180, h: 70 }),
      ];
      first.rooms = addDefaultDoors(first.rooms, { includeBackDoor: true, includeGarageEntry: true });
    }
    if (second) {
      second.rooms = [
        createRoom('Bedroom 1', 0, { x: 24, y: 24, w: 200, h: 90 }),
        createRoom('Bedroom 2', 1, { x: 240, y: 24, w: 170, h: 90 }),
        createRoom('Bath', 2, { x: 24, y: 140, w: 140, h: 70 }),
      ];
    }
  }

  return { ...floorplan, floors: nextFloors };
};

const HomeSecurityPlanner = () => {
  useLayoutConfig({
    layoutVariant: 'funnel',
    showBreadcrumbs: true,
    breadcrumb: [
      { label: 'Home Security', href: '/home-security' },
      { label: 'Precision Planner' },
    ],
  });

  const storedFlow = loadRetailFlow();
  const storedDraft = storedFlow.homeSecurity?.precisionPlannerDraft;
  const fitCheckTier = storedFlow.homeSecurity?.fitCheckResult?.tier;
  const defaultTier: PlannerTierKey =
    fitCheckTier === 'Bronze' ? 'bronze' : fitCheckTier === 'Silver' ? 'silver' : fitCheckTier === 'Gold' ? 'gold' : 'silver';

  const initialDraft = (() => {
    if (storedDraft && Object.keys(storedDraft).length > 0) {
      return { ...storedDraft, selectedTier: storedDraft.selectedTier ?? defaultTier };
    }
    return { ...deriveDraftFromFitCheck(storedFlow.homeSecurity?.fitCheckAnswers), selectedTier: defaultTier };
  })();

  const [draft, setDraft] = useState<PrecisionPlannerDraft>(initialDraft);
  const defaultFloorCount = (initialDraft.floors ?? 1) as 1 | 2 | 3;
  const [floorplan, setFloorplan] = useState<HomeSecurityFloorplan>(() => {
    const storedFloorplan = storedFlow.homeSecurity?.floorplan ?? createEmptyFloorplan(defaultFloorCount);
    return migrateFloorplanPlacements(storedFloorplan);
  });
  const [selectedFloorId, setSelectedFloorId] = useState<string>(() => floorplan.floors[0]?.id ?? 'floor-1');
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>();
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);
  const [activeDeviceKey, setActiveDeviceKey] = useState<FloorplanDeviceType | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [selectedTier, setSelectedTier] = useState<PlannerTierKey>(initialDraft.selectedTier ?? defaultTier);
  const [plan, setPlan] = useState<PlannerPlan | null>(null);
  const navigate = useNavigate();

  const exteriorDoors = draft.exteriorDoors ?? [];
  const priorities = draft.priorities ?? [];
  const wizardFloors = (draft.floors ?? 1) as 1 | 2 | 3;
  const selectedFloor = floorplan.floors.find((floor) => floor.id === selectedFloorId) ?? floorplan.floors[0];
  const selectedRoom = selectedFloor?.rooms.find((room) => room.id === selectedRoomId);
  const floorPlacements = useMemo(
    () => floorplan.placements.filter((placement) => placement.floorId === selectedFloor?.id),
    [floorplan.placements, selectedFloor?.id],
  );
  const selectedPlacement = floorPlacements.find((placement) => placement.id === selectedPlacementId);
  const selectedPlacementItem = selectedPlacement ? DEVICE_CATALOG[selectedPlacement.deviceKey] : null;
  const selectedPlacementRoom =
    selectedPlacement && selectedFloor
      ? selectedFloor.rooms.find((room) => room.id === selectedPlacement.roomId) ??
        findRoomAtPoint(selectedFloor, selectedPlacement.position)
      : undefined;
  const activeCatalogItem = activeDeviceKey ? DEVICE_CATALOG[activeDeviceKey] : null;

  const mapExteriorDoors = useMemo(() => {
    return floorplan.floors.flatMap((floor) =>
      floor.rooms.flatMap((room) =>
        room.doors
          .filter((door) => door.exterior)
          .map((door) => (door.label?.trim() ? door.label.trim() : 'Exterior door')),
      ),
    );
  }, [floorplan]);

  const usingMapExteriorDoors = mapExteriorDoors.length > 0;
  const plannerExteriorDoors = usingMapExteriorDoors ? mapExteriorDoors : exteriorDoors;
  const plannerDraft = useMemo(
    () => ({
      ...draft,
      exteriorDoors: plannerExteriorDoors,
    }),
    [draft, plannerExteriorDoors],
  );

  const handleDoorLabelChange = (index: number, value: string) => {
    setDraft((prev) => {
      const nextDoors = [...(prev.exteriorDoors ?? [])];
      nextDoors[index] = value;
      return { ...prev, exteriorDoors: nextDoors };
    });
  };

  const handleRemoveDoor = (index: number) => {
    setDraft((prev) => {
      const nextDoors = [...(prev.exteriorDoors ?? [])];
      nextDoors.splice(index, 1);
      return { ...prev, exteriorDoors: nextDoors };
    });
  };

  const handleAddDoor = () => {
    setDraft((prev) => ({
      ...prev,
      exteriorDoors: [...(prev.exteriorDoors ?? []), ''],
    }));
  };

  const handlePriorityToggle = (value: (typeof priorityOptions)[number]) => {
    setDraft((prev) => {
      const nextPriorities = new Set(prev.priorities ?? []);
      if (nextPriorities.has(value)) {
        nextPriorities.delete(value);
      } else if (nextPriorities.size < 2) {
        nextPriorities.add(value);
      }
      return { ...prev, priorities: Array.from(nextPriorities) };
    });
  };

  const handleSaveDraft = () => {
    updateRetailFlow({ homeSecurity: { precisionPlannerDraft: draft } });
  };

  useEffect(() => {
    setFloorplan((prev) => {
      if (!prev || prev.version !== 'v1') {
        return createEmptyFloorplan(wizardFloors);
      }
      let nextFloors = prev.floors.map((floor, index) => ({ ...floor, label: floorLabels[index] }));
      if (nextFloors.length < wizardFloors) {
        const additions = Array.from({ length: wizardFloors - nextFloors.length }, (_, index) =>
          createFloor(nextFloors.length + index),
        );
        nextFloors = [...nextFloors, ...additions];
      } else if (nextFloors.length > wizardFloors) {
        nextFloors = nextFloors.slice(0, wizardFloors);
      }
      return { ...prev, floors: nextFloors };
    });
  }, [wizardFloors]);

  useEffect(() => {
    if (!floorplan.floors.find((floor) => floor.id === selectedFloorId)) {
      setSelectedFloorId(floorplan.floors[0]?.id ?? 'floor-1');
      setSelectedRoomId(undefined);
    }
  }, [floorplan.floors, selectedFloorId]);

  useEffect(() => {
    if (selectedPlacementId && !floorPlacements.find((placement) => placement.id === selectedPlacementId)) {
      setSelectedPlacementId(null);
    }
  }, [floorPlacements, selectedPlacementId]);

  useEffect(() => {
    updateRetailFlow({ homeSecurity: { floorplan } });
  }, [floorplan]);

  const handleContinue = () => {
    track('hs_planner_results_generated', {
      tier: selectedTier,
      doors_count: plannerExteriorDoors.length,
      pets: Boolean(plannerDraft.pets),
      elders: Boolean(plannerDraft.elders),
      ground_windows: plannerDraft.groundWindows ?? 'unknown',
    });
    const nextPlan = buildHomeSecurityPlannerPlan(plannerDraft, selectedTier);
    setPlan(nextPlan);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTierChange = (value: PlannerTierKey) => {
    setSelectedTier(value);
    setDraft((prev) => ({ ...prev, selectedTier: value }));
  };

  const handleApplyToQuote = () => {
    const nextPlan = plan ?? buildHomeSecurityPlannerPlan(plannerDraft, selectedTier);
    if (!plan) {
      setPlan(nextPlan);
    }
    const recommendedTierKey = nextPlan.selectedTier;
    const recommendedPackageId = recommendedTierKey === 'bronze' ? 'A1' : recommendedTierKey === 'silver' ? 'A2' : 'A3';
    const derivedAddOns = deriveHomeSecurityQuoteAddOns(nextPlan, plannerDraft);
    track('hs_planner_applied_to_quote', {
      recommendedTier: recommendedTierKey,
      add_ons_count: derivedAddOns.ids.length,
    });
    updateRetailFlow({
      homeSecurity: {
        plannerRecommendation: {
          recommendedTierKey,
          recommendedPackageId,
          recommendedAddOnIds: derivedAddOns.ids,
          recommendedAddOnNotes: Object.keys(derivedAddOns.notes).length > 0 ? derivedAddOns.notes : undefined,
          generatedAtISO: new Date().toISOString(),
        },
      },
    });
    navigate(`/quote?vertical=home-security&tier=${recommendedPackageId}`);
  };

  const handleSelectFloor = (floorId: string) => {
    setSelectedFloorId(floorId);
    setSelectedRoomId(undefined);
  };

  const handleCanvasClick = (point: { x: number; y: number }) => {
    if (!activeDeviceKey || !selectedFloor) return;
    const item = DEVICE_CATALOG[activeDeviceKey];
    const snappedPoint = { x: snapToGrid(point.x), y: snapToGrid(point.y) };
    const targetRoom = findRoomAtPoint(selectedFloor, snappedPoint);
    const wallSnap = item.wallAnchored && targetRoom ? autoSnapToNearestWall(targetRoom.rect, snappedPoint) : undefined;
    const position =
      item.wallAnchored && wallSnap && targetRoom ? getWallInsetPosition(targetRoom.rect, wallSnap) : snappedPoint;
    const placement = createUserPlacement({
      deviceKey: activeDeviceKey,
      label: item.label,
      floorId: selectedFloor.id,
      roomId: targetRoom?.id,
      position,
      wallSnap,
      required: false,
    });
    setFloorplan((prev) => ({ ...prev, placements: [...prev.placements, placement] }));
    setSelectedPlacementId(placement.id);
  };

  const updatePlacement = (placementId: string, updates: Partial<FloorplanPlacement>) => {
    setFloorplan((prev) => ({
      ...prev,
      placements: prev.placements.map((placement) =>
        placement.id === placementId ? { ...placement, ...updates } : placement,
      ),
    }));
  };

  const handlePlacementWallChange = (wall: FloorplanWall) => {
    if (!selectedPlacement) return;
    const offset = selectedPlacement.wallSnap?.offset ?? 0.5;
    const wallSnap = { wall, offset };
    const position =
      selectedPlacementRoom && selectedFloor
        ? getWallInsetPosition(selectedPlacementRoom.rect, wallSnap)
        : selectedPlacement.position;
    updatePlacement(selectedPlacement.id, { wallSnap, position, roomId: selectedPlacementRoom?.id });
  };

  const handlePlacementWallOffsetChange = (offsetPercent: number) => {
    if (!selectedPlacement) return;
    const wall = selectedPlacement.wallSnap?.wall ?? 'n';
    const wallSnap = { wall, offset: Math.min(Math.max(offsetPercent / 100, 0), 1) };
    const position =
      selectedPlacementRoom && selectedFloor
        ? getWallInsetPosition(selectedPlacementRoom.rect, wallSnap)
        : selectedPlacement.position;
    updatePlacement(selectedPlacement.id, { wallSnap, position, roomId: selectedPlacementRoom?.id });
  };

  const handleSnapPlacementToNearestWall = () => {
    if (!selectedPlacement || !selectedPlacementRoom) return;
    const wallSnap = autoSnapToNearestWall(selectedPlacementRoom.rect, selectedPlacement.position);
    const position = getWallInsetPosition(selectedPlacementRoom.rect, wallSnap);
    updatePlacement(selectedPlacement.id, { wallSnap, position, roomId: selectedPlacementRoom.id });
  };

  const handlePlacementRotationChange = (value: number) => {
    if (!selectedPlacement) return;
    updatePlacement(selectedPlacement.id, { rotation: clampRotation(value) });
  };

  const updateRoom = (roomId: string, updates: Partial<FloorplanRoom>) => {
    setFloorplan((prev) => ({
      ...prev,
      floors: prev.floors.map((floor) =>
        floor.id === selectedFloorId
          ? {
              ...floor,
              rooms: floor.rooms.map((room) => (room.id === roomId ? { ...room, ...updates } : room)),
            }
          : floor,
      ),
    }));
  };

  const handleAddRoom = () => {
    setFloorplan((prev) => {
      const nextFloors = prev.floors.map((floor) => ({ ...floor }));
      const floorIndex = nextFloors.findIndex((floor) => floor.id === selectedFloorId);
      if (floorIndex === -1) return prev;
      const targetFloor = nextFloors[floorIndex];
      const nextRoomIndex = targetFloor.rooms.length;
      const newRoom: FloorplanRoom = {
        id: `room-${Date.now()}-${nextRoomIndex + 1}`,
        name: `Room ${nextRoomIndex + 1}`,
        rect: { x: 24, y: 24 + nextRoomIndex * 70, w: 160, h: 56 },
        doors: [],
        windows: [],
      };
      targetFloor.rooms = [...targetFloor.rooms, newRoom];
      return { ...prev, floors: nextFloors };
    });
  };

  const handleAddDoorMarker = () => {
    if (!selectedRoom) return;
    const nextDoors = [
      ...selectedRoom.doors,
      createDoor('Door', {
        wall: 's',
        offset: 0.5,
        exterior: true,
      }),
    ];
    updateRoom(selectedRoom.id, { doors: nextDoors });
  };

  const handleUpdateDoorMarker = (doorId: string, updates: Partial<FloorplanRoom['doors'][number]>) => {
    if (!selectedRoom) return;
    updateRoom(selectedRoom.id, {
      doors: selectedRoom.doors.map((door) => (door.id === doorId ? { ...door, ...updates } : door)),
    });
  };

  const handleRemoveDoorMarker = (doorId: string) => {
    if (!selectedRoom) return;
    updateRoom(selectedRoom.id, { doors: selectedRoom.doors.filter((door) => door.id !== doorId) });
  };

  const handleAddWindowMarker = () => {
    if (!selectedRoom) return;
    const nextWindows = [
      ...selectedRoom.windows,
      createWindow('Window', {
        wall: 's',
        offset: 0.5,
      }),
    ];
    updateRoom(selectedRoom.id, { windows: nextWindows });
  };

  const handleUpdateWindowMarker = (windowId: string, updates: Partial<FloorplanRoom['windows'][number]>) => {
    if (!selectedRoom) return;
    updateRoom(selectedRoom.id, {
      windows: selectedRoom.windows.map((window) => (window.id === windowId ? { ...window, ...updates } : window)),
    });
  };

  const handleRemoveWindowMarker = (windowId: string) => {
    if (!selectedRoom) return;
    updateRoom(selectedRoom.id, { windows: selectedRoom.windows.filter((window) => window.id !== windowId) });
  };

  const handleDeleteRoom = (roomId: string) => {
    setFloorplan((prev) => ({
      ...prev,
      floors: prev.floors.map((floor) =>
        floor.id === selectedFloorId ? { ...floor, rooms: floor.rooms.filter((room) => room.id !== roomId) } : floor,
      ),
    }));
    if (selectedRoomId === roomId) {
      setSelectedRoomId(undefined);
    }
  };

  const handleRemovePlacement = (placementId: string) => {
    setFloorplan((prev) => ({
      ...prev,
      placements: prev.placements.filter((placement) => placement.id !== placementId),
    }));
    if (selectedPlacementId === placementId) {
      setSelectedPlacementId(null);
    }
  };

  const handleResetMap = () => {
    const reset = createEmptyFloorplan(wizardFloors);
    setFloorplan(reset);
    setSelectedFloorId(reset.floors[0]?.id ?? 'floor-1');
    setSelectedRoomId(undefined);
    setSelectedPlacementId(null);
    setActiveDeviceKey(null);
  };

  const tierComparisonNote = useMemo(() => {
    if (!plan || plan.coverage.status !== 'gap') return null;
    const order: PlannerTierKey[] = ['bronze', 'silver', 'gold'];
    const currentIndex = order.indexOf(selectedTier);
    const higherTier = plan.bundles.find(
      (bundle) => order.indexOf(bundle.tier) > currentIndex && bundle.coverage_status === 'complete',
    );
    if (!higherTier) return null;
    const label = higherTier.tier.charAt(0).toUpperCase() + higherTier.tier.slice(1);
    return `${label} covers your doors without add-ons.`;
  }, [plan, selectedTier]);

  return (
    <section className="section">
      <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
        <HomeSecurityFunnelSteps currentStep="fit-check" />
        <div className="hero-card" style={{ display: 'grid', gap: '0.75rem' }}>
          <h1 style={{ margin: 0 }}>Home Security Precision Planner</h1>
          <p style={{ margin: 0, color: '#c8c0aa' }}>Optional. For customers who want surgical precision.</p>
          <p style={{ margin: 0, color: '#c8c0aa' }}>This does not change your package unless you choose to.</p>
        </div>

        <AccordionSection title="What the Precision Planner does" description="" defaultOpen={false}>
          <ul className="operator-list" style={{ margin: 0 }}>
            <li>Checks whether your exterior doors are fully covered.</li>
            <li>Suggests camera angles and water-risk coverage.</li>
            <li>Shows what Bronze/Silver/Gold cover for your layout.</li>
            <li>Optional add-ons are quoted separately.</li>
          </ul>
        </AccordionSection>

        <div className="card" style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Property type</label>
            <select
              value={draft.propertyType ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  propertyType: (event.target.value || undefined) as PrecisionPlannerDraft['propertyType'],
                }))
              }
            >
              <option value="">Select</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="rental">Rental</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Floors</label>
            <select
              value={draft.floors ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  floors: event.target.value ? (Number(event.target.value) as PrecisionPlannerDraft['floors']) : undefined,
                }))
              }
            >
              <option value="">Select</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Size band</label>
            <select
              value={draft.sizeBand ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  sizeBand: (event.target.value || undefined) as PrecisionPlannerDraft['sizeBand'],
                }))
              }
            >
              <option value="">Select</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Garage</label>
            <select
              value={draft.garage ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  garage: (event.target.value || undefined) as PrecisionPlannerDraft['garage'],
                }))
              }
            >
              <option value="">Select</option>
              <option value="none">None</option>
              <option value="attached">Attached</option>
              <option value="detached">Detached</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <label style={{ fontWeight: 600 }}>Exterior doors</label>
            <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
              Tip: count any door that leads outside, including garage entry doors.
            </p>
            <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
              If you add exterior doors to the map below, the planner will use the map.
            </p>
            {exteriorDoors.length === 0 ? (
              <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>No doors added yet.</p>
            ) : null}
            {exteriorDoors.map((door, index) => (
              <div key={`door-${index}`} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={door}
                  placeholder="Door label"
                  onChange={(event) => handleDoorLabelChange(index, event.target.value)}
                />
                <button type="button" className="btn btn-secondary" onClick={() => handleRemoveDoor(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={handleAddDoor}>
              Add exterior door
            </button>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Ground-level windows</label>
            <select
              value={draft.groundWindows ?? ''}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  groundWindows: (event.target.value || undefined) as PrecisionPlannerDraft['groundWindows'],
                }))
              }
            >
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="some">Some</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={draft.pets ?? false}
                onChange={(event) => setDraft((prev) => ({ ...prev, pets: event.target.checked }))}
              />
              Pets
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={draft.elders ?? false}
                onChange={(event) => setDraft((prev) => ({ ...prev, elders: event.target.checked }))}
              />
              Elders
            </label>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Priorities (choose up to 2)</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {priorityOptions.map((option) => {
                const checked = priorities.includes(option);
                const disabled = !checked && priorities.length >= 2;
                return (
                  <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => handlePriorityToggle(option)}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600 }}>Compare tier</label>
            <select value={selectedTier} onChange={(event) => handleTierChange(event.target.value as PlannerTierKey)}>
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
            </select>
            <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
              This only affects the planner comparison, not your checkout flow.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={handleSaveDraft}>
              Save draft
            </button>
            <Link className="btn btn-link" to="/discovery?vertical=home-security">
              Back to Fit Check
            </Link>
            <Link className="btn btn-link" to="/packages?vertical=home-security">
              Back to Packages
            </Link>
            <button type="button" className="btn btn-secondary" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </div>

        <div className="card" style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gap: '0.35rem' }}>
            <h3 style={{ margin: 0 }}>Build a simple map (optional)</h3>
            <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
              Fast: make a simple room layout in under 2 minutes.
            </p>
            <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
              You can skip this and keep recommendations.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {floorplan.floors.map((floor) => (
              <button
                key={floor.id}
                type="button"
                className="btn btn-secondary"
                onClick={() => handleSelectFloor(floor.id)}
                style={{
                  borderColor: floor.id === selectedFloorId ? '#6cf6ff' : undefined,
                  color: floor.id === selectedFloorId ? '#6cf6ff' : undefined,
                }}
              >
                {floor.label}
              </button>
            ))}
            <button type="button" className="btn btn-link" onClick={handleResetMap}>
              Reset map
            </button>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <strong>Templates</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFloorplan((prev) => applyTemplateToFloors('apartment', prev, draft.garage))}
              >
                Apartment
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFloorplan((prev) => applyTemplateToFloors('ranch', prev, draft.garage))}
              >
                Ranch
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFloorplan((prev) => applyTemplateToFloors('2-story', prev, draft.garage))}
              >
                2-Story
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <strong>Rooms on {selectedFloor?.label ?? 'Floor'}</strong>
              {selectedFloor?.rooms.length ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {selectedFloor.rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        border: room.id === selectedRoomId ? '1px solid #6cf6ff' : '1px solid rgba(255, 255, 255, 0.12)',
                        background: room.id === selectedRoomId ? 'rgba(108, 246, 255, 0.12)' : 'rgba(15, 19, 32, 0.6)',
                        display: 'grid',
                        gap: '0.5rem',
                      }}
                    >
                      <input
                        type="text"
                        value={room.name}
                        onChange={(event) => updateRoom(room.id, { name: event.target.value })}
                        onFocus={() => setSelectedRoomId(room.id)}
                      />
                      <select
                        value={room.kind ?? ''}
                        onChange={(event) =>
                          updateRoom(room.id, { kind: (event.target.value || undefined) as FloorplanRoomKind })
                        }
                      >
                        <option value="">Room kind (optional)</option>
                        {roomKindOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="btn btn-secondary" onClick={() => handleDeleteRoom(room.id)}>
                        Delete room
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
                  No rooms added yet. Use a template or add rooms below.
                </p>
              )}
              <button type="button" className="btn btn-secondary" onClick={handleAddRoom}>
                Add room
              </button>
              <div
                style={{
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '0.75rem',
                  background: 'rgba(15, 19, 32, 0.6)',
                  display: 'grid',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <strong>Room details</strong>
                  <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
                    {selectedRoom ? selectedRoom.name : 'Select a room to edit doors and windows.'}
                  </p>
                </div>
                {selectedRoom ? (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      <strong>Doors</strong>
                      {selectedRoom.doors.length === 0 ? (
                        <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>No doors yet.</p>
                      ) : null}
                      {selectedRoom.doors.map((door) => (
                        <div key={door.id} style={{ display: 'grid', gap: '0.5rem' }}>
                          <input
                            type="text"
                            value={door.label}
                            placeholder="Door label"
                            onChange={(event) => handleUpdateDoorMarker(door.id, { label: event.target.value })}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <label style={{ display: 'grid', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.8rem', color: 'rgba(214, 233, 248, 0.75)' }}>Wall</span>
                              <select
                                value={door.wall}
                                onChange={(event) =>
                                  handleUpdateDoorMarker(door.id, { wall: event.target.value as FloorplanWall })
                                }
                              >
                                {wallOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label style={{ display: 'grid', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.8rem', color: 'rgba(214, 233, 248, 0.75)' }}>Offset</span>
                              <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={door.offset}
                                onChange={(event) =>
                                  handleUpdateDoorMarker(door.id, { offset: Number(event.target.value) })
                                }
                              />
                            </label>
                            <label style={{ display: 'grid', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.8rem', color: 'rgba(214, 233, 248, 0.75)' }}>Exterior</span>
                              <input
                                type="checkbox"
                                checked={Boolean(door.exterior)}
                                onChange={(event) => handleUpdateDoorMarker(door.id, { exterior: event.target.checked })}
                              />
                            </label>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(214, 233, 248, 0.75)' }}>
                            Exterior doors are doors that lead outside.
                          </p>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleRemoveDoorMarker(door.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button type="button" className="btn btn-secondary" onClick={handleAddDoorMarker}>
                        Add door
                      </button>
                    </div>

                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      <strong>Windows</strong>
                      {selectedRoom.windows.length === 0 ? (
                        <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>No windows yet.</p>
                      ) : null}
                      {selectedRoom.windows.map((window) => (
                        <div key={window.id} style={{ display: 'grid', gap: '0.5rem' }}>
                          <input
                            type="text"
                            value={window.label ?? ''}
                            placeholder="Window label (optional)"
                            onChange={(event) => handleUpdateWindowMarker(window.id, { label: event.target.value })}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <label style={{ display: 'grid', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.8rem', color: 'rgba(214, 233, 248, 0.75)' }}>Wall</span>
                              <select
                                value={window.wall}
                                onChange={(event) =>
                                  handleUpdateWindowMarker(window.id, { wall: event.target.value as FloorplanWall })
                                }
                              >
                                {wallOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label style={{ display: 'grid', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.8rem', color: 'rgba(214, 233, 248, 0.75)' }}>Offset</span>
                              <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={window.offset}
                                onChange={(event) =>
                                  handleUpdateWindowMarker(window.id, { offset: Number(event.target.value) })
                                }
                              />
                            </label>
                          </div>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => handleRemoveWindowMarker(window.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button type="button" className="btn btn-secondary" onClick={handleAddWindowMarker}>
                        Add window
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                alignItems: 'start',
              }}
            >
              <div style={{ minWidth: 0 }}>
                {selectedFloor ? (
                  <FloorplanCanvas
                    floor={selectedFloor}
                    placements={floorPlacements}
                    selectedRoomId={selectedRoomId}
                    selectedPlacementId={selectedPlacementId}
                    onSelectRoom={setSelectedRoomId}
                    onSelectPlacement={setSelectedPlacementId}
                    onUpdatePlacement={updatePlacement}
                    onCanvasClick={activeDeviceKey ? handleCanvasClick : undefined}
                  />
                ) : null}
              </div>
              <div
                style={{
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '1rem',
                  background: 'rgba(15, 19, 32, 0.6)',
                  display: 'grid',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'grid', gap: '0.35rem' }}>
                  <h4 style={{ margin: 0 }}>Place devices on your home map (optional)</h4>
                  <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
                    Device placements help us visualize coverage zones later.
                  </p>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <strong>Device legend</strong>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    {DEVICE_KEYS.map((deviceKey) => {
                      const item = DEVICE_CATALOG[deviceKey];
                      const Icon = item.icon;
                      const isActive = activeDeviceKey === deviceKey;
                      return (
                        <button
                          key={deviceKey}
                          type="button"
                          onClick={() => setActiveDeviceKey(deviceKey)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '0.5rem',
                            border: isActive ? '1px solid #6cf6ff' : '1px solid rgba(255, 255, 255, 0.12)',
                            background: isActive ? 'rgba(108, 246, 255, 0.12)' : 'transparent',
                            color: 'inherit',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <Icon width={20} height={20} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {activeCatalogItem ? (
                    <div style={{ display: 'grid', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(214, 233, 248, 0.85)' }}>
                        Click on the map to place this item.
                      </span>
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => setActiveDeviceKey(null)}
                        style={{ justifySelf: 'start' }}
                      >
                        Clear tool
                      </button>
                    </div>
                  ) : null}
                </div>

                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <strong>Placement details</strong>
                  {selectedPlacement && selectedPlacementItem ? (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <div style={{ display: 'grid', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(214, 233, 248, 0.75)' }}>Device</span>
                        <strong>{selectedPlacementItem.label}</strong>
                      </div>
                      {isWallAnchored(selectedPlacement.deviceKey) ? (
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          <label style={{ display: 'grid', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(214, 233, 248, 0.75)' }}>Wall</span>
                            <select
                              value={selectedPlacement.wallSnap?.wall ?? 'n'}
                              onChange={(event) => handlePlacementWallChange(event.target.value as FloorplanWall)}
                            >
                              {wallOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label style={{ display: 'grid', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(214, 233, 248, 0.75)' }}>
                              Wall offset ({Math.round((selectedPlacement.wallSnap?.offset ?? 0.5) * 100)}%)
                            </span>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              step={5}
                              value={Math.round((selectedPlacement.wallSnap?.offset ?? 0.5) * 100)}
                              onChange={(event) => handlePlacementWallOffsetChange(Number(event.target.value))}
                            />
                          </label>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleSnapPlacementToNearestWall}
                            disabled={!selectedPlacementRoom}
                          >
                            Snap to nearest wall
                          </button>
                        </div>
                      ) : null}
                      {isRotatableDevice(selectedPlacement.deviceKey) ? (
                        <label style={{ display: 'grid', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(214, 233, 248, 0.75)' }}>
                            Rotation ({Math.round(getPlacementRotation(selectedPlacement))}°)
                          </span>
                          <input
                            type="range"
                            min={0}
                            max={360}
                            step={15}
                            value={Math.round(getPlacementRotation(selectedPlacement))}
                            onChange={(event) => handlePlacementRotationChange(Number(event.target.value))}
                          />
                        </label>
                      ) : null}
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>Select a placement to edit it.</p>
                  )}
                </div>

                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <strong>Placements on {selectedFloor?.label ?? 'this floor'}</strong>
                  {floorPlacements.length === 0 ? (
                    <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>No placements yet.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {floorPlacements.map((placement) => {
                        const item = DEVICE_CATALOG[placement.deviceKey];
                        const Icon = item.icon;
                        const needsWall = item.wallAnchored && !placement.wallSnap;
                        return (
                          <div
                            key={placement.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.45rem 0.6rem',
                              borderRadius: '0.5rem',
                              border:
                                placement.id === selectedPlacementId
                                  ? '1px solid #6cf6ff'
                                  : '1px solid rgba(255, 255, 255, 0.12)',
                              background:
                                placement.id === selectedPlacementId
                                  ? 'rgba(108, 246, 255, 0.12)'
                                  : 'transparent',
                            }}
                          >
                            <Icon width={18} height={18} />
                            <span style={{ flex: 1 }}>{placement.label}</span>
                            {needsWall ? (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '0.1rem 0.35rem',
                                  borderRadius: '999px',
                                  border: '1px solid rgba(255, 107, 107, 0.6)',
                                  color: 'rgba(255, 107, 107, 0.9)',
                                }}
                              >
                                Needs wall
                              </span>
                            ) : null}
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => handleRemovePlacement(placement.id)}
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={resultsRef} className="card" style={{ display: 'grid', gap: '0.5rem' }}>
          <h3 style={{ margin: 0 }}>Planner results</h3>
          {plan ? (
            <>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background:
                    plan.coverage.status === 'gap'
                      ? 'rgba(255, 107, 107, 0.12)'
                      : plan.coverage.status === 'complete_with_addons'
                        ? 'rgba(255, 206, 86, 0.12)'
                        : 'rgba(46, 204, 113, 0.12)',
                }}
              >
                <strong>
                  {plan.coverage.status === 'gap'
                    ? '❌ Gap — fix required items first'
                    : plan.coverage.status === 'complete_with_addons'
                      ? '⚠️ Covered + optional add-ons'
                      : '✅ Covered'}
                </strong>
              </div>

              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'rgba(214, 233, 248, 0.85)' }}>
                {plan.coverage.summary.map((item, index) => (
                  <li key={item}>
                    {index === 0 && usingMapExteriorDoors
                      ? `${item} Based on your map, we counted ${plannerExteriorDoors.length} exterior doors.`
                      : item}
                  </li>
                ))}
              </ul>
              {plan.coverage.gaps.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.35rem' }}>
                  <strong>Coverage gaps</strong>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {plan.coverage.gaps.map((gap) => (
                      <li key={`${gap.key}-${gap.missing}`}>
                        {gap.impact}: missing {gap.missing}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div style={{ display: 'grid', gap: '0.35rem' }}>
                <strong>Required placements</strong>
                {plan.placements.length === 0 ? (
                  <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>No placements yet.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {plan.placements.map((placement) => (
                      <li key={`${placement.key}-${placement.label}`}>
                        {placement.label} — {placement.quantity}
                        {placement.zones && placement.zones.length > 0 ? ` (${placement.zones.join(', ')})` : ''}
                        {placement.notes && placement.notes.length > 0 ? ` — ${placement.notes.join(' ')}` : ''}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ display: 'grid', gap: '0.35rem' }}>
                <strong>Optional add-ons</strong>
                {plan.optionalAddons.length === 0 ? (
                  <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>No optional add-ons suggested.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {plan.optionalAddons.map((addon) => (
                      <li key={`${addon.key}-${addon.label}`}>
                        {addon.label} — {addon.quantity}
                        {addon.zones && addon.zones.length > 0 ? ` (${addon.zones.join(', ')})` : ''}
                        {addon.notes && addon.notes.length > 0 ? ` — ${addon.notes.join(' ')}` : ''}
                      </li>
                    ))}
                  </ul>
                )}
                <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.75)' }}>
                  Passive suggestion: Wall-mounted tablet/dashboard (quoted separately).
                </p>
              </div>

              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <strong>Tier comparison</strong>
                <div style={{ display: 'grid', gap: '0.35rem' }}>
                  {plan.bundles.map((bundle) => (
                    <div key={bundle.tier} style={{ color: 'rgba(214, 233, 248, 0.85)' }}>
                      {bundle.top_line}
                    </div>
                  ))}
                </div>
                {tierComparisonNote ? (
                  <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.85)' }}>{tierComparisonNote}</p>
                ) : null}
              </div>
            </>
          ) : (
            <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.8)' }}>
              Run the planner to see placements, coverage, and tier comparisons.
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={handleApplyToQuote}>
              Apply to Quote
            </button>
            <button type="button" className="btn btn-link">
              Continue without applying
            </button>
          </div>
          <p style={{ margin: 0, color: 'rgba(214, 233, 248, 0.8)' }}>You can change anything on the quote page.</p>
        </div>
      </div>
    </section>
  );
};

export default HomeSecurityPlanner;
