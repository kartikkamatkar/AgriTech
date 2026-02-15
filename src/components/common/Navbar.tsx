import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏡' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/crop-management', label: 'Crops', icon: '🌾' },
    { path: '/market-insights', label: 'Market', icon: '💰' },
    { path: '/community', label: 'Community', icon: '👥' },
    { path: '/chatbot', label: 'AI Assistant', icon: '🤖' },
    { path: '/schemes', label: 'Schemes', icon: '🏛️' },
    { path: '/resources', label: 'Learn', icon: '📚' },
    { path: '/profile', label: 'Profile', icon: '👨‍🌾' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-agri-beige-dark sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-agri-green group-hover:text-agri-green-light transition">
              AgriTech
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-agri-green text-white shadow-sm'
                    : 'text-gray-800 hover:bg-agri-green-soft hover:text-agri-green'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-agri-green-soft transition">
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-agri-green text-white shadow-sm'
                    : 'text-gray-800 hover:bg-agri-green-soft hover:text-agri-green'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
