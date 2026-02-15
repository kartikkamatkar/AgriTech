interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

const Skeleton = ({ 
  className = '', 
  variant = 'text',
  width = '100%',
  height = '20px'
}: SkeletonProps) => {
  const baseClasses = 'animate-pulse bg-gray-300 rounded';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
