// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, ArrowRight, Brain, Sparkles, Shield } from 'lucide-react';
// import { useTheme } from '../../contexts/ThemeContext';
// import { useAuth } from '../../contexts/AuthContext';

// export const LoginPage: React.FC<{ 
//   onSwitchToRegister: () => void; 
//   onSwitchToForgotPassword: () => void;
//   onSwitchTo2FA: () => void;
// }> = ({ onSwitchToRegister, onSwitchToForgotPassword, onSwitchTo2FA }) => {
//   const { currentTheme } = useTheme();
//   const { login, googleLogin, error, isLoading, clearError } = useAuth();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

//   const validateForm = () => {
//     const errors: Record<string, string> = {};

//     if (!formData.email) {
//       errors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       errors.email = 'Please enter a valid email address';
//     }

//     if (!formData.password) {
//       errors.password = 'Password is required';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleGoogleLogin = () => {
//     if (window.google) {
//       window.google.accounts.id.initialize({
//         client_id: '136426881868-agle26pe3r9ii73jcjal39b80iss1k2o.apps.googleusercontent.com',
//         callback: handleGoogleResponse,
//         auto_select: false,
//         cancel_on_tap_outside: true,
//       });

//       // Trigger the Google One Tap prompt
//       window.google.accounts.id.renderButton(document.getElementById('google-signin-button'), { theme: 'outline', size: 'large' });
//     } else {
//       console.error('Google Identity Services not loaded');
//       alert('Google login is temporarily unavailable. Please try again later.');
//     }
//   };

//   const handleGoogleResponse = async (response: any) => {
//     try {
//       await googleLogin(response.credential);
//     } catch (error) {
//       console.error('Google login error:', error);
//     }
//   };

//   const handleForgotPassword = () => {
//     if (formData.email) {
//       onSwitchToForgotPassword();
//     } else {
//       setValidationErrors({ email: 'Please enter your email first' });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     clearError();
    
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const result = await login(formData.email, formData.password, formData.rememberMe);
//       if (result.requires2FA) {
//         onSwitchTo2FA();
//       }
//     } catch (error) {
//       // Error is handled by context
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
    
