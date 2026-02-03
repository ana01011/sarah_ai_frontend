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
//   LucideIcon,
// } from "lucide-react"

// // --- Types ---
// interface FormData {
//   full_name: string
//   email: string
//   phone_number: string
//   password: string
//   confirmPassword: string
//   store_name: string
//   store_address: string
// }

// interface FormErrors {
//   [key: string]: string | undefined
// }

// // --- Reusable Input Component to Fix Alignment & Styling ---
// interface InputFieldProps {
//   label: string
//   name: keyof FormData
//   type?: string
//   value: string
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   icon: LucideIcon
//   placeholder: string
//   error?: string
//   required?: boolean
//   togglePassword?: () => void
//   isPasswordVisible?: boolean
//   primaryColor: string
//   textColor: string
//   borderColor: string
// }

// const InputField: React.FC<InputFieldProps> = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   icon: Icon,
//   placeholder,
//   error,
//   required,
//   togglePassword,
//   isPasswordVisible,
//   primaryColor,
//   textColor,
//   borderColor
// }) => (
//   <div className="w-full">
//     <label className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1 opacity-80" style={{ color: textColor }}>
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <div className="relative group">
//       <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors pointer-events-none">
//         <Icon size={18} />
//       </div>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/80 backdrop-blur-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${
//           error ? "border-red-500 ring-red-100" : "border-gray-200 hover:border-gray-300"
//         }`}
//         style={{
//           // We override only the focus ring color to match the theme
//           "--tw-ring-color": error ? "#ef4444" : primaryColor,
//         } as React.CSSProperties}
//       />
//       {togglePassword && (
//         <button
//           type="button"
//           onClick={togglePassword}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
//         >
//           {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       )}
//     </div>
//     {error && (
//       <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
//         <AlertCircle size={12} /> {error}
//       </p>
//     )}
//   </div>
// )

// // --- Main Component ---
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

//   // Validation Logic
//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {}
//     const phoneRegex = /^\d{10,}$/
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//     if (!formData.full_name.trim()) newErrors.full_name = "Full name is required"
//     if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email address"
//     if (!phoneRegex.test(formData.phone_number.replace(/\D/g, ""))) newErrors.phone_number = "Invalid phone number"
//     if (formData.password.length < 8) newErrors.password = "Password must be 8+ chars"
//     if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
//     if (!formData.store_name.trim()) newErrors.store_name = "Store name is required"
//     if (!formData.store_address.trim()) newErrors.store_address = "Address is required"

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)

//     if (!validateForm()) return

//     setIsLoading(true)
//     try {
//       const { confirmPassword, ...submitData } = formData
//       await authService.registerSeller(submitData)
//       setSuccess(true)
//       setTimeout(() => onSwitchToLogin(), 2000)
//     } catch (err: any) {
//       setError(err.message || "Failed to create seller account")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500"
//       style={{
//         background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
//       }}
//     >
//       {/* Background Ambience */}
//       <div className="fixed inset-0 opacity-10 pointer-events-none overflow-hidden">
//         <div 
//           className="absolute -top-24 -right-24 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"
//           style={{ backgroundColor: currentTheme.colors.primary }} 
//         />
//         <div 
//           className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse delay-1000"
//           style={{ backgroundColor: currentTheme.colors.secondary }} 
//         />
//       </div>

//       <div
//         className="w-full max-w-2xl backdrop-blur-xl border rounded-[2rem] p-8 sm:p-12 shadow-2xl relative z-10"
//         style={{
//           background: `linear-gradient(145deg, ${currentTheme.colors.surface}e6, ${currentTheme.colors.background}e6)`,
//           borderColor: currentTheme.colors.border,
//           boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`,
//         }}
//       >
//         {/* Header */}
//         <div className="text-center mb-10">
//           <div
//             className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
//             style={{ 
//               background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
//             }}
//           >
//             <ShoppingBag className="w-10 h-10 text-white" />
//           </div>
//           <h1
//             className="text-4xl font-bold mb-2 tracking-tight"
//             style={{ color: currentTheme.colors.text }}
//           >
//             Partner with <span style={{ color: currentTheme.colors.primary }}>Amesie</span>
//           </h1>
//           <p className="text-base font-medium opacity-60" style={{ color: currentTheme.colors.text }}>
//             Create your seller profile and start growing your business
//           </p>
//         </div>

