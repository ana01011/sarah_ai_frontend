import React, { useState } from 'react';
import { User, Mail, Shield, Settings, LogOut, Save, Edit3, Eye, EyeOff, Lock, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export const UserProfilePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentTheme } = useTheme();
  const { user, logout, updateUser, enable2FA, disable2FA, error, isLoading, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    gender: user?.gender || '',
    personality: user?.personality || 'sarah'
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [twoFAData, setTwoFAData] = useState({
    qrCode: '',
    backupCodes: [] as string[],
    verificationCode: ''
  });

  const getAIPersonality = (personality: string) => {
    switch (personality) {
      case 'sarah': return 'Sarah AI (Recommended for Males)';
      case 'xhash': return 'Xhash AI (Recommended for Females)';
      case 'neutral': return 'Neutral AI (Gender Neutral)';
      default: return 'Default AI';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (user) {
      updateUser({
        name: formData.name,
        username: formData.username,
        gender: formData.gender as 'male' | 'female' | 'neutral',
        personality: formData.personality as 'sarah' | 'xhash' | 'neutral'
      });
      setIsEditing(false);
    }
  };

  const handleChangePassword = async () => {
    // Implement password change logic here
    console.log('Change password:', passwordData);
    setShowChangePassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleEnable2FA = async () => {
    try {
      const result = await enable2FA();
      setTwoFAData({
        qrCode: result.qr_code,
        backupCodes: result.backup_codes,
        verificationCode: ''
      });
      setShow2FASetup(true);
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
    }
  };

  const handleDisable2FA = async () => {
    if (twoFAData.verificationCode.length === 6) {
      try {
        await disable2FA(twoFAData.verificationCode);
        setTwoFAData({ qrCode: '', backupCodes: [], verificationCode: '' });
      } catch (error) {
        console.error('Failed to disable 2FA:', error);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (!user) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl border rounded-2xl shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.background}f0)`,
          borderColor: currentTheme.colors.border,
          boxShadow: `0 25px 50px -12px ${currentTheme.shadows.primary}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                  color: '#ffffff'
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
                  User Profile
                </h2>
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div 
              className="p-3 rounded-xl border text-sm"
              style={{
                backgroundColor: currentTheme.colors.error + '20',
                borderColor: currentTheme.colors.error + '50',
                color: currentTheme.colors.error
              }}
            >
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: currentTheme.colors.surface + '40',
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <User className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                <span style={{ color: currentTheme.colors.text }}>Basic Information</span>
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: currentTheme.colors.primary }}
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm">{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2 rounded-lg border opacity-60 cursor-not-allowed"
                    style={{
                      backgroundColor: currentTheme.colors.surface + '60',
                      borderColor: currentTheme.colors.border,
                      color: currentTheme.colors.text
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    opacity: isEditing ? 1 : 0.6
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 rounded-lg border transition-colors"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    opacity: isEditing ? 1 : 0.6
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                  Gender
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => isEditing && setShowGenderDropdown(!showGenderDropdown)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 rounded-lg border transition-colors text-left flex items-center justify-between"
                    style={{
                      backgroundColor: currentTheme.colors.surface + '60',
                      borderColor: currentTheme.colors.border,
                      color: currentTheme.colors.text,
                      opacity: isEditing ? 1 : 0.6
                    }}
                  >
                    <span>
                      {formData.gender ? 
                        formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 
                        'Select gender'
                      }
                    </span>
                    {isEditing && <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {showGenderDropdown && isEditing && (
                    <div 
                      className="absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-50 overflow-hidden"
                      style={{
                        backgroundColor: currentTheme.colors.surface + 'f0',
                        borderColor: currentTheme.colors.border
                      }}
                    >
                      {[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'neutral', label: 'Neutral/Prefer not to say' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, gender: option.value }));
                            setShowGenderDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors"
                          style={{ color: currentTheme.colors.text }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                    color: '#ffffff'
                  }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Personality */}
          <div 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: currentTheme.colors.surface + '40',
              borderColor: currentTheme.colors.border
            }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Settings className="w-5 h-5" style={{ color: currentTheme.colors.secondary }} />
              <span style={{ color: currentTheme.colors.text }}>AI Personality Preference</span>
            </h3>

            <div className="space-y-3">
              {[
                { value: 'sarah', label: 'Sarah AI', description: 'Professional and friendly (Recommended for Males)' },
                { value: 'xhash', label: 'Xhash AI', description: 'Intelligent and adaptive (Recommended for Females)' },
                { value: 'neutral', label: 'Neutral AI', description: 'Balanced and unbiased (Gender Neutral)' }
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: formData.personality === option.value ? currentTheme.colors.primary + '20' : currentTheme.colors.surface + '20',
                    borderColor: formData.personality === option.value ? currentTheme.colors.primary + '50' : currentTheme.colors.border
                  }}
                >
                  <input
                    type="radio"
                    name="personality"
                    value={option.value}
                    checked={formData.personality === option.value}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                    style={{ accentColor: currentTheme.colors.primary }}
                  />
                  <div>
                    <div className="font-medium" style={{ color: currentTheme.colors.text }}>
                      {option.label}
                    </div>
                    <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div 
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: currentTheme.colors.surface + '40',
              borderColor: currentTheme.colors.border
            }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5" style={{ color: currentTheme.colors.warning }} />
              <span style={{ color: currentTheme.colors.text }}>Security Settings</span>
            </h3>

            <div className="space-y-4">
              {/* Change Password */}
              <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: currentTheme.colors.border }}>
                <div>
                  <div className="font-medium" style={{ color: currentTheme.colors.text }}>Password</div>
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    Last changed 30 days ago
                  </div>
                </div>
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-white/10"
                  style={{ color: currentTheme.colors.primary }}
                >
                  Change Password
                </button>
              </div>

              {showChangePassword && (
                <div className="p-4 rounded-lg border space-y-3" style={{ 
                  backgroundColor: currentTheme.colors.surface + '20',
                  borderColor: currentTheme.colors.border 
                }}>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-10 py-2 rounded-lg border"
                        style={{
                          backgroundColor: currentTheme.colors.surface + '60',
                          borderColor: currentTheme.colors.border,
                          color: currentTheme.colors.text
                        }}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-10 py-2 rounded-lg border"
                        style={{
                          backgroundColor: currentTheme.colors.surface + '60',
                          borderColor: currentTheme.colors.border,
                          color: currentTheme.colors.text
                        }}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: currentTheme.colors.textSecondary }} />
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-10 py-2 rounded-lg border"
                        style={{
                          backgroundColor: currentTheme.colors.surface + '60',
                          borderColor: currentTheme.colors.border,
                          color: currentTheme.colors.text
                        }}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowChangePassword(false)}
                      className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-white/10"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                        color: '#ffffff'
                      }}
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: currentTheme.colors.border }}>
                <div>
                  <div className="font-medium" style={{ color: currentTheme.colors.text }}>Two-Factor Authentication</div>
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {user.two_factor_enabled ? 'Enabled - Your account is protected' : 'Add an extra layer of security'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className={`w-3 h-3 rounded-full ${user.two_factor_enabled ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: user.two_factor_enabled ? currentTheme.colors.success : currentTheme.colors.error }}
                  />
                  <button
                    onClick={user.two_factor_enabled ? () => setShow2FASetup(true) : handleEnable2FA}
                    className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-white/10"
                    style={{ color: user.two_factor_enabled ? currentTheme.colors.error : currentTheme.colors.success }}
                  >
                    {user.two_factor_enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.error}, ${currentTheme.colors.warning})`,
                color: '#ffffff'
              }}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};