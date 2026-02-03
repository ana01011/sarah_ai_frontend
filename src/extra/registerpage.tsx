// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Brain, Sparkles, UserCheck, ChevronDown } from 'lucide-react';
// import { useTheme } from '../../contexts/ThemeContext';
// import { useAuth } from '../../contexts/AuthContext';

// export const RegisterPage: React.FC<{ onSwitchToLogin: () => void; onSwitchToVerify: () => void }> = ({ 
//   onSwitchToLogin, 
//   onSwitchToVerify 
// }) => {
//   const { currentTheme } = useTheme();
//   const { register, error, isLoading, clearError } = useAuth();
//   const [formData, setFormData] = useState({
//     email: '',
//     username: '',
//     password: '',
//     confirmPassword: '',
//     name: '',
//     gender: '' as 'male' | 'female' | 'neutral' | ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [acceptTerms, setAcceptTerms] = useState(false);
//   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
//   const [showGenderDropdown, setShowGenderDropdown] = useState(false);

//   const validateForm = () => {
//     const errors: Record<string, string> = {};

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email) {
//       errors.email = 'Email is required';
//     } else if (!emailRegex.test(formData.email)) {
//       errors.email = 'Please enter a valid email address';
//     }

//     // Username validation
//     if (!formData.username) {
//       errors.username = 'Username is required';
//     } else if (formData.username.length < 3) {
//       errors.username = 'Username must be at least 3 characters';
//     } else if (formData.username.length > 50) {
//       errors.username = 'Username must be less than 50 characters';
//     } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
//       errors.username = 'Username can only contain letters, numbers, and underscores';
//     }

//     // Password validation
//     if (!formData.password) {
//       errors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       errors.password = 'Password must be at least 6 characters';
//     } else if (!/\d/.test(formData.password)) {
//       errors.password = 'Password must contain at least one number';
//     }

//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       errors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = 'Passwords do not match';
//     }

//     // Terms validation
//     if (!acceptTerms) {
//       errors.terms = 'You must accept the Terms & Conditions';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const getPasswordStrength = (password: string) => {
//     let strength = 0;
//     if (password.length >= 6) strength++;
//     if (/[A-Z]/.test(password)) strength++;
//     if (/[a-z]/.test(password)) strength++;
//     if (/\d/.test(password)) strength++;
//     if (/[^A-Za-z0-9]/.test(password)) strength++;
//     return strength;
//   };

//   const getPasswordStrengthText = (strength: number) => {
//     switch (strength) {
//       case 0:
//       case 1: return { text: 'Very Weak', color: currentTheme.colors.error };
//       case 2: return { text: 'Weak', color: currentTheme.colors.warning };
//       case 3: return { text: 'Fair', color: currentTheme.colors.info };
//       case 4: return { text: 'Good', color: currentTheme.colors.success };
//       case 5: return { text: 'Strong', color: currentTheme.colors.success };
//       default: return { text: '', color: '' };
//     }
//   };

//   const getAIPersonality = (gender: string) => {
//     switch (gender) {
//       case 'male': return 'Sarah AI';
//       case 'female': return 'Xhash AI';
//       case 'neutral': return 'Neutral AI';
//       default: return 'Default AI';
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     clearError();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       await register({
//         email: formData.email,
//         username: formData.username,
//         password: formData.password,
//         confirmPassword: formData.confirmPassword,
//         name: formData.name || undefined,
//         gender: formData.gender || undefined
//       });
//       onSwitchToVerify();
//     } catch (error) {
//       // Error is handled by context
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear validation error when user starts typing
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleGoogleSignup = () => {
//     if (window.google) {
//       window.google.accounts.id.initialize({
//         client_id: '136426881868-agle26pe3r9ii73jcjal39b80iss1k2o.apps.googleusercontent.com',
//         callback: handleGoogleResponse,
//         auto_select: false,
//         cancel_on_tap_outside: true,
//       });
//       window.google.accounts.id.prompt();
//     }
//   };

//   const handleGoogleResponse = async (response: any) => {
//     try {
//       const payload = JSON.parse(atob(response.credential.split('.')[1]));
//       // Handle Google signup logic here
//       console.log('Google signup:', payload);
//     } catch (error) {
//       console.error('Google signup error:', error);
//     }
//   };

//   const passwordStrength = getPasswordStrength(formData.password);
//   const passwordStrengthInfo = getPasswordStrengthText(passwordStrength);

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

//       <div className="relative z-10 w-full max-w-md">
//         {/* Logo and Branding */}
//         <div className="text-center mb-4">
//           <div className="relative inline-block mb-4">
//             <div 
//               className="absolute -inset-2 rounded-full blur opacity-30 animate-pulse"
//               style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
//             />
//             <Brain 
//               className="w-12 h-12 mx-auto relative animate-pulse" 
//               style={{ color: currentTheme.colors.primary }}
//             />
//           </div>
          
//           <h1 
//             className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent mb-2"
//             style={{
//               backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
//             }}
//           >
//             Join AMESIE
            
//           </h1>
          
//           <p className="text-sm font-light mb-2" style={{ color: currentTheme.colors.textSecondary }}>
//             Create your AI assistant account
//           </p>
          
//           <div className="flex items-center justify-center space-x-2" style={{ color: currentTheme.colors.secondary }}>
//             <Sparkles className="w-3 h-3 animate-spin" />
//             <span className="text-xs font-mono">Advanced AI Operations Platform</span>
//             <Sparkles className="w-3 h-3 animate-spin" />
//           </div>
//         </div>

//         <div 
//           className="backdrop-blur-xl border rounded-2xl p-4 shadow-2xl"
//           style={{
//             background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.background}f0)`,
//             borderColor: currentTheme.colors.border,
//             boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
//           }}
//         >
//           {error && (
//             <div 
//               className="mb-3 p-2 rounded-xl border text-sm"
//               style={{
//                 backgroundColor: currentTheme.colors.error + '20',
//                 borderColor: currentTheme.colors.error + '50',
//                 color: currentTheme.colors.error
//               }}
//             >
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-3">
//             {/* Email Input */}
//             <div>
//               <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
//                 Email Address *
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
//                   placeholder="Enter your email"
//                 />
//               </div>
//               {validationErrors.email && (
//                 <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
//                   {validationErrors.email}
//                 </p>
//               )}
//             </div>

//             {/* Username Input */}
//             <div>
//               <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
//                 Username *
//               </label>
//               <div className="relative">
//                 <User 
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
//                   style={{ color: currentTheme.colors.textSecondary }}
//                 />
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none"
//                   style={{
//                     backgroundColor: currentTheme.colors.surface + '60',
//                     borderColor: validationErrors.username ? currentTheme.colors.error : currentTheme.colors.border,
//                     color: currentTheme.colors.text,
//                     fontSize: '16px'
//                   }}
//                   placeholder="Choose a username"
//                 />
//               </div>
//               {validationErrors.username && (
//                 <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
//                   {validationErrors.username}
//                 </p>
//               )}
//             </div>

//             {/* Full Name Input */}
//             <div>
//               <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
//                 Full Name (Optional)
//               </label>
//               <div className="relative">
//                 <UserCheck 
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
//                   style={{ color: currentTheme.colors.textSecondary }}
//                 />
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none"
//                   style={{
//                     backgroundColor: currentTheme.colors.surface + '60',
//                     borderColor: currentTheme.colors.border,
//                     color: currentTheme.colors.text,
//                     fontSize: '16px'
//                   }}
//                   placeholder="Enter your full name"
//                 />
//               </div>
//             </div>

//             {/* Gender Selection */}
//             <div>
//               <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
//                 Gender (Optional) - Choose your AI personality
//               </label>
//               <div className="relative">
//                 <button
//                   type="button"
//                   onClick={() => setShowGenderDropdown(!showGenderDropdown)}
//                   className="w-full pl-4 pr-10 py-2 rounded-xl border transition-all duration-200 focus:outline-none text-left flex items-center justify-between"
//                   style={{
//                     backgroundColor: currentTheme.colors.surface + '60',
//                     borderColor: currentTheme.colors.border,
//                     color: currentTheme.colors.text,
//                     fontSize: '16px'
//                   }}
//                 >
//                   <span>
//                     {formData.gender ? 
//                       `${formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)} (${getAIPersonality(formData.gender)})` : 
//                       'Select gender'
//                     }
//                   </span>
//                   <ChevronDown className="w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
//                 </button>
                
//                 {showGenderDropdown && (
//                   <div 
//                     className="absolute top-full left-0 right-0 mt-1 border rounded-xl shadow-lg z-50 overflow-hidden"
//                     style={{
//                       backgroundColor: currentTheme.colors.surface + 'f0',
//                       borderColor: currentTheme.colors.border
//                     }}
//                   >
//                     {[
//                       { value: 'male', label: 'Male', ai: 'Sarah AI' },
//                       { value: 'female', label: 'Female', ai: 'Xhash AI' },
//                       { value: 'neutral', label: 'Neutral/Prefer not to say', ai: 'Neutral AI' }
//                     ].map((option) => (
//                       <button
//                         key={option.value}
//                         type="button"
//                         onClick={() => {
//                           setFormData(prev => ({ ...prev, gender: option.value as any }));
//                           setShowGenderDropdown(false);
//                         }}
//                         className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors"
//                         style={{ color: currentTheme.colors.text }}
//                       >
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm">{option.label}</span>
//                           <span className="text-xs" style={{ color: currentTheme.colors.primary }}>
//                             {option.ai}
//                           </span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Password Input */}
//             <div>
//               <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
//                 Password *
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
//                   placeholder="Create a password"
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
//               {formData.password && (
//                 <div className="mt-1 flex items-center space-x-2">
//                   <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
//                     <div
//                       className="h-full transition-all duration-300"
//                       style={{ 
//                         width: `${(passwordStrength / 5) * 100}%`,
//                         backgroundColor: passwordStrengthInfo.color
//                       }}
//                     />
//                   </div>
//                   <span className="text-xs" style={{ color: passwordStrengthInfo.color }}>
//                     {passwordStrengthInfo.text}
//                   </span>
//                 </div>
//               )}
//               {validationErrors.password && (
//                 <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
//                   {validationErrors.password}
//                 </p>
//               )}
//             </div>

//             {/* Confirm Password Input */}
//             <div>
//               <label className="block text-xs font-medium mb-1" style={{ color: currentTheme.colors.text }}>
//                 Confirm Password *
//               </label>
//               <div className="relative">
//                 <Lock 
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
//                   style={{ color: currentTheme.colors.textSecondary }}
//                 />
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full pl-10 pr-10 py-2 rounded-xl border transition-all duration-200 focus:outline-none"
//                   style={{
//                     backgroundColor: currentTheme.colors.surface + '60',
//                     borderColor: validationErrors.confirmPassword ? currentTheme.colors.error : currentTheme.colors.border,
//                     color: currentTheme.colors.text,
//                     fontSize: '16px'
//                   }}
//                   placeholder="Confirm your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors"
//                   style={{ color: currentTheme.colors.textSecondary }}
//                 >
//                   {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//               {validationErrors.confirmPassword && (
//                 <p className="text-xs mt-1" style={{ color: currentTheme.colors.error }}>
//                   {validationErrors.confirmPassword}
//                 </p>
//               )}
//             </div>

//             {/* Terms & Conditions */}
//             <div className="flex items-start space-x-2">
//               <input
//                 type="checkbox"
//                 id="terms"
//                 checked={acceptTerms}
//                 onChange={(e) => setAcceptTerms(e.target.checked)}
//                 className="mt-1 w-4 h-4 rounded border focus:outline-none"
//                 style={{
//                   accentColor: currentTheme.colors.primary,
//                   borderColor: validationErrors.terms ? currentTheme.colors.error : currentTheme.colors.border
//                 }}
//               />
//               <label htmlFor="terms" className="text-xs leading-relaxed" style={{ color: currentTheme.colors.textSecondary }}>
//                 I agree to the{' '}
//                 <a href="#" className="underline hover:no-underline" style={{ color: currentTheme.colors.primary }}>
//                   Terms & Conditions
//                 </a>{' '}
//                 and{' '}
//                 <a href="#" className="underline hover:no-underline" style={{ color: currentTheme.colors.primary }}>
//                   Privacy Policy
//                 </a>
//               </label>
//             </div>
//             {validationErrors.terms && (
//               <p className="text-xs" style={{ color: currentTheme.colors.error }}>
//                 {validationErrors.terms}
//               </p>
//             )}

//             {/* Sign Up Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 
//                        hover:scale-[1.02] active:scale-95 hover:shadow-xl
//                        flex items-center justify-center space-x-3 group relative overflow-hidden
//                        backdrop-blur-sm border disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{
//                 background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
//                 color: '#ffffff',
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
//                   <span className="text-sm">Create Account</span>
//                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="relative my-4">
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

//           {/* Google Sign Up Button */}
//           <button
//             type="button"
//             onClick={handleGoogleSignup}
//             className="w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 
//                      hover:scale-[1.02] active:scale-95 hover:shadow-lg
//                      flex items-center justify-center space-x-3 group relative overflow-hidden
//                      backdrop-blur-sm border mb-4"
//             style={{
//               backgroundColor: currentTheme.colors.surface + '80',
//               borderColor: currentTheme.colors.border,
//               color: currentTheme.colors.text,
//               boxShadow: `0 4px 12px -4px ${currentTheme.shadows.secondary}`
//             }}
//           >
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
//             <span className="text-sm relative z-10">Sign up with Google</span>
//           </button>

//           {/* Login Link */}
//           <div className="text-center">
//             <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
//               Already have an account?{' '}
//               <button
//                 onClick={onSwitchToLogin}
//                 className="font-semibold hover:underline transition-colors"
//                 style={{ color: currentTheme.colors.primary }}
//               >
//                 Login
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// "use client"

// import type React from "react"
// import { useState } from "react"
// import { authService } from "../../services/authService"
// import { useTheme } from "../../contexts/ThemeContext"
// import {
//   Mail,
//   Lock,
//   User,
//   Store,
//   MapPin,
//   Phone,
//   ArrowRight,
//   Loader2,
//   AlertCircle,
//   ShoppingBag,
//   CheckCircle,
//   Eye,
//   EyeOff,
// } from "lucide-react"

// interface FormErrors {
//   full_name?: string
//   email?: string
//   phone_number?: string
//   password?: string
//   confirmPassword?: string
//   store_name?: string
//   store_address?: string
// }

// interface FormData {
//   full_name: string
//   email: string
//   phone_number: string
//   password: string
//   confirmPassword: string
//   store_name: string
//   store_address: string
// }

// interface PasswordStrength {
//   score: number // 0-4
//   label: string
//   color: string
// }

// export const RegisterPage: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
//   const { currentTheme } = useTheme()
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [formData, setFormData] = useState<FormData>({
//     full_name: "",
//     email: "",
//     phone_number: "",
//     password: "",
//     confirmPassword: "",
//     store_name: "",
//     store_address: "",
//   })
//   const [errors, setErrors] = useState<FormErrors>({})

//   const getPasswordStrength = (password: string): PasswordStrength => {
//     let score = 0
//     if (password.length >= 8) score++
//     if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++
//     if (password.match(/[0-9]/)) score++
//     if (password.match(/[^a-zA-Z0-9]/)) score++

//     const strengthLevels: PasswordStrength[] = [
//       { score: 0, label: "Too weak", color: "#ef4444" },
//       { score: 1, label: "Weak", color: "#f97316" },
//       { score: 2, label: "Fair", color: "#eab308" },
//       { score: 3, label: "Good", color: "#84cc16" },
//       { score: 4, label: "Strong", color: "#22c55e" },
//     ]

//     return strengthLevels[score]
//   }

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {}

//     if (!formData.full_name.trim()) {
//       newErrors.full_name = "Full name is required"
//     } else if (formData.full_name.trim().length < 2) {
//       newErrors.full_name = "Name must be at least 2 characters"
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required"
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email"
//     }

//     if (!formData.phone_number.trim()) {
//       newErrors.phone_number = "Phone number is required"
//     } else if (!/^\d{10,}$/.test(formData.phone_number.replace(/\D/g, ""))) {
//       newErrors.phone_number = "Please enter a valid phone number (at least 10 digits)"
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required"
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters"
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password"
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match"
//     }

//     if (!formData.store_name.trim()) {
//       newErrors.store_name = "Store name is required"
//     } else if (formData.store_name.trim().length < 2) {
//       newErrors.store_name = "Store name must be at least 2 characters"
//     }

//     if (!formData.store_address.trim()) {
//       newErrors.store_address = "Store address is required"
//     } else if (formData.store_address.trim().length < 5) {
//       newErrors.store_address = "Please enter a complete address"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)

//     if (!validateForm()) {
//       return
//     }

//     setIsLoading(true)

//     try {
//       const { confirmPassword, ...submitData } = formData
//       await authService.registerSeller(submitData)

//       setSuccess(true)
//       setTimeout(() => {
//         onSwitchToLogin()
//       }, 2000)
//     } catch (err: any) {
//       console.error("Registration Error:", err)
//       setError(err.message || "Failed to create seller account")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//     if (errors[name as keyof FormErrors]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }))
//     }
//   }

//   const passwordStrength = getPasswordStrength(formData.password)
//   const isPasswordMatching = formData.confirmPassword && formData.password === formData.confirmPassword

//   const inputContainerStyle = {
//     backgroundColor: currentTheme.colors.surface + "60",
//     borderColor: currentTheme.colors.border,
//     color: currentTheme.colors.text,
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4 transition-all duration-500"
//       style={{
//         background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
//       }}
//     >
//       <div className="fixed inset-0 opacity-5 pointer-events-none">
//         <div
//           className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
//           style={{ backgroundColor: currentTheme.colors.primary }}
//         />
//         <div
//           className="absolute bottom-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
//           style={{ backgroundColor: currentTheme.colors.secondary }}
//         />
//       </div>

//       <div
//         className="w-full max-w-2xl backdrop-blur-2xl border rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10"
//         style={{
//           background: `linear-gradient(135deg, ${currentTheme.colors.surface}f5, ${currentTheme.colors.background}f5)`,
//           borderColor: currentTheme.colors.border,
//         }}
//       >
//         {success && (
//           <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 font-medium">
//             <CheckCircle size={20} className="shrink-0" />
//             Account created successfully! Redirecting to login...
//           </div>
//         )}

//         <div className="text-center mb-10">
//           <div
//             className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
//             style={{ backgroundColor: currentTheme.colors.primary }}
//           >
//             <ShoppingBag className="w-8 h-8 text-white" />
//           </div>
//           <h1
//             className="text-4xl font-bold mb-3"
//             style={{
//               color: currentTheme.colors.primary,
//               letterSpacing: "-0.02em",
//             }}
//           >
//             Become a Seller
//           </h1>
//           <p className="text-base opacity-70" style={{ color: currentTheme.colors.text }}>
//             Join our community and start selling to thousands of customers
//           </p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 font-medium">
//             <AlertCircle size={20} className="shrink-0 mt-0.5" />
//             <div>{error}</div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-7">
//           {/* Section 1: Personal Details */}
//           <div className="space-y-5">
//             <h3
//               className="text-xs font-bold uppercase tracking-widest opacity-60"
//               style={{ color: currentTheme.colors.text }}
//             >
//               Personal Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label
//                   className="text-xs font-semibold mb-2 block uppercase tracking-wide"
//                   style={{ color: currentTheme.colors.text }}
//                 >
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
//                   <input
//                     required
//                     name="full_name"
//                     value={formData.full_name}
//                     onChange={handleChange}
//                     aria-invalid={!!errors.full_name}
//                     aria-describedby={errors.full_name ? "full_name-error" : undefined}
//                     className="w-full text-black pl-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
//                     style={
//                       {
//                         borderColor: errors.full_name ? "#ef4444" : inputContainerStyle.borderColor,
//                         "--tw-ring-color": currentTheme.colors.primary,
//                       } as React.CSSProperties
//                     }
//                     placeholder="John Doe"
//                   />
//                 </div>
//                 {errors.full_name && (
//                   <p id="full_name-error" className="text-xs text-red-600 mt-2 font-medium">
//                     {errors.full_name}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   className="text-xs font-semibold mb-2 block uppercase tracking-wide"
//                   style={{ color: currentTheme.colors.text }}
//                 >
//                   Phone Number
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
//                   <input
//                     required
//                     name="phone_number"
//                     value={formData.phone_number}
//                     onChange={handleChange}
//                     aria-invalid={!!errors.phone_number}
//                     aria-describedby={errors.phone_number ? "phone_number-error" : undefined}
//                     className="w-full pl-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
//                     style={
//                       {
//                         borderColor: errors.phone_number ? "#ef4444" : inputContainerStyle.borderColor,
//                         "--tw-ring-color": currentTheme.colors.primary,
//                       } as React.CSSProperties
//                     }
//                     placeholder="9876543210"
//                   />
//                 </div>
//                 {errors.phone_number && (
//                   <p id="phone_number-error" className="text-xs text-red-600 mt-2 font-medium">
//                     {errors.phone_number}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <label
//                 className="text-xs font-semibold mb-2 block uppercase tracking-wide"
//                 style={{ color: currentTheme.colors.text }}
//               >
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
//                 <input
//                   required
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   aria-invalid={!!errors.email}
//                   aria-describedby={errors.email ? "email-error" : undefined}
//                   className="w-full pl-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
//                   style={
//                     {
//                       borderColor: errors.email ? "#ef4444" : inputContainerStyle.borderColor,
//                       "--tw-ring-color": currentTheme.colors.primary,
//                     } as React.CSSProperties
//                   }
//                   placeholder="seller@company.com"
//                 />
//               </div>
//               {errors.email && (
//                 <p id="email-error" className="text-xs text-red-600 mt-2 font-medium">
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label
//                 className="text-xs font-semibold mb-2 block uppercase tracking-wide"
//                 style={{ color: currentTheme.colors.text }}
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
//                 <input
//                   required
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   aria-invalid={!!errors.password}
//                   aria-describedby={errors.password ? "password-error" : "password-strength"}
//                   className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
//                   style={
//                     {
//                       borderColor: errors.password ? "#ef4444" : inputContainerStyle.borderColor,
//                       "--tw-ring-color": currentTheme.colors.primary,
//                     } as React.CSSProperties
//                   }
//                   placeholder="Create a strong password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p id="password-error" className="text-xs text-red-600 mt-2 font-medium">
//                   {errors.password}
//                 </p>
//               )}
//               {formData.password && (
//                 <div className="mt-3">
//                   <div className="flex items-center justify-between mb-2">
//                     <p className="text-xs font-semibold opacity-70" style={{ color: currentTheme.colors.text }}>
//                       Password strength
//                     </p>
//                     <p className="text-xs font-bold" style={{ color: passwordStrength.color }}>
//                       {passwordStrength.label}
//                     </p>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="h-2 rounded-full transition-all duration-300"
//                       style={{
//                         width: `${(passwordStrength.score + 1) * 20}%`,
//                         backgroundColor: passwordStrength.color,
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div>
//               <label
//                 className="text-xs font-semibold mb-2 block uppercase tracking-wide"
//                 style={{ color: currentTheme.colors.text }}
//               >
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
//                 <input
//                   required
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   aria-invalid={!!errors.confirmPassword}
//                   aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
//                   className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
//                   style={
//                     {
//                       borderColor: errors.confirmPassword
//                         ? "#ef4444"
//                         : isPasswordMatching && formData.confirmPassword
//                           ? "#22c55e"
//                           : inputContainerStyle.borderColor,
//                       "--tw-ring-color": currentTheme.colors.primary,
//                     } as React.CSSProperties
//                   }
//                   placeholder="Confirm your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                 >
//                   {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p id="confirm-password-error" className="text-xs text-red-600 mt-2 font-medium">
//                   {errors.confirmPassword}
//                 </p>
//               )}
//               {isPasswordMatching && (
//                 <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
//                   <CheckCircle size={14} /> Passwords match
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="h-px w-full bg-gray-200" />

//           {/* Section 2: Store Details */}
//           <div className="space-y-5">
//             <h3
//               className="text-xs font-bold uppercase tracking-widest opacity-60"
//               style={{ color: currentTheme.colors.text }}
//             >
//               Store Information
//             </h3>

//             <div>
//               <label
//                 className="text-xs font-semibold mb-2 block uppercase tracking-wide"
//                 style={{ color: currentTheme.colors.text }}
//               >
//                 Store Name
//               </label>
//               <div className="relative">
//                 <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
//                 <input
//                   required
//                   name="store_name"
//                   value={formData.store_name}
//                   onChange={handleChange}
//                   aria-invalid={!!errors.store_name}
//                   aria-describedby={errors.store_name ? "store_name-error" : undefined}
//                   className="w-full pl-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
//                   style={
//                     {
//                       borderColor: errors.store_name ? "#ef4444" : inputContainerStyle.borderColor,
//                       "--tw-ring-color": currentTheme.colors.primary,
//                     } as React.CSSProperties
//                   }
//                   placeholder="e.g. Royal Bakes & Cafe"
//                 />
//               </div>
//               {errors.store_name && (
//                 <p id="store_name-error" className="text-xs text-red-600 mt-2 font-medium">
//                   {errors.store_name}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label
//                 className="text-xs font-semibold mb-2 block uppercase tracking-wide"
//                 style={{ color: currentTheme.colors.text }}
//               >
//                 Store Address
//               </label>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
//                 <input
//                   required
//                   name="store_address"
//                   value={formData.store_address}
//                   onChange={handleChange}
//                   aria-invalid={!!errors.store_address}
//                   aria-describedby={errors.store_address ? "store_address-error" : undefined}
//                   className="w-full pl-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
//                   style={
//                     {
//                       borderColor: errors.store_address ? "#ef4444" : inputContainerStyle.borderColor,
//                       "--tw-ring-color": currentTheme.colors.primary,
//                     } as React.CSSProperties
//                   }
//                   placeholder="e.g. 123 Main St, Vadodara, Gujarat"
//                 />
//               </div>
//               {errors.store_address && (
//                 <p id="store_address-error" className="text-xs text-red-600 mt-2 font-medium">
//                   {errors.store_address}
//                 </p>
//               )}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading || success}
//             className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-xl active:scale-95 shadow-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed text-white text-base"
//             style={{
//               background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
//             }}
//           >
//             {isLoading ? (
//               <Loader2 className="animate-spin w-5 h-5" />
//             ) : success ? (
//               <>
//                 <CheckCircle className="w-5 h-5" />
//                 <span>Account Created!</span>
//               </>
//             ) : (
//               <>
//                 <span>Create Seller Account</span>
//                 <ArrowRight className="w-5 h-5" />
//               </>
//             )}
//           </button>
//         </form>

//         <div className="text-center mt-7">
//           <p className="text-sm opacity-70" style={{ color: currentTheme.colors.text }}>
//             Already have an account?{" "}
//             <button
//               onClick={onSwitchToLogin}
//               className="font-bold hover:underline transition-colors"
//               style={{ color: currentTheme.colors.primary }}
//             >
//               Login
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }
