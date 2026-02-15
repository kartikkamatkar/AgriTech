import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { requestOtp, registerWithOtp, clearError } from '../store/slices/authSlice';
import type { RegisterData } from '../services/authService';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const COMMON_CROPS = [
  'Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Pulses', 'Groundnut',
  'Soybean', 'Jowar', 'Bajra', 'Barley', 'Potato', 'Onion', 'Tomato',
  'Tea', 'Coffee', 'Rubber', 'Jute', 'Coconut', 'Areca Nut'
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { otpSent, otpLoading, loading, error, otpError, isAuthenticated } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    phone: '',
    email: '',
    location: '',
    farmSize: undefined,
    farmLocation: '',
    crops: [],
    role: 'FARMER'
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [customCrop, setCustomCrop] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (error || otpError) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, otpError, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'farmSize' ? (value !== '' ? parseFloat(value) : undefined) : value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, phone: value }));
    }
  };

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev => 
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    );
  };

  const addCustomCrop = () => {
    if (customCrop.trim() && !selectedCrops.includes(customCrop.trim())) {
      setSelectedCrops(prev => [...prev, customCrop.trim()]);
      setCustomCrop('');
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Update crops in formData
    const updatedFormData = {
      ...formData,
      crops: selectedCrops.length > 0 ? selectedCrops : undefined
    };
    setFormData(updatedFormData);

    const result = await dispatch(requestOtp(formData.phone));
    if (requestOtp.fulfilled.match(result)) {
      setStep(2);
      setCountdown(60);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value !== '' && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      alert('Please enter complete 6-digit OTP');
      return;
    }

    const finalData = {
      ...formData,
      crops: selectedCrops.length > 0 ? selectedCrops : undefined
    };

    await dispatch(registerWithOtp({ data: finalData, otp: otpValue }));
  };

  const handleResendOtp = () => {
    if (countdown === 0) {
      dispatch(requestOtp(formData.phone));
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-beige to-agri-green-soft flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-agri-green rounded-full mb-4">
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join AgriTech</h1>
          <p className="text-gray-700 font-medium">Start your smart farming journey</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-agri-green' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-agri-green text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="text-sm font-medium hidden sm:inline">Details</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-agri-green' : 'bg-gray-300'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-agri-green' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-agri-green text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="text-sm font-medium hidden sm:inline">Verify OTP</span>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-agri-beige-dark p-8">
          {step === 1 ? (
            // Step 1: User Details
            <form onSubmit={handleRequestOtp} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'FARMER' }))}
                    className={`py-3 px-4 border-2 rounded-lg font-medium transition ${
                      formData.role === 'FARMER' 
                        ? 'border-agri-green bg-agri-green-soft text-agri-green' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    🧑‍🌾 Farmer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'EXPERT' }))}
                    className={`py-3 px-4 border-2 rounded-lg font-medium transition ${
                      formData.role === 'EXPERT' 
                        ? 'border-agri-green bg-agri-green-soft text-agri-green' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    👨‍🔬 Agricultural Expert
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                      +91
                    </span>
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                      placeholder="10-digit number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Email <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Location/State */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">State</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Farm Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Farm Size (acres)
                  </label>
                  <input 
                    type="number"
                    name="farmSize"
                    value={formData.farmSize || ''}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                    placeholder="e.g., 5.5"
                  />
                </div>
              </div>

              {/* Farm Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Farm Location <span className="text-xs text-gray-500">(City/Village)</span>
                </label>
                <input 
                  type="text"
                  name="farmLocation"
                  value={formData.farmLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                  placeholder="e.g., Nashik, Maharashtra"
                />
              </div>

              {/* Crops */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Crops You Grow <span className="text-xs text-gray-500">(Select multiple)</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_CROPS.map(crop => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => toggleCrop(crop)}
                      className={`px-3 py-1.5 text-sm rounded-full border-2 transition ${
                        selectedCrops.includes(crop)
                          ? 'border-agri-green bg-agri-green-soft text-agri-green font-medium'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCrop}
                    onChange={(e) => setCustomCrop(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCrop())}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition text-sm"
                    placeholder="Add other crop..."
                  />
                  <button
                    type="button"
                    onClick={addCustomCrop}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              {otpError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {otpError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={otpLoading || !formData.name || formData.phone.length !== 10}
                className="w-full bg-agri-green text-white py-3 rounded-lg font-semibold hover:bg-agri-green-light transition shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  'Continue →'
                )}
              </button>
            </form>
          ) : (
            // Step 2: OTP Verification
            <form onSubmit={handleVerifyAndRegister} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-800">
                    Enter OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-agri-green hover:text-agri-green-light font-medium"
                  >
                    ← Back
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  OTP sent to +91 {formData.phone}
                  <br />
                  <span className="text-xs text-gray-500">For testing, use: 123456</span>
                </p>

                {/* OTP Input */}
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                    />
                  ))}
                </div>

                {/* Resend OTP */}
                <div className="mt-4 text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-600">
                      Resend OTP in <span className="font-semibold text-agri-green">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-sm text-agri-green hover:text-agri-green-light font-semibold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || otp.join('').length !== 6}
                className="w-full bg-agri-green text-white py-3 rounded-lg font-semibold hover:bg-agri-green-light transition shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

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
        {step === 1 && (
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
              <li className="flex items-center gap-2">
                <span className="text-agri-green">✓</span>
                <span>AI chatbot assistant</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
