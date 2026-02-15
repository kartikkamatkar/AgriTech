import { useState, useRef, useEffect } from 'react';

interface LocationSelectorProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  onUseLocation: () => void;
}

const LocationSelector = ({ currentCity, onCityChange, onUseLocation }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const popularCities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Chandigarh', 'Indore', 'Bhopal', 'Patna', 'Nagpur'
  ];

  const filteredCities = popularCities.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city: string) => {
    onCityChange(city);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-agri-beige-dark rounded-lg hover:border-agri-green transition shadow-sm"
      >
        <span className="text-xl">📍</span>
        <span className="font-semibold text-gray-800">{currentCity}</span>
        <span className="text-gray-500">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-80 bg-white rounded-xl shadow-xl border-2 border-agri-beige-dark z-50 animate-fade-in">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cities..."
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-agri-green transition"
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            <button
              onClick={() => {
                onUseLocation();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-agri-green-soft transition text-left border-b border-gray-100"
            >
              <span className="text-xl">🎯</span>
              <div>
                <div className="font-semibold text-gray-900">Use My Location</div>
                <div className="text-xs text-gray-600">Auto-detect current location</div>
              </div>
            </button>

            {filteredCities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-agri-green-soft transition text-left ${
                  city === currentCity ? 'bg-agri-green-soft' : ''
                }`}
              >
                <span className="text-xl">🏙️</span>
                <span className="font-medium text-gray-800">{city}</span>
                {city === currentCity && (
                  <span className="ml-auto text-agri-green">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
