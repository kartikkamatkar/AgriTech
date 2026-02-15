interface DailyTipCardProps {
  tip: string;
}

const DailyTipCard = ({ tip }: DailyTipCardProps) => {
  return (
    <div className="bg-gradient-to-r from-agri-green to-agri-green-light rounded-xl shadow-sm p-5 text-white">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <div className="text-xs uppercase tracking-wide font-semibold mb-1">Today's Tip</div>
          <div className="text-base font-semibold">{tip}</div>
        </div>
      </div>
    </div>
  );
};

export default DailyTipCard;
