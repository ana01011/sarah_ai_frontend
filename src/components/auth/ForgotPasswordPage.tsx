import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export const ForgotPasswordPage: React.FC<{ 
  onSwitchToLogin: () => void; 
  onSwitchToVerify: () => void;
}> = ({ onSwitchToLogin, onSwitchToVerify }) => {
  const { currentTheme } = useTheme();
  const { forgotPassword, resetPassword, error, isLoading, clearError, setVerificationEmail } = useAuth();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [formData, setFormData] = useState({
    email: '',
    otp: ['', '', '', '', '', ''],
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  React.useEffect(() => {
    if (step === 'reset' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const validateEmailStep = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateResetStep = () => {
    const errors: Record<string, string> = {};
    
    const otpString = formData.otp.join('');
    if (otpString.length !== 6) {
      errors.otp = 'Please enter the complete 6-digit code';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    } else if (!/\d/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain at least one number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateEmailStep()) {
      return;
    }

    try {
      await forgotPassword(formData.email);
      setVerificationEmail(formData.email);
      setStep('reset');
      setTimeLeft(300);
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateResetStep()) {
      return;
    }

    try {
      const otpString = formData.otp.join('');
      await resetPassword(formData.email, otpString, formData.newPassword, formData.confirmPassword);
      onSwitchToLogin();
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData(prev => ({ ...prev, otp: newOtp }));

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }

    if (validationErrors.otp) {
      setValidationErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-[15rem] sm:w-[30rem] h-[15rem] sm:h-[30rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div 
          className="absolute top-0 right-0 w-[13rem] sm:w-[26rem] h-[13rem] sm:h-[26rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />
        <div 
          className="absolute bottom-0 left-1/2 w-[14rem] sm:w-[28rem] h-[14rem] sm:h-[28rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
          style={{ backgroundColor: currentTheme.colors.accent }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div 
              className="absolute -inset-2 rounded-full blur opacity-30 animate-pulse"
              style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
            />
            {step === 'email' ? (
              <Mail className="w-12 h-12 mx-auto relative animate-pulse" style={{ color: currentTheme.colors.primary }} />
            ) : (
              <Lock className="w-12 h-12 mx-auto relative animate-pulse" style={{ color: currentTheme.colors.primary }} />
            )}
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
            {step === 'email' ? 'Reset Password' : 'Enter New Password'}
          </h1>
          
          <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
            {step === 'email' 
              ? 'Enter your email to receive a reset code'
              : `Enter the code sent to ${formData.email}`
            }
          </p>

          {step === 'reset' && (
            <div className="mt-2 text-xs" style={{ color: currentTheme.colors.warning }}>
              Code expires in: {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <div 
          className="backdrop-blur-xl border rounded-2xl p-6 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.background}f0)`,
            borderColor: currentTheme.colors.border,
            boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
          }}
        >
          {error && (
            <div 
              className="mb-4 p-3 rounded-xl border text-sm"
              style={{
                backgroundColor: currentTheme.colors.error + '20',
                borderColor: currentTheme.colors.error + '50',
                color: currentTheme.colors.error
              }}
            >
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                    style={{ color: currentTheme.colors.textSecondary }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: currentTheme.colors.surface + '60',
                      borderColor: validationErrors.email ? currentTheme.colors.error : currentTheme.colors.border,
                      color: currentTheme.colors.text,
                      fontSize: '16px'
                    }}
                    placeholder="Enter your email address"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 
                         hover:scale-[1.02] active:scale-95 hover:shadow-xl
                         flex items-center justify-center space-x-3 group relative overflow-hidden
                         backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                  color: '#ffffff',
                  borderColor: currentTheme.colors.border,
                  boxShadow: `0 10px 25px -5px ${currentTheme.shadows.primary}`
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-sm">Send Reset Code</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium mb-3 text-center" style={{ color: currentTheme.colors.text }}>
                  Enter Reset Code
                </label>
                <div className="flex justify-center space-x-2">
                  {formData.otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-bold rounded-xl border transition-all duration-200 focus:outline-none focus:scale-110"
                      style={{
                        backgroundColor: currentTheme.colors.surface + '60',
                        borderColor: digit ? currentTheme.colors.primary : currentTheme.colors.border,
                        color: currentTheme.colors.text,
                        fontSize: '18px'
                      }}
                    />
                  ))}
                </div>
                {validationErrors.otp && (
                  <p className="text-xs mt-2 text-center" style={{ color: currentTheme.colors.error }}>
                    {validationErrors.otp}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  New Password
                </label>
                <div className="relative">
                  <Lock 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                    style={{ color: currentTheme.colors.textSecondary }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: currentTheme.colors.surface + '60',
                      borderColor: validationErrors.newPassword ? currentTheme.colors.error : currentTheme.colors.border,
                      color: currentTheme.colors.text,
                      fontSize: '16px'
                    }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.newPassword && (
                  <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
                    {validationErrors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                    style={{ color: currentTheme.colors.textSecondary }}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: currentTheme.colors.surface + '60',
                      borderColor: validationErrors.confirmPassword ? currentTheme.colors.error : currentTheme.colors.border,
                      color: currentTheme.colors.text,
                      fontSize: '16px'
                    }}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 
                         hover:scale-[1.02] active:scale-95 hover:shadow-xl
                         flex items-center justify-center space-x-3 group relative overflow-hidden
                         backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                  color: '#ffffff',
                  borderColor: currentTheme.colors.border,
                  boxShadow: `0 10px 25px -5px ${currentTheme.shadows.primary}`
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-sm">Reset Password</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6 pt-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <button
              onClick={onSwitchToLogin}
              className="inline-flex items-center space-x-2 text-sm hover:underline transition-colors"
              style={{ color: currentTheme.colors.primary }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};