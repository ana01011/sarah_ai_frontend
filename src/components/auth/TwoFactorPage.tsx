import React, { useState, useEffect, useRef } from 'react';
import { Shield, ArrowRight, RefreshCw, ArrowLeft, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export const TwoFactorPage: React.FC<{ 
  onSwitchToLogin: () => void; 
  onVerificationSuccess: () => void;
}> = ({ onSwitchToLogin, onVerificationSuccess }) => {
  const { currentTheme } = useTheme();
  const { loginVerifyOTP, resendOTP, error, isLoading, clearError, verificationEmail } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Timer for OTP expiry
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Resend cooldown timer
    if (resendCooldown > 0 && !canResend) {
      const cooldownTimer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(cooldownTimer);
    }
  }, [resendCooldown, canResend]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      return;
    }

    if (!verificationEmail) {
      return;
    }

    try {
      await loginVerifyOTP(verificationEmail, otpString);
      onVerificationSuccess();
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !verificationEmail) return;

    try {
      await resendOTP(verificationEmail);
      setCanResend(false);
      setResendCooldown(30);
      setTimeLeft(300); // Reset timer
    } catch (error) {
      // Error is handled by context
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

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
            <Shield 
              className="w-12 h-12 mx-auto relative animate-pulse" 
              style={{ color: currentTheme.colors.primary }}
            />
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
            Two-Factor Authentication
          </h1>
          
          <p className="text-sm mb-4" style={{ color: currentTheme.colors.textSecondary }}>
            Enter the 6-digit code from your authenticator app
          </p>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="w-4 h-4" style={{ color: currentTheme.colors.warning }} />
            <span className="text-sm font-mono" style={{ color: currentTheme.colors.warning }}>
              Code expires in: {formatTime(timeLeft)}
            </span>
          </div>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium mb-3 text-center" style={{ color: currentTheme.colors.text }}>
                Enter Authentication Code
              </label>
              <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold rounded-xl border transition-all duration-200 focus:outline-none focus:scale-110"
                    style={{
                      backgroundColor: currentTheme.colors.surface + '60',
                      borderColor: digit ? currentTheme.colors.primary : currentTheme.colors.border,
                      color: currentTheme.colors.text,
                      fontSize: '18px'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = currentTheme.colors.primary + '80';
                      e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${currentTheme.colors.primary}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = digit ? currentTheme.colors.primary : currentTheme.colors.border;
                      e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={!isOtpComplete || isLoading}
              className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 
                       hover:scale-[1.02] active:scale-95 hover:shadow-xl
                       flex items-center justify-center space-x-3 group relative overflow-hidden
                       backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isOtpComplete 
                  ? `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                  : currentTheme.colors.surface + '60',
                color: isOtpComplete ? '#ffffff' : currentTheme.colors.textSecondary,
                borderColor: currentTheme.colors.border,
                boxShadow: isOtpComplete ? `0 10px 25px -5px ${currentTheme.shadows.primary}` : 'none'
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)' }}
              />
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-sm">Verify & Login</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </>
              )}
            </button>

            {/* Resend Code */}
            <div className="text-center space-y-3">
              <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                Didn't receive the code?
              </p>
              
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || isLoading}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 
                         hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: canResend ? currentTheme.colors.primary + '20' : currentTheme.colors.surface + '40',
                  color: canResend ? currentTheme.colors.primary : currentTheme.colors.textSecondary,
                  border: `1px solid ${canResend ? currentTheme.colors.primary + '50' : currentTheme.colors.border}`
                }}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">
                  {canResend ? 'Resend Code' : `Resend in ${resendCooldown}s`}
                </span>
              </button>
            </div>

            {/* Use Backup Code */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm hover:underline transition-colors"
                style={{ color: currentTheme.colors.info }}
              >
                Use backup code instead
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t" style={{ borderColor: currentTheme.colors.border }}>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="inline-flex items-center space-x-2 text-sm hover:underline transition-colors"
                style={{ color: currentTheme.colors.primary }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};