"use client"

import type React from "react"
import { useState } from "react"
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
} from "lucide-react"

interface FormErrors {
  full_name?: string
  email?: string
  phone_number?: string
  password?: string
  confirmPassword?: string
  store_name?: string
  store_address?: string
}

interface FormData {
  full_name: string
  email: string
  phone_number: string
  password: string
  confirmPassword: string
  store_name: string
  store_address: string
}

interface PasswordStrength {
  score: number // 0-4
  label: string
  color: string
}

export const RegisterPage: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const { currentTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    if (password.length >= 8) score++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++
    if (password.match(/[0-9]/)) score++
    if (password.match(/[^a-zA-Z0-9]/)) score++

    const strengthLevels: PasswordStrength[] = [
      { score: 0, label: "Too weak", color: "#ef4444" },
      { score: 1, label: "Weak", color: "#f97316" },
      { score: 2, label: "Fair", color: "#eab308" },
      { score: 3, label: "Good", color: "#84cc16" },
      { score: 4, label: "Strong", color: "#22c55e" },
    ]

    return strengthLevels[score]
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required"
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required"
    } else if (!/^\d{10,}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      newErrors.phone_number = "Please enter a valid phone number (at least 10 digits)"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.store_name.trim()) {
      newErrors.store_name = "Store name is required"
    } else if (formData.store_name.trim().length < 2) {
      newErrors.store_name = "Store name must be at least 2 characters"
    }

    if (!formData.store_address.trim()) {
      newErrors.store_address = "Store address is required"
    } else if (formData.store_address.trim().length < 5) {
      newErrors.store_address = "Please enter a complete address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { confirmPassword, ...submitData } = formData
      await authService.registerSeller(submitData)

      setSuccess(true)
      setTimeout(() => {
        onSwitchToLogin()
      }, 2000)
    } catch (err: any) {
      console.error("Registration Error:", err)
      setError(err.message || "Failed to create seller account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const isPasswordMatching = formData.confirmPassword && formData.password === formData.confirmPassword

  const inputContainerStyle = {
    backgroundColor: currentTheme.colors.surface + "60",
    borderColor: currentTheme.colors.border,
    color: currentTheme.colors.text,
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-500"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
      }}
    >
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />
      </div>

      <div
        className="w-full max-w-2xl backdrop-blur-2xl border rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}f5, ${currentTheme.colors.background}f5)`,
          borderColor: currentTheme.colors.border,
        }}
      >
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 font-medium">
            <CheckCircle size={20} className="shrink-0" />
            Account created successfully! Redirecting to login...
          </div>
        )}

        <div className="text-center mb-10">
          <div
            className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-4xl font-bold mb-3"
            style={{
              color: currentTheme.colors.primary,
              letterSpacing: "-0.02em",
            }}
          >
            Become a Seller
          </h1>
          <p className="text-base opacity-70" style={{ color: currentTheme.colors.text }}>
            Join our community and start selling to thousands of customers
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 font-medium">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Section 1: Personal Details */}
          <div className="space-y-5">
            <h3
              className="text-xs font-bold uppercase tracking-widest opacity-60"
              style={{ color: currentTheme.colors.text }}
            >
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  className="text-xs font-semibold mb-2 block uppercase tracking-wide"
                  style={{ color: currentTheme.colors.text }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <input
                    required
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    aria-invalid={!!errors.full_name}
                    aria-describedby={errors.full_name ? "full_name-error" : undefined}
                    className="w-full pl-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                    style={
                      {
                        borderColor: errors.full_name ? "#ef4444" : inputContainerStyle.borderColor,
                        "--tw-ring-color": currentTheme.colors.primary,
                      } as React.CSSProperties
                    }
                    placeholder="John Doe"
                  />
                </div>
                {errors.full_name && (
                  <p id="full_name-error" className="text-xs text-red-600 mt-2 font-medium">
                    {errors.full_name}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="text-xs font-semibold mb-2 block uppercase tracking-wide"
                  style={{ color: currentTheme.colors.text }}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <input
                    required
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    aria-invalid={!!errors.phone_number}
                    aria-describedby={errors.phone_number ? "phone_number-error" : undefined}
                    className="w-full pl-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                    style={
                      {
                        borderColor: errors.phone_number ? "#ef4444" : inputContainerStyle.borderColor,
                        "--tw-ring-color": currentTheme.colors.primary,
                      } as React.CSSProperties
                    }
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone_number && (
                  <p id="phone_number-error" className="text-xs text-red-600 mt-2 font-medium">
                    {errors.phone_number}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className="text-xs font-semibold mb-2 block uppercase tracking-wide"
                style={{ color: currentTheme.colors.text }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="w-full pl-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                  style={
                    {
                      borderColor: errors.email ? "#ef4444" : inputContainerStyle.borderColor,
                      "--tw-ring-color": currentTheme.colors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="seller@company.com"
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-xs text-red-600 mt-2 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                className="text-xs font-semibold mb-2 block uppercase tracking-wide"
                style={{ color: currentTheme.colors.text }}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : "password-strength"}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                  style={
                    {
                      borderColor: errors.password ? "#ef4444" : inputContainerStyle.borderColor,
                      "--tw-ring-color": currentTheme.colors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs text-red-600 mt-2 font-medium">
                  {errors.password}
                </p>
              )}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold opacity-70" style={{ color: currentTheme.colors.text }}>
                      Password strength
                    </p>
                    <p className="text-xs font-bold" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(passwordStrength.score + 1) * 20}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                className="text-xs font-semibold mb-2 block uppercase tracking-wide"
                style={{ color: currentTheme.colors.text }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                  style={
                    {
                      borderColor: errors.confirmPassword
                        ? "#ef4444"
                        : isPasswordMatching && formData.confirmPassword
                          ? "#22c55e"
                          : inputContainerStyle.borderColor,
                      "--tw-ring-color": currentTheme.colors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="text-xs text-red-600 mt-2 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
              {isPasswordMatching && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1 font-medium">
                  <CheckCircle size={14} /> Passwords match
                </p>
              )}
            </div>
          </div>

          <div className="h-px w-full bg-gray-200" />

          {/* Section 2: Store Details */}
          <div className="space-y-5">
            <h3
              className="text-xs font-bold uppercase tracking-widest opacity-60"
              style={{ color: currentTheme.colors.text }}
            >
              Store Information
            </h3>

            <div>
              <label
                className="text-xs font-semibold mb-2 block uppercase tracking-wide"
                style={{ color: currentTheme.colors.text }}
              >
                Store Name
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  required
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                  aria-invalid={!!errors.store_name}
                  aria-describedby={errors.store_name ? "store_name-error" : undefined}
                  className="w-full pl-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                  style={
                    {
                      borderColor: errors.store_name ? "#ef4444" : inputContainerStyle.borderColor,
                      "--tw-ring-color": currentTheme.colors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="e.g. Royal Bakes & Cafe"
                />
              </div>
              {errors.store_name && (
                <p id="store_name-error" className="text-xs text-red-600 mt-2 font-medium">
                  {errors.store_name}
                </p>
              )}
            </div>

            <div>
              <label
                className="text-xs font-semibold mb-2 block uppercase tracking-wide"
                style={{ color: currentTheme.colors.text }}
              >
                Store Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                  required
                  name="store_address"
                  value={formData.store_address}
                  onChange={handleChange}
                  aria-invalid={!!errors.store_address}
                  aria-describedby={errors.store_address ? "store_address-error" : undefined}
                  className="w-full pl-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                  style={
                    {
                      borderColor: errors.store_address ? "#ef4444" : inputContainerStyle.borderColor,
                      "--tw-ring-color": currentTheme.colors.primary,
                    } as React.CSSProperties
                  }
                  placeholder="e.g. 123 Main St, Vadodara, Gujarat"
                />
              </div>
              {errors.store_address && (
                <p id="store_address-error" className="text-xs text-red-600 mt-2 font-medium">
                  {errors.store_address}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-xl active:scale-95 shadow-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed text-white text-base"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
            }}
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Account Created!</span>
              </>
            ) : (
              <>
                <span>Create Seller Account</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-7">
          <p className="text-sm opacity-70" style={{ color: currentTheme.colors.text }}>
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="font-bold hover:underline transition-colors"
              style={{ color: currentTheme.colors.primary }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
