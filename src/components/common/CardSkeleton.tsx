import Skeleton from './Skeleton';

const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" width="48px" height="48px" />
        <div className="flex-1">
          <Skeleton width="60%" height="24px" className="mb-2" />
          <Skeleton width="40%" height="16px" />
        </div>
      </div>
      <Skeleton width="100%" height="16px" className="mb-2" />
      <Skeleton width="80%" height="16px" />
    </div>
  );
};

export default CardSkeleton;
