import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  fetchSchemes,
  fetchSchemeById,
  setFilter,
  clearFilter,
  incrementSchemeView,
} from '../store/slices/schemeSlice';
import SchemeCard from '../components/cards/SchemeCard';
import Loader from '../components/common/Loader';
import { GovernmentScheme } from '../types';

const GovernmentSchemes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schemes, currentScheme, loading, filter, categories, states } = useSelector(
    (state: RootState) => state.scheme
  );

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchSchemes(filter));
  }, [dispatch, filter]);

  const handleSchemeClick = async (scheme: GovernmentScheme) => {
    await dispatch(fetchSchemeById(scheme.id));
    dispatch(incrementSchemeView(scheme.id));
    setShowDetailModal(true);
  };

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
    dispatch(setFilter({ [key]: value }));
  };

  const handleSearch = () => {
    dispatch(setFilter({ search: searchQuery }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilter());
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-agri-beige-soft py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Government Schemes for Farmers 🏛️
          </h1>
          <p className="text-gray-600">
            Explore various government schemes, subsidies, loans, and benefits available for farmers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          {/* Search */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Search schemes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-agri-green text-white rounded-lg hover:bg-green-700 transition"
            >
              Search
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filter.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State
              </label>
              <select
                value={filter.state || ''}
                onChange={(e) => handleFilterChange('state', e.target.value || undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filter.isActive === undefined ? '' : filter.isActive.toString()}
                onChange={(e) => 
                  handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={handleClearFilters}
            className="mt-3 text-sm text-agri-green hover:underline"
          >
            Clear all filters
          </button>
        </div>

        {/* Schemes Grid */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.length === 0 ? (
              <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">No schemes found matching your criteria.</p>
              </div>
            ) : (
              schemes.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  onClick={() => handleSchemeClick(scheme)}
                />
              ))
            )}
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && currentScheme && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex-1">
                    {currentScheme.title}
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl ml-4"
                  >
                    ×
                  </button>
                </div>

                {/* Image */}
                {currentScheme.imageUrl && (
                  <img
                    src={currentScheme.imageUrl}
                    alt={currentScheme.title}
                    className="w-full h-64 object-cover rounded mb-4"
                  />
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-agri-green-soft text-agri-green rounded-full text-sm font-semibold">
                    {currentScheme.category.toUpperCase()}
                  </span>
                  {currentScheme.state && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      📍 {currentScheme.state}
                    </span>
                  )}
                  {currentScheme.isActive ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      ✓ Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      ✗ Inactive
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{currentScheme.description}</p>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Benefits</h3>
                  <ul className="space-y-2">
                    {currentScheme.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eligibility */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Eligibility Criteria</h3>
                  <ul className="space-y-2">
                    {currentScheme.eligibility.map((criteria, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-600">•</span>
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Documents Required */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Documents Required</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {currentScheme.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <span>📄</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deadline */}
                {currentScheme.applicationDeadline && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-700 font-semibold">
                      ⏰ Application Deadline: {new Date(currentScheme.applicationDeadline).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    {currentScheme.contactInfo.phone && (
                      <p>📞 {currentScheme.contactInfo.phone}</p>
                    )}
                    {currentScheme.contactInfo.email && (
                      <p>📧 {currentScheme.contactInfo.email}</p>
                    )}
                    {currentScheme.contactInfo.website && (
                      <p>
                        🌐 <a href={currentScheme.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-agri-green hover:underline">
                          {currentScheme.contactInfo.website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Apply Button */}
                {currentScheme.applicationLink && currentScheme.isActive && (
                  <a
                    href={currentScheme.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-agri-green text-white text-center py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Apply Now →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentSchemes;
