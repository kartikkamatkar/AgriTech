import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-beige to-agri-green-soft flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-agri-green rounded-full mb-4">
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-700 font-medium">Sign in to manage your farm</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-agri-beige-dark p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Mobile Number / Email</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                placeholder="Enter your mobile or email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                placeholder="Enter your password"
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-gray-700 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-agri-green hover:text-agri-green-light font-medium">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="w-full bg-agri-green text-white py-3 rounded-lg font-semibold hover:bg-agri-green-light transition shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700 font-medium">
              New to AgriTech?{' '}
              <Link to="/register" className="text-agri-green hover:text-agri-green-light font-semibold">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-700 font-medium">
            <div className="flex items-center gap-1">
              <span className="text-agri-green">✓</span>
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-agri-green">✓</span>
              <span>Data Protected</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-agri-green">✓</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
