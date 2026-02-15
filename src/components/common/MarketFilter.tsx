import { useState } from 'react';

interface MarketFilterProps {
  onFilterChange: (filters: {
    trend: string[];
    priceRange: { min: number; max: number } | null;
    crops: string[];
  }) => void;
}

const MarketFilter = ({ onFilterChange }: MarketFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const trends = ['rising', 'stable', 'falling'];
  const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize'];

  const toggleTrend = (trend: string) => {
    setSelectedTrends(prev => 
      prev.includes(trend) ? prev.filter(t => t !== trend) : [...prev, trend]
    );
  };

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev => 
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  };

  const applyFilters = () => {
    onFilterChange({
      trend: selectedTrends,
      priceRange: minPrice || maxPrice ? {
        min: minPrice ? Number(minPrice) : 0,
        max: maxPrice ? Number(maxPrice) : Infinity,
      } : null,
      crops: selectedCrops,
    });
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSelectedTrends([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedCrops([]);
    onFilterChange({ trend: [], priceRange: null, crops: [] });
  };

  const activeFilterCount = selectedTrends.length + selectedCrops.length + (minPrice || maxPrice ? 1 : 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-agri-beige-dark rounded-lg hover:border-agri-green transition shadow-sm"
      >
        <span className="text-xl">🔍</span>
        <span className="font-semibold text-gray-800">Filter</span>
        {activeFilterCount > 0 && (
          <span className="bg-agri-green text-white text-xs font-bold px-2 py-1 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border-2 border-agri-beige-dark p-6 z-50 animate-fade-in max-h-[80vh] overflow-y-auto">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Filter Market Data
            </h4>

            {/* Trend Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Market Trend
              </label>
              <div className="flex flex-wrap gap-2">
                {trends.map(trend => (
                  <button
                    key={trend}
                    onClick={() => toggleTrend(trend)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                      selectedTrends.includes(trend)
                        ? 'bg-agri-green text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {trend === 'rising' ? '📈' : trend === 'falling' ? '📉' : '➡️'} {trend}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price Range (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-agri-green"
                />
                <span className="flex items-center text-gray-500">—</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-agri-green"
                />
              </div>
            </div>

            {/* Crop Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Crops
              </label>
              <div className="space-y-2">
                {cropTypes.map(crop => (
                  <label key={crop} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCrops.includes(crop)}
                      onChange={() => toggleCrop(crop)}
                      className="w-4 h-4 text-agri-green border-gray-300 rounded focus:ring-agri-green"
                    />
                    <span className="text-gray-800 font-medium">{crop}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-2 px-4 bg-agri-green text-white rounded-lg font-medium hover:bg-agri-green-light transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MarketFilter;
