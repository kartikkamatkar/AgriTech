import { useAppSelector } from '../store/hooks';

const Profile = () => {
  const { seasonalData } = useAppSelector((state) => state.farmAnalytics);
  const { crops } = useAppSelector((state) => state.crop);

  // In a real app, this would come from authenticated user data
  const farmerProfile = {
    name: 'Farmer Profile',
    location: 'Delhi, India',
    farmSize: '15 acres',
    experience: '10+ years',
    crops: crops.length > 0 ? crops.map(c => c.name) : seasonalData.recommendedCrops.slice(0, 3),
    seasonGoal: `Achieve optimal yield in ${seasonalData.name} season`,
  };

  return (
    <div className="min-h-screen bg-agri-beige">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">👨‍🌾</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Farmer Profile</h1>
              <p className="text-sm text-gray-700 font-medium">Your farming journey and goals</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-agri-beige-dark p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-agri-green-soft rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  👨‍🌾
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{farmerProfile.name}</h3>
                <p className="text-sm text-gray-600">{farmerProfile.location}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Farm Size</span>
                  <span className="text-sm font-semibold text-gray-800">{farmerProfile.farmSize}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="text-sm font-semibold text-gray-800">{farmerProfile.experience}</span>
                </div>
                <div className="py-2">
                  <div className="text-sm text-gray-600 mb-2">Current Crops</div>
                  <div className="flex flex-wrap gap-2">
                    {farmerProfile.crops.map((crop, index) => (
                      <span key={index} className="text-xs bg-agri-green-soft text-agri-green px-3 py-1 rounded-full">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals and Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Season Goal */}
            <div className="bg-gradient-to-br from-agri-green to-agri-green-light text-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">🎯</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{seasonalData.name} Season Goal</h3>
                  <p className="text-lg font-medium">{farmerProfile.seasonGoal}</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 border border-white border-opacity-30">
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span>Progress</span>
                  <span className="font-semibold">
                    {crops.length > 0 ? Math.round((crops.filter(c => new Date(c.expectedHarvest) <= new Date()).length / crops.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${crops.length > 0 ? Math.round((crops.filter(c => new Date(c.expectedHarvest) <= new Date()).length / crops.length) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Season's Achievements</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="text-2xl font-bold text-green-700 mb-1">
                    {crops.reduce((sum, c) => sum + c.areaPlanted, 0).toFixed(1)} acres
                  </div>
                  <div className="text-xs text-gray-700 font-semibold">Successfully Planted</div>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🌾</div>
                  <div className="text-2xl font-bold text-blue-700 mb-1">{crops.length}</div>
                  <div className="text-xs text-gray-700 font-semibold">Active Crops</div>
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-yellow-700 mb-1">
                    {crops.length > 0 ? Math.round(crops.reduce((sum, c) => sum + c.health, 0) / crops.length) : 0}%
                  </div>
                  <div className="text-xs text-gray-700 font-semibold">Average Health</div>
                </div>
              </div>
            </div>

            {/* Season Reflection */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Farming Journey</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-agri-green pl-4 py-2">
                  <div className="text-sm text-gray-700 font-semibold mb-1">Best Decision</div>
                  <p className="text-gray-900 font-medium">Switched to drip irrigation - saved water and increased yield</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <div className="text-sm text-gray-700 font-semibold mb-1">Learning Point</div>
                  <p className="text-gray-900 font-medium">Early pest detection is crucial - weekly monitoring helps</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="text-sm text-gray-700 font-semibold mb-1">Next Season Plan</div>
                  <p className="text-gray-900 font-medium">Diversify crops and try organic fertilizers</p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Farming Preferences</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-700 font-semibold mb-2">Preferred Season</div>
                  <div className="font-bold text-gray-900">Rabi (Winter)</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-700 font-semibold mb-2">Farming Style</div>
                  <div className="font-bold text-gray-900">Mixed Cropping</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-700 font-semibold mb-2">Primary Focus</div>
                  <div className="font-bold text-gray-900">Sustainable Yield</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-700 font-semibold mb-2">Market Strategy</div>
                  <div className="font-bold text-gray-900">Hold for Peak Price</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
