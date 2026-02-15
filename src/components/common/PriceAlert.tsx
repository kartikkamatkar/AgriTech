import { useState } from 'react';

interface PriceAlertProps {
  cropName: string;
  currentPrice: number;
  onSetAlert: (targetPrice: number, direction: 'above' | 'below') => void;
}

const PriceAlert = ({ cropName, currentPrice, onSetAlert }: PriceAlertProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(currentPrice);
  const [direction, setDirection] = useState<'above' | 'below'>('above');

  const handleSubmit = () => {
    onSetAlert(targetPrice, direction);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-lg transition"
        title="Set price alert"
      >
        <span className="text-xl">🔔</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border-2 border-agri-beige-dark p-6 z-50 animate-fade-in">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Set Price Alert for {cropName}
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alert me when price goes
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDirection('above')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      direction === 'above'
                        ? 'bg-agri-green text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ⬆️ Above
                  </button>
                  <button
                    onClick={() => setDirection('below')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                      direction === 'below'
                        ? 'bg-agri-green text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ⬇️ Below
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Price (₹)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-agri-green"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Current price: ₹{currentPrice}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2 px-4 bg-agri-green text-white rounded-lg font-medium hover:bg-agri-green-light transition"
                >
                  Set Alert
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PriceAlert;
