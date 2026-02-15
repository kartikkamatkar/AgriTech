import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-beige to-agri-green-soft flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-agri-green rounded-full mb-4">
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join AgriTech</h1>
          <p className="text-gray-700 font-medium">Start your smart farming journey</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-agri-beige-dark p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Mobile Number</label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                placeholder="10-digit mobile number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Farm Size (acres)</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                placeholder="Enter farm size"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                placeholder="Create a strong password"
              />
            </div>
            
            <div className="flex items-start">
              <input type="checkbox" className="mt-1 mr-2 rounded" />
              <span className="text-xs text-gray-700 font-medium">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </div>

            <button 
              type="submit" 
              className="w-full bg-agri-green text-white py-3 rounded-lg font-semibold hover:bg-agri-green-light transition shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-agri-green hover:text-agri-green-light font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white bg-opacity-60 backdrop-blur rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-sm text-gray-800 font-medium">
            <li className="flex items-center gap-2">
              <span className="text-agri-green">✓</span>
              <span>Real-time weather and soil insights</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-agri-green">✓</span>
              <span>Market price tracking and trends</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-agri-green">✓</span>
              <span>Free learning resources</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
