// src/components/ui/Skeleton.js
import "./Skeleton.css";

const Skeleton = ({
  width = "100%",
  height = "20px",
  borderRadius = "4px",
}) => <div className="skeleton" style={{ width, height, borderRadius }} />;

export const CardSkeleton = () => (
  <div className="card-skeleton">
    <Skeleton height="180px" borderRadius="8px" />
    <Skeleton width="70%" height="24px" />
    <Skeleton width="50%" height="16px" />
    <Skeleton width="90%" height="14px" />
  </div>
);

export default Skeleton;