//     // Clear validation error when user starts typing
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   return (
//     <div 
//       className="min-h-screen flex items-center justify-center p-2 sm:p-4 transition-all duration-500"
//       style={{ 
//         background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
//         color: currentTheme.colors.text
//       }}
//     >
//       {/* Animated Background */}
//       <div className="fixed inset-0 opacity-10">
//         <div 
//           className="absolute top-0 left-0 w-[15rem] sm:w-[30rem] h-[15rem] sm:h-[30rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
//           style={{ backgroundColor: currentTheme.colors.primary }}
//         />
//         <div 
//           className="absolute top-0 right-0 w-[13rem] sm:w-[26rem] h-[13rem] sm:h-[26rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
//           style={{ backgroundColor: currentTheme.colors.secondary }}
//         />
//         <div 
//           className="absolute bottom-0 left-1/2 w-[14rem] sm:w-[28rem] h-[14rem] sm:h-[28rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
//           style={{ backgroundColor: currentTheme.colors.accent }}
//         />
//       </div>

//       <div className="relative z-10 w-full max-w-sm sm:max-w-md">
//         {/* Logo and Branding */}
//         <div className="text-center mb-2 sm:mb-4">
          
//           <h1 
//             className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent mb-1 sm:mb-2"
//             style={{
//               backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
//             }}
//           >
//             Welcome Back
//           </h1>
          
//           <p className="text-xs sm:text-sm font-light mb-1 sm:mb-2" style={{ color: currentTheme.colors.textSecondary }}>
//             Sign in to your SARAH AI account
//           </p>
          
//           <div className="flex items-center justify-center space-x-1 sm:space-x-2" style={{ color: currentTheme.colors.secondary }}>
//             <Sparkles className="w-3 h-3 animate-spin" />
//             <span className="text-xs sm:text-sm font-mono">Secure Login Portal</span>
//             <Sparkles className="w-3 h-3 animate-spin" />
//           </div>
//         </div>

//         <div 
//           className="backdrop-blur-xl border rounded-2xl p-3 sm:p-4 shadow-2xl"
//           style={{
//             background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.background}f0)`,
//             borderColor: currentTheme.colors.border,
//             boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
//           }}
//         >
//           {error && (
//             <div 
//               className="mb-2 sm:mb-3 p-2 rounded-xl border"
//               style={{
//                 backgroundColor: currentTheme.colors.error + '20',
//                 borderColor: currentTheme.colors.error + '50',
//                 color: currentTheme.colors.error
//               }}
//             >
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
//             {/* Email Input */}
//             <div>
//               <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail 
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
//                   style={{ color: currentTheme.colors.textSecondary }}
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none"
//                   style={{
//                     backgroundColor: currentTheme.colors.surface + '60',
//                     borderColor: validationErrors.email ? currentTheme.colors.error : currentTheme.colors.border,
//                     color: currentTheme.colors.text,
//                     fontSize: '16px'
//                   }}
//                   onFocus={(e) => {
//                     e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
//                     e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
//                   }}
//                   onBlur={(e) => {
//                     e.currentTarget.style.borderColor = currentTheme.colors.border;
//                     e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
//                   }}
//                   placeholder="Enter your email"
//                 />
//               </div>
//               {validationErrors.email && (
//                 <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
//                   {validationErrors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password Input */}
//             <div>
//               <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock 
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
//                   style={{ color: currentTheme.colors.textSecondary }}
//                 />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full pl-10 pr-10 py-2 rounded-xl border transition-all duration-200 focus:outline-none"
//                   style={{
//                     backgroundColor: currentTheme.colors.surface + '60',
//                     borderColor: validationErrors.password ? currentTheme.colors.error : currentTheme.colors.border,
//                     color: currentTheme.colors.text,
//                     fontSize: '16px'
//                   }}
//                   onFocus={(e) => {
//                     e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
//                     e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
//                   }}
//                   onBlur={(e) => {
//                     e.currentTarget.style.borderColor = currentTheme.colors.border;
//                     e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
//                   }}
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors"
//                   style={{ color: currentTheme.colors.textSecondary }}
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//               {validationErrors.password && (
//                 <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
//                   {validationErrors.password}
//                 </p>
//               )}
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="rememberMe"
//                   name="rememberMe"
//                   checked={formData.rememberMe}
//                   onChange={handleInputChange}
//                   className="w-4 h-4 rounded border focus:outline-none"
//                   style={{ accentColor: currentTheme.colors.primary }}
//                 />
//                 <label htmlFor="rememberMe" className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
//                   Remember me
//                 </label>
//               </div>
//               <button type="button" onClick={handleForgotPassword} className="text-xs hover:underline" style={{ color: currentTheme.colors.primary }}>
//                 Forgot Password?
//               </button>
//             </div>

//             {/* Sign In Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 
//                        hover:scale-[1.02] active:scale-95 hover:shadow-xl
//                        flex items-center justify-center space-x-3 group relative overflow-hidden
//                        backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{
//                 background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
//                 color: currentTheme.id === 'light' ? '#ffffff' : currentTheme.colors.text,
//                 borderColor: currentTheme.colors.border,
//                 boxShadow: `0 10px 25px -5px ${currentTheme.shadows.primary}`
//               }}
//             >
//               <div 
//                 className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                 style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)' }}
//               />
//               {isLoading ? (
//                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <span className="text-sm">Sign In</span>
//                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
//                 </>
//               )}
//             </button>

//             {/* Enable 2FA Option */}
//             <div className="text-center">
//               <button
//                 type="button"
//                 className="inline-flex items-center space-x-2 text-xs hover:underline transition-colors"
//                 style={{ color: currentTheme.colors.info }}
//               >
//                 <Shield className="w-3 h-3" />
//                 <span>Enable Two-Factor Authentication</span>
//               </button>
//             </div>
//           </form>

//           {/* Divider */}
//           <div className="relative my-3">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t" style={{ borderColor: currentTheme.colors.border }}></div>
//             </div>
//             <div className="relative flex justify-center text-xs">
//               <span 
//                 className="bg-transparent px-2" 
//                 style={{ 
//                   color: currentTheme.colors.textSecondary,
//                   backgroundColor: currentTheme.colors.surface + 'f0'
//                 }}
//               >
//                 or continue with
//               </span>
//             </div>
//           </div>

//           {/* Google Login Button */}
//           <button
//             id="google-signin-button"
//             type="button"
//             onClick={handleGoogleLogin}
//             className="w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-300 
//                      hover:scale-[1.02] active:scale-95 hover:shadow-lg
//                      flex items-center justify-center space-x-3 group relative overflow-hidden
//                      backdrop-blur-sm border"
//             style={{
//               backgroundColor: currentTheme.colors.surface + '80',
//               borderColor: currentTheme.colors.border,
//               color: currentTheme.colors.text,
//               boxShadow: `0 4px 12px -4px ${currentTheme.shadows.secondary}`
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = currentTheme.colors.surface + 'a0';
//               e.currentTarget.style.borderColor = currentTheme.colors.primary + '30';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
//               e.currentTarget.style.borderColor = currentTheme.colors.border;
//             }}
//           >
//             <div 
//               className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//               style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }}
//             />
            
//             {/* Google Icon */}
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 fill="#4285F4"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//               />
//               <path
//                 fill="#34A853"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="#FBBC05"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//               />
//               <path
//                 fill="#EA4335"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>
            
//             <span className="text-sm relative z-10">Continue with Google</span>
//           </button>

//           {/* Register Link */}
//           <div className="text-center mt-4">
//             <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
//               Don't have an account?{' '}
//               <button
//                 onClick={onSwitchToRegister}
//                 className="font-semibold hover:underline transition-colors"
//                 style={{ color: currentTheme.colors.primary }}
//               >
//                 Sign Up
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield } from 'lucide-react';