//         {/* Feedback Messages */}
//         {error && (
//           <div className="mb-8 p-4 rounded-2xl bg-red-50/50 border border-red-200/50 text-red-600 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
//             <AlertCircle className="shrink-0 mt-0.5" size={20} />
//             <p className="text-sm font-medium">{error}</p>
//           </div>
//         )}

//         {success && (
//           <div className="mb-8 p-4 rounded-2xl bg-green-50/50 border border-green-200/50 text-green-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
//             <CheckCircle className="shrink-0" size={20} />
//             <p className="text-sm font-bold">Account created! Redirecting to login...</p>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-8">
          
//           {/* Personal Info Section */}
//           <div className="space-y-6">
//             <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-50 border-b pb-2" style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}>
//               <User size={16} /> Personal Details
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <InputField 
//                 label="Full Name" 
//                 name="full_name" 
//                 value={formData.full_name} 
//                 onChange={handleChange} 
//                 icon={User} 
//                 placeholder="John Doe" 
//                 error={errors.full_name}
//                 required
//                 primaryColor={currentTheme.colors.primary}
//                 textColor={currentTheme.colors.text}
//                 borderColor={currentTheme.colors.border}
//               />
//               <InputField 
//                 label="Phone Number" 
//                 name="phone_number" 
//                 value={formData.phone_number} 
//                 onChange={handleChange} 
//                 icon={Phone} 
//                 placeholder="98765 43210" 
//                 error={errors.phone_number}
//                 required
//                 primaryColor={currentTheme.colors.primary}
//                 textColor={currentTheme.colors.text}
//                 borderColor={currentTheme.colors.border}
//               />
//             </div>

//             <InputField 
//               label="Email Address" 
//               name="email" 
//               type="email"
//               value={formData.email} 
//               onChange={handleChange} 
//               icon={Mail} 
//               placeholder="seller@example.com" 
//               error={errors.email}
//               required
//               primaryColor={currentTheme.colors.primary}
//               textColor={currentTheme.colors.text}
//               borderColor={currentTheme.colors.border}
//             />

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <InputField 
//                 label="Password" 
//                 name="password" 
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password} 
//                 onChange={handleChange} 
//                 icon={Lock} 
//                 placeholder="••••••••" 
//                 error={errors.password}
//                 required
//                 togglePassword={() => setShowPassword(!showPassword)}
//                 isPasswordVisible={showPassword}
//                 primaryColor={currentTheme.colors.primary}
//                 textColor={currentTheme.colors.text}
//                 borderColor={currentTheme.colors.border}
//               />
//               <InputField 
//                 label="Confirm Password" 
//                 name="confirmPassword" 
//                 type={showConfirmPassword ? "text" : "password"}
//                 value={formData.confirmPassword} 
//                 onChange={handleChange} 
//                 icon={Lock} 
//                 placeholder="••••••••" 
//                 error={errors.confirmPassword}
//                 required
//                 togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
//                 isPasswordVisible={showConfirmPassword}
//                 primaryColor={currentTheme.colors.primary}
//                 textColor={currentTheme.colors.text}
//                 borderColor={currentTheme.colors.border}
//               />
//             </div>
//           </div>

//           {/* Store Info Section */}
//           <div className="space-y-6">
//             <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-50 border-b pb-2" style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}>
//               <Store size={16} /> Store Details
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <InputField 
//                 label="Store Name" 
//                 name="store_name" 
//                 value={formData.store_name} 
//                 onChange={handleChange} 
//                 icon={Store} 
//                 placeholder="Royal Bakes & Cafe" 
//                 error={errors.store_name}
//                 required
//                 primaryColor={currentTheme.colors.primary}
//                 textColor={currentTheme.colors.text}
//                 borderColor={currentTheme.colors.border}
//               />
//               <InputField 
//                 label="Store Address" 
//                 name="store_address" 
//                 value={formData.store_address} 
//                 onChange={handleChange} 
//                 icon={MapPin} 
//                 placeholder="City, State, Zip" 
//                 error={errors.store_address}
//                 required
//                 primaryColor={currentTheme.colors.primary}
//                 textColor={currentTheme.colors.text}
//                 borderColor={currentTheme.colors.border}
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <button
//             type="submit"
//             disabled={isLoading || success}
//             className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-white relative overflow-hidden group"
//             style={{
//               background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
//               boxShadow: `0 10px 20px -5px ${currentTheme.shadows.primary}`,
//             }}
//           >
//             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            
//             {isLoading ? (
//               <Loader2 className="animate-spin w-6 h-6" />
//             ) : success ? (
//               <>
//                 <CheckCircle className="w-6 h-6" />
//                 <span>All Set!</span>
//               </>
//             ) : (
//               <>
//                 <span>Register Store</span>
//                 <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
//               </>
//             )}
//           </button>
//         </form>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-sm font-medium opacity-60" style={{ color: currentTheme.colors.text }}>
//             Already have a seller account?{" "}
//             <button
//               onClick={onSwitchToLogin}
//               className="font-bold hover:underline ml-1"
//               style={{ color: currentTheme.colors.primary }}
//             >
//               Login here
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { authService } from "../../services/authService"
import { useTheme } from "../../contexts/ThemeContext"
import {
  Mail,
  Lock,
  User,
  Store,
  MapPin,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShoppingBag,
  CheckCircle,
  Eye,
  EyeOff,
  LucideIcon,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react"

// --- Types ---
interface FormData {
  full_name: string
  email: string
  phone_number: string
  password: string
  confirmPassword: string
  store_name: string
  store_address: string
}

interface FormErrors {
  [key: string]: string | undefined
}

// --- Reusable Input Component ---
interface InputFieldProps {
  label: string
  name: keyof FormData
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon: LucideIcon
  placeholder: string
  error?: string
  required?: boolean
  togglePassword?: () => void
  isPasswordVisible?: boolean
  primaryColor: string
  textColor: string
  borderColor: string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon: Icon,
  placeholder,
  error,
  required,
  togglePassword,
  isPasswordVisible,
  primaryColor,
  textColor,
  borderColor
}) => (
  <div className="w-full">
    <label 
      className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1 opacity-80" 
      style={{ color: textColor }}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      {/* Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none z-10">
        <Icon size={18} />
      </div>
      
      {/* Input */}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // FIXED: text-slate-900 (Black Text), pl-12 (Enough padding for icon)
        className={`w-full pl-12 pr-10 py-3.5 rounded-xl border bg-white/90 backdrop-blur-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${
          error ? "border-red-500 ring-red-100" : "border-slate-200 hover:border-slate-300"
        }`}
        style={{
          "--tw-ring-color": error ? "#ef4444" : primaryColor,
        } as React.CSSProperties}
      />

      {/* Password Toggle */}
      {togglePassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2 rounded-lg transition-colors z-20"
        >
          {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
)

// --- Main Component ---
export const RegisterPage: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const { currentTheme } = useTheme()
  const [currentStep, setCurrentStep] = useState<'form' | 'otp'>('form')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // OTP State
  const [otp, setOtp] = useState("")
  
  // Form Data
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    store_name: "",
    store_address: "",
  })
  
  const [errors, setErrors] = useState<FormErrors>({})

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required"
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email address"
    if (!formData.phone_number.trim()) newErrors.phone_number = "Phone number is required"
    if (formData.password.length < 4) newErrors.password = "Password too short"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.store_name.trim()) newErrors.store_name = "Store name is required"
    if (!formData.store_address.trim()) newErrors.store_address = "Address is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- Step 1: Register ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // 1. Register
      const { confirmPassword, ...submitData } = formData
      await authService.registerSeller(submitData)
      
      // 2. Assume Backend sends OTP automatically on register
      setCurrentStep('otp')
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  // --- Step 2: Verify OTP ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      // API call to verify OTP
      await authService.verifyOtp(formData.email, otp, 'auth')
      
      setSuccess(true)
      setTimeout(() => onSwitchToLogin(), 2000)
    } catch (err: any) {
      setError(err.message || "Invalid OTP code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
      }}
    >
      {/* Decorative Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }} 
        />
        <div 
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }} 
        />
      </div>

      <div
        className="w-full max-w-2xl backdrop-blur-xl border rounded-[2rem] p-8 sm:p-12 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300"
        style={{
          background: `linear-gradient(145deg, ${currentTheme.colors.surface}e6, ${currentTheme.colors.background}e6)`,
          borderColor: currentTheme.colors.border,
          boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`,
        }}
      >
        
        {/* === VIEW 1: REGISTRATION FORM === */}
        {currentStep === 'form' && (
          <>
            <div className="text-center mb-10">
              <div
                className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` }}
              >
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-2 tracking-tight" style={{ color: currentTheme.colors.text }}>
                Partner with <span style={{ color: currentTheme.colors.primary }}>Amesie</span>
              </h1>
              <p className="text-base font-medium opacity-60" style={{ color: currentTheme.colors.text }}>
                Create your seller profile and start growing your business
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-2xl bg-red-50/50 border border-red-200/50 text-red-600 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-8">
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-50 border-b pb-2" style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}>
                  <User size={16} /> Personal Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} icon={User} placeholder="John Doe" error={errors.full_name} required primaryColor={currentTheme.colors.primary} textColor={currentTheme.colors.text} borderColor={currentTheme.colors.border} />
                  <InputField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} icon={Phone} placeholder="98765 43210" error={errors.phone_number} required primaryColor={currentTheme.colors.primary} textColor={currentTheme.colors.text} borderColor={currentTheme.colors.border} />
                </div>

                <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={Mail} placeholder="seller@example.com" error={errors.email} required primaryColor={currentTheme.colors.primary} textColor={currentTheme.colors.text} borderColor={currentTheme.colors.border} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} icon={Lock} placeholder="••••••••" error={errors.password} required togglePassword={() => setShowPassword(!showPassword)} isPasswordVisible={showPassword} primaryColor={currentTheme.colors.primary} textColor={currentTheme.colors.text} borderColor={currentTheme.colors.border} />
                  <InputField label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} icon={Lock} placeholder="••••••••" error={errors.confirmPassword} required togglePassword={() => setShowConfirmPassword(!showConfirmPassword)} isPasswordVisible={showConfirmPassword} primaryColor={currentTheme.colors.primary} textColor={currentTheme.colors.text} borderColor={currentTheme.colors.border} />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-50 border-b pb-2" style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}>
                  <Store size={16} /> Store Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Store Name" name="store_name" value={formData.store_name} onChange={handleChange} icon={Store} placeholder="Royal Bakes & Cafe" error={errors.store_name} required primaryColor={currentTheme.colors.primary} textColor={currentTheme.colors.text} borderColor={currentTheme.colors.border} />
                  <InputField label="Store Address" name="store_address" value={formData.store_address} onChange={handleChange} icon={MapPin} placeholder="City, State, Zip" error={errors.store_address} required primaryColor={currentTheme.colors.primary} textColor={currentTheme.colors.text} borderColor={currentTheme.colors.border} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-white relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                  boxShadow: `0 10px 20px -5px ${currentTheme.shadows.primary}`,
                }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : (
                  <>
                    <span>Create Account & Verify</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* === VIEW 2: OTP VERIFICATION === */}
        {currentStep === 'otp' && (
          <div className="text-center animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner bg-slate-100">
              <ShieldCheck className="w-10 h-10" style={{ color: currentTheme.colors.primary }} />
            </div>
            
            <h2 className="text-3xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>Verify Email</h2>
            <p className="mb-8 opacity-60 text-sm max-w-xs mx-auto" style={{ color: currentTheme.colors.text }}>
              We've sent a 6-digit verification code to <br/>
              <strong className="text-slate-900">{formData.email}</strong>
            </p>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-sm flex justify-center items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            
            {success && (
               <div className="mb-6 p-3 rounded-xl bg-green-50 text-green-700 text-sm flex justify-center items-center gap-2">
                 <CheckCircle size={16} /> Verification Successful!
               </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numbers only
                  placeholder="000000"
                  className="w-full text-center text-4xl tracking-[0.5em] font-bold py-5 rounded-2xl border-2 focus:outline-none focus:ring-4 transition-all"
                  style={{
                    borderColor: currentTheme.colors.primary,
                    color: '#1e293b', // slate-800
                    backgroundColor: 'white'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6 || success}
                className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 text-white shadow-lg"
                style={{
                   background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                }}
              >
                 {isLoading ? <Loader2 className="animate-spin" /> : "Verify Email"}
              </button>
            </form>

            <button 
              onClick={() => setCurrentStep('form')}
              className="mt-8 text-xs opacity-40 hover:opacity-80 underline"
              style={{ color: currentTheme.colors.text }}
            >
              Back to Registration
            </button>
          </div>
        )}

        {/* Footer */}
        {currentStep === 'form' && (
          <div className="text-center mt-8">
            <p className="text-sm font-medium opacity-60" style={{ color: currentTheme.colors.text }}>
              Already have a seller account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="font-bold hover:underline ml-1"
                style={{ color: currentTheme.colors.primary }}
              >
                Login here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}