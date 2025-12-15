import { getTierBadgeClass, getTierLabel, PackageTierId } from '../data/pricing';

type Props = {
  tierId: PackageTierId;
  labelOverride?: string;
  className?: string;
};

const TierBadge = ({ tierId, labelOverride, className }: Props) => {
  const classes = ['tier-badge', getTierBadgeClass(tierId), className].filter(Boolean).join(' ');
  return <span className={classes}>{labelOverride ?? getTierLabel(tierId)}</span>;
};

export default TierBadge;