export const LoginPage: React.FC<{ 
  onSwitchToRegister: () => void; 
  onSwitchToForgotPassword: () => void;
  onSwitchTo2FA: () => void;
}> = ({ onSwitchToRegister, onSwitchToForgotPassword, onSwitchTo2FA }) => {
  const { currentTheme } = useTheme();
  // We now destructure 'devBypass' from useAuth
  const { login, googleLogin, devBypass, error, isLoading, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '136426881868-agle26pe3r9ii73jcjal39b80iss1k2o.apps.googleusercontent.com',
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(document.getElementById('google-signin-button'), { theme: 'outline', size: 'large' });
    } else {
      console.error('Google Identity Services not loaded');
      alert('Google login is temporarily unavailable. Please try again later.');
    }
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      await googleLogin(response.credential);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleForgotPassword = () => {
    if (formData.email) {
      onSwitchToForgotPassword();
    } else {
      setValidationErrors({ email: 'Please enter your email first' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // --- DEVELOPER BYPASS CHECK ---
    if (formData.email === 'dev@sarah.ai' && formData.password === 'bypass') {
      try {
        console.log("Attempting Developer Bypass...");
        await devBypass();
        return; 
      } catch (error) {
        console.error("Bypass failed", error);
        return;
      }
    }
    // -----------------------------
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(formData.email, formData.password, formData.rememberMe);
      if (result.requires2FA) {
        onSwitchTo2FA();
      }
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
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

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-2 sm:mb-4">
          
          <h1 
            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent mb-1 sm:mb-2"
            style={{
              backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
            }}
          >
            Welcome Back
          </h1>
          
          <p className="text-xs sm:text-sm font-light mb-1 sm:mb-2" style={{ color: currentTheme.colors.textSecondary }}>
            Sign in to your AMESIE account
          </p>
          
          <div className="flex items-center justify-center space-x-1 sm:space-x-2" style={{ color: currentTheme.colors.secondary }}>
            <Sparkles className="w-3 h-3 animate-spin" />
            <span className="text-xs sm:text-sm font-mono">Secure Login Portal</span>
            <Sparkles className="w-3 h-3 animate-spin" />
          </div>
        </div>

        <div 
          className="backdrop-blur-xl border rounded-2xl p-3 sm:p-4 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.background}f0)`,
            borderColor: currentTheme.colors.border,
            boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
          }}
        >
          {error && (
            <div 
              className="mb-2 sm:mb-3 p-2 rounded-xl border"
              style={{
                backgroundColor: currentTheme.colors.error + '20',
                borderColor: currentTheme.colors.error + '50',
                color: currentTheme.colors.error
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
            {/* Email Input */}
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
                  className="w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: validationErrors.email ? currentTheme.colors.error : currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    fontSize: '16px'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.border;
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
                  }}
                  placeholder="Enter your email"
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                Password
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                  style={{ color: currentTheme.colors.textSecondary }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-10 py-2 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: validationErrors.password ? currentTheme.colors.error : currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    fontSize: '16px'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.primary + '50';
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = currentTheme.colors.border;
                    e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '60';
                  }}
                  placeholder="Enter your password"
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
              {validationErrors.password && (
                <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border focus:outline-none"
                  style={{ accentColor: currentTheme.colors.primary }}
                />
                <label htmlFor="rememberMe" className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                  Remember me
                </label>
              </div>
              <button type="button" onClick={handleForgotPassword} className="text-xs hover:underline" style={{ color: currentTheme.colors.primary }}>
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-300 
                       hover:scale-[1.02] active:scale-95 hover:shadow-xl
                       flex items-center justify-center space-x-3 group relative overflow-hidden
                       backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                color: currentTheme.id === 'light' ? '#ffffff' : currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
                boxShadow: `0 10px 25px -5px ${currentTheme.shadows.primary}`
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
                  <span className="text-sm">Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                </>
              )}
            </button>

            {/* Enable 2FA Option */}
            <div className="text-center">
              <button
                type="button"
                className="inline-flex items-center space-x-2 text-xs hover:underline transition-colors"
                style={{ color: currentTheme.colors.info }}
              >
                <Shield className="w-3 h-3" />
                <span>Enable Two-Factor Authentication</span>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: currentTheme.colors.border }}></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span 
                className="bg-transparent px-2" 
                style={{ 
                  color: currentTheme.colors.textSecondary,
                  backgroundColor: currentTheme.colors.surface + 'f0'
                }}
              >
                or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            id="google-signin-button"
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-xl font-medium transition-all duration-300 
                     hover:scale-[1.02] active:scale-95 hover:shadow-lg
                     flex items-center justify-center space-x-3 group relative overflow-hidden
                     backdrop-blur-sm border"
            style={{
              backgroundColor: currentTheme.colors.surface + '80',
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.text,
              boxShadow: `0 4px 12px -4px ${currentTheme.shadows.secondary}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.surface + 'a0';
              e.currentTarget.style.borderColor = currentTheme.colors.primary + '30';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.surface + '80';
              e.currentTarget.style.borderColor = currentTheme.colors.border;
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }}
            />
            
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            
            <span className="text-sm relative z-10">Continue with Google</span>
          </button>

          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="font-semibold hover:underline transition-colors"
                style={{ color: currentTheme.colors.primary }}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};