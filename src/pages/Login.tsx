import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { requestOtp, verifyOtpAndLogin, clearError } from '../store/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { otpSent, otpLoading, loading, error, otpError, isAuthenticated } = useAppSelector((state) => state.auth);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    const result = await dispatch(requestOtp(phone));
    if (requestOtp.fulfilled.match(result)) {
      setCountdown(60);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value !== '' && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      alert('Please enter complete 6-digit OTP');
      return;
    }

    await dispatch(verifyOtpAndLogin({ phone, otp: otpValue }));
  };

  const handleResendOtp = () => {
    if (countdown === 0) {
      dispatch(requestOtp(phone));
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
    }
  };

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
          {!otpSent ? (
            // Phone Number Step
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">
                    +91
                  </span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-agri-green focus:border-transparent transition"
                    placeholder="Enter 10-digit mobile number"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-600">
                  We'll send you a 6-digit OTP for verification
                </p>
              </div>

              {otpError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {otpError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={otpLoading || phone.length !== 10}
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
                  'Send OTP'
                )}
              </button>
            </form>
          ) : (
            // OTP Verification Step
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-800">
                    Enter OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="text-sm text-agri-green hover:text-agri-green-light font-medium"
                  >
                    Change Number
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  OTP sent to +91 {phone}
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
                    Verifying...
                  </>
                ) : (
                  'Verify & Login'
                )}
              </button>
            </form>
          )}

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
              <span>OTP Verified</span>
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
