import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  loadAllCrops, 
  selectCrop, 
  fetchCropTimeline, 
  fetchCropActivities,
  addCrop,
  removeCrop,
} from '../store/slices/cropSlice';
import { setMessage } from '../store/slices/messageSlice';

const CropManagement = () => {
  const dispatch = useAppDispatch();
  const { 
    crops, 
    selectedCrop: reduxSelectedCrop, 
    timeline, 
    activities, 
    loading 
  } = useAppSelector((state) => state.crop);
  
  // Get selected city from global state
  const { selectedCity } = useAppSelector((state) => state.location);
  
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('active');
  const [showAddCropModal, setShowAddCropModal] = useState(false);

  // Load crops on mount
  useEffect(() => {
    dispatch(loadAllCrops());
  }, [dispatch]);

  // Load timeline and activities when a crop is selected
  useEffect(() => {
    if (reduxSelectedCrop) {
      dispatch(fetchCropTimeline(reduxSelectedCrop.id));
      dispatch(fetchCropActivities({ cropId: reduxSelectedCrop.id, daysAhead: 14 }));
    }
  }, [reduxSelectedCrop, dispatch]);

  // Filter crops based on status
  const filteredCrops = crops.filter(crop => {
    if (filterStatus === 'all') return true;
    const harvestDate = new Date(crop.expectedHarvest);
    const now = new Date();
    if (filterStatus === 'active') return harvestDate > now;
    return harvestDate <= now;
  });

  const handleSelectCrop = (crop: typeof crops[0]) => {
    dispatch(selectCrop(crop));
  };

  const handleAddCrop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await dispatch(addCrop({
        name: formData.get('name') as string,
        variety: formData.get('variety') as string,
        area: parseFloat(formData.get('area') as string),
        sowingDate: formData.get('sowingDate') as string,
        location: selectedCity, // Use global city from location state
      })).unwrap();
      
      dispatch(setMessage({ message: 'Crop added successfully', type: 'success' }));
      setShowAddCropModal(false);
    } catch (error) {
      dispatch(setMessage({ message: 'Failed to add crop', type: 'error' }));
    }
  };

  const handleDeleteCrop = (cropId: string) => {
    if (confirm('Are you sure you want to delete this crop?')) {
      dispatch(removeCrop(cropId));
      dispatch(setMessage({ message: 'Crop deleted', type: 'success' }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500 animate-pulse';
      case 'upcoming': return 'bg-gray-300';
      case 'missed': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-agri-beige">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl animate-bounce-slow">🌾</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crop Management</h1>
              <p className="text-sm text-gray-700 font-medium">Real-time crop tracking and care</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap items-center">
            {['all', 'active', 'completed'].map((status) => {
              const count = status === 'all' ? crops.length : 
                           filteredCrops.filter(c => {
                             const harvestDate = new Date(c.expectedHarvest);
                             return status === 'active' ? harvestDate > new Date() : harvestDate <= new Date();
                           }).length;
              
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${
                    filterStatus === status
                      ? 'bg-agri-green text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {status} Crops ({count})
                </button>
              );
            })}
            
            <button
              onClick={() => setShowAddCropModal(true)}
              className="ml-auto px-4 py-2 bg-agri-green text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              + Add Crop
            </button>
          </div>
        </div>

        {crops.length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-12 text-center">
            <span className="text-6xl block mb-4">🌱</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Crops Yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first crop to track</p>
            <button
              onClick={() => setShowAddCropModal(true)}
              className="px-6 py-3 bg-agri-green text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Add Your First Crop
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Crop List Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Crops</h3>
              {loading && crops.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agri-green mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading crops...</p>
                </div>
              ) : (
                filteredCrops.map((crop) => (
                  <button
                    key={crop.id}
                    onClick={() => handleSelectCrop(crop)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition transform hover:scale-105 ${
                      reduxSelectedCrop?.id === crop.id
                        ? 'border-agri-green bg-agri-green-soft shadow-lg'
                        : 'border-agri-beige-dark bg-white hover:border-agri-green'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">🌾</span>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{crop.name}</div>
                        <div className="text-xs text-gray-600">{crop.variety}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 space-y-1">
                      <div className="flex justify-between">
                        <span>Area:</span>
                        <span className="font-semibold">{crop.areaPlanted} acres</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Health:</span>
                        <span className={`font-semibold ${crop.health >= 80 ? 'text-green-600' : crop.health >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {crop.health}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stage:</span>
                        <span className="font-semibold capitalize">{crop.currentStage}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {reduxSelectedCrop ? (
                <>
                  {/* Crop Overview Card */}
                  <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6 animate-slide-in-up">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">🌾</span>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{reduxSelectedCrop.name}</h2>
                          <p className="text-gray-600">{reduxSelectedCrop.variety}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`inline-block px-4 py-2 rounded-lg font-bold ${
                          reduxSelectedCrop.health >= 80 ? 'bg-green-100 text-green-700' :
                          reduxSelectedCrop.health >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          Health: {reduxSelectedCrop.health}%
                        </div>
                        <button
                          onClick={() => handleDeleteCrop(reduxSelectedCrop.id)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                          title="Delete crop"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-600 mb-1">Area Planted</div>
                        <div className="text-xl font-bold text-gray-900">{reduxSelectedCrop.areaPlanted} acres</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-600 mb-1">Expected Yield</div>
                        <div className="text-xl font-bold text-gray-900">{reduxSelectedCrop.yield.expected} {reduxSelectedCrop.yield.unit}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-600 mb-1">Sowing Date</div>
                        <div className="text-xl font-bold text-gray-900">
                          {new Date(reduxSelectedCrop.sowingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-600 mb-1">Expected Harvest</div>
                        <div className="text-xl font-bold text-gray-900">
                          {new Date(reduxSelectedCrop.expectedHarvest).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-agri-green-soft border border-agri-green rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">💡</span>
                        <div>
                          <div className="font-semibold text-agri-green text-sm mb-1">Current Stage</div>
                          <div className="text-gray-900 font-bold">{reduxSelectedCrop.currentStage}</div>
                          <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-agri-green rounded-full transition-all duration-500"
                              style={{ width: `${reduxSelectedCrop.stageProgress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{reduxSelectedCrop.stageProgress}% complete</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Crop Timeline */}
                  {timeline.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>📅</span> Crop Timeline
                      </h3>
                      <div className="space-y-4">
                        {timeline.map((stage) => (
                          <div 
                            key={stage.id}
                            className={`border-l-4 pl-4 py-3 ${
                              stage.status === 'completed' ? 'border-green-500' :
                              stage.status === 'current' ? 'border-blue-500' :
                              stage.status === 'upcoming' ? 'border-gray-300' :
                              'border-red-500'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-gray-900">{stage.stage}</h4>
                                <p className="text-sm text-gray-600">{stage.date}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                stage.status === 'completed' ? 'bg-green-100 text-green-700' :
                                stage.status === 'current' ? 'bg-blue-100 text-blue-700' :
                                stage.status === 'upcoming' ? 'bg-gray-100 text-gray-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {stage.status}
                              </span>
                            </div>

                            {stage.status === 'current' && (
                              <div className="mb-3">
                                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="h-full bg-agri-green rounded-full transition-all duration-500"
                                    style={{ width: `${stage.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="bg-white rounded p-3 border border-gray-200">
                              <p className="text-sm text-gray-800 font-medium">💡 {stage.tip}</p>
                            </div>

                            {stage.actions.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {stage.actions.map((action, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-agri-green">✓</span>
                                    <span>{action}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Care Activities */}
                  {activities.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🔔</span> Upcoming Care Activities
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {activities.map((activity) => (
                          <div
                            key={activity.id}
                            className={`p-4 rounded-lg border-2 ${getPriorityColor(activity.priority)}`}
                          >
                            <div className="flex items-start gap-3 mb-2">
                              <span className="text-2xl">
                                {activity.type === 'irrigation' ? '💧' :
                                 activity.type === 'fertilizer' ? '🌱' :
                                 activity.type === 'pesticide' ? '🐛' :
                                 activity.type === 'weeding' ? '🌿' : '👁️'}
                              </span>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900">{activity.title}</h4>
                                <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">
                                    Due: {new Date(activity.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full font-semibold capitalize ${
                                    activity.priority === 'high' ? 'bg-red-200 text-red-800' :
                                    activity.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                    'bg-green-200 text-green-800'
                                  }`}>
                                    {activity.priority}
                                  </span>
                                </div>
                                {activity.weatherDependent && (
                                  <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                    ☁️ Weather dependent - check forecast before proceeding
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-12 text-center">
                  <span className="text-6xl block mb-4">🌾</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Crop Selected</h3>
                  <p className="text-gray-600">Select a crop from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Crop Modal */}
        {showAddCropModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Crop</h3>
              <form onSubmit={handleAddCrop} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Crop Name</label>
                  <select
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green focus:border-transparent"
                  >
                    <option value="">Select crop</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Sugarcane">Sugarcane</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Variety</label>
                  <input
                    type="text"
                    name="variety"
                    required
                    placeholder="e.g., HD-3086"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Area (acres)</label>
                  <input
                    type="number"
                    name="area"
                    required
                    step="0.1"
                    min="0.1"
                    placeholder="e.g., 10.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sowing Date</label>
                  <input
                    type="date"
                    name="sowingDate"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agri-green focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCropModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-agri-green text-white rounded-lg font-semibold hover:bg-green-600 transition"
                  >
                    Add Crop
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropManagement;
