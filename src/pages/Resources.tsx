import { useState, useMemo, useEffect } from 'react';
import { 
  getAllResources, 
  getGovernmentSchemes,
  getResourceCategories,
  getResourceSeasons,
  type ResourceArticle,
  type GovernmentScheme
} from '../services/resourceService';

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'views' | 'recent'>('rating');
  
  // Real data from resource service
  const [resources, setResources] = useState<ResourceArticle[]>([]);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);

  // Load real resources on mount
  useEffect(() => {
    const loadResources = () => {
      setResources(getAllResources());
      setSchemes(getGovernmentSchemes());
    };
    loadResources();
  }, []);

  // Extract unique values for filters from real data
  const categories = useMemo(() => {
    return ['all', ...getResourceCategories()];
  }, []);

  const seasons = useMemo(() => {
    return ['all', ...getResourceSeasons()];
  }, []);

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // Apply season filter
    if (selectedSeason !== 'all') {
      filtered = filtered.filter(r => r.season.includes(selectedSeason));
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(r => r.difficulty === selectedDifficulty);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.crops.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'views':
          return b.views - a.views;
        case 'recent':
          return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [resources, selectedCategory, selectedSeason, selectedDifficulty, searchTerm, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Crop Care': '🌱',
      'Pest Control': '🐛',
      'Soil Health': '🌍',
      'Water Management': '💧',
      'Market Strategy': '💰',
      'Technology': '🔬'
    };
    return icons[category] || '📚';
  };

  return (
    <div className="min-h-screen bg-agri-beige">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl animate-bounce-slow">📚</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Knowledge Board</h1>
              <p className="text-sm text-gray-700 font-medium">Curated resources to help you grow better crops</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search by title, crops, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-agri-green focus:outline-none transition font-medium"
            />
            <span className="absolute left-4 top-3.5 text-xl">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-agri-green focus:outline-none font-medium capitalize"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Season Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Season</label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-agri-green focus:outline-none font-medium capitalize"
              >
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-agri-green focus:outline-none font-medium capitalize"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-agri-green focus:outline-none font-medium"
              >
                <option value="rating">Top Rated</option>
                <option value="views">Most Viewed</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-agri-green text-white rounded-full text-xs font-semibold flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-gray-200">✕</button>
              </span>
            )}
            {selectedSeason !== 'all' && (
              <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                Season: {selectedSeason}
                <button onClick={() => setSelectedSeason('all')} className="hover:text-gray-200">✕</button>
              </span>
            )}
            {selectedDifficulty !== 'all' && (
              <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                Difficulty: {selectedDifficulty}
                <button onClick={() => setSelectedDifficulty('all')} className="hover:text-gray-200">✕</button>
              </span>
            )}
            {(selectedCategory !== 'all' || selectedSeason !== 'all' || selectedDifficulty !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSeason('all');
                  setSelectedDifficulty('all');
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-300"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="mt-3 text-sm text-gray-600 font-medium">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark hover:shadow-lg transition group cursor-pointer animate-slide-in-up"
            >
              <div className="h-2 bg-gradient-to-r from-agri-green to-agri-green-light"></div>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(resource.category)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border font-semibold capitalize ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span>⭐</span>
                    <span className="text-sm font-bold text-gray-900">{resource.rating}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-agri-green transition line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-600 font-medium mb-3">
                  <div className="flex items-center gap-1">
                    <span>👁️</span>
                    <span>{resource.views.toLocaleString()} views</span>
                  </div>
                  <span>⏱️ {resource.readTime} min read</span>
                </div>

                {/* Category & Season Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold">
                    {resource.category}
                  </span>
                  {resource.season.map((s, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-semibold">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Applicable Crops */}
                <div className="mb-4">
                  <div className="text-xs text-gray-600 font-semibold mb-1">Crops:</div>
                  <div className="flex flex-wrap gap-1">
                    {resource.crops.map((crop, idx) => (
                      <span key={idx} className="text-xs bg-agri-green-soft text-agri-green px-2 py-1 rounded font-semibold">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-agri-green text-white py-2 rounded-lg font-semibold hover:bg-agri-green-light transition">
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredResources.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border-2 border-agri-beige-dark p-12 text-center">
            <span className="text-6xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Resources Found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedSeason('all');
                setSelectedDifficulty('all');
              }}
              className="px-6 py-2 bg-agri-green text-white rounded-lg font-semibold hover:bg-agri-green-light transition"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Government Schemes Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🏛️</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Government Schemes</h2>
              <p className="text-sm text-gray-600 font-medium">Financial support and benefits for farmers</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {schemes.map((scheme) => (
              <div key={scheme.id} className="bg-white rounded-xl shadow-sm border-2 border-blue-200 hover:shadow-lg transition p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-4xl">{scheme.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">{scheme.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <div className="text-xs font-semibold text-green-700 mb-1">Benefits:</div>
                  <ul className="space-y-1">
                    {scheme.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-800 flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eligibility */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Eligibility:</div>
                  <ul className="space-y-1">
                    {scheme.eligibility.map((criteria, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">✓</span>
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Application Period */}
                <div className="flex items-center justify-between text-xs bg-gray-50 rounded p-2 mb-4">
                  <span className="text-gray-600 font-semibold">Application:</span>
                  <span className="font-bold text-gray-900">{scheme.applicationPeriod}</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-sm">
                    Apply Now
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition text-sm">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="mt-12 bg-gradient-to-r from-agri-green to-agri-green-light text-white rounded-xl shadow-sm p-12 text-center">
          <span className="text-6xl mb-4 block animate-bounce-slow">🤝</span>
          <h3 className="text-3xl font-bold mb-3">Farmer Community</h3>
          <p className="text-lg font-medium mb-6 max-w-2xl mx-auto opacity-90">
            Connect with fellow farmers, share experiences, and learn from each other's success stories
          </p>
          <button className="bg-white text-agri-green px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition shadow-lg">
            Join Community Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resources;
