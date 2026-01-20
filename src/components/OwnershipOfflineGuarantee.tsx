import SpaceFrame from './operator/SpaceFrame';

type OwnershipOfflineGuaranteeProps = {
  title?: string;
  intro?: string;
  variant?: 'card' | 'frame';
  className?: string;
};

const OwnershipOfflineGuarantee = ({
  title = 'Ownership & Offline Guarantee',
  intro = 'Clear expectations for what you control, what stays local, and what remains optional.',
  variant = 'card',
  className = '',
}: OwnershipOfflineGuaranteeProps) => {
  const content = (
    <>
      <div className="badge">Ownership & Offline Guarantee</div>
      <h3 style={{ marginTop: '0.35rem', color: '#fff7e6' }}>{title}</h3>
      <p style={{ marginTop: 0, color: '#c8c0aa' }}>{intro}</p>
      <ul className="operator-list">
        <li>You own the equipment, automations, and data (wireless-first and privacy-first by default).</li>
        <li>No monthly fees sold by us; optional third-party services connect directly to you.</li>
        <li>Offline Dignity Rule: core functions work without internet for safety and daily routines.</li>
        <li>Cloud access is only for optional external context and remote sharing.</li>
        <li>Home Assistant remains the single dashboard for every vertical.</li>
      </ul>
    </>
  );

  if (variant === 'frame') {
    return <SpaceFrame className={className}>{content}</SpaceFrame>;
  }

  return <div className={`card ${className}`.trim()}>{content}</div>;
};

export default OwnershipOfflineGuarantee;
