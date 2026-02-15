// import React, { useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { LoginPage } from './LoginPage';
// import { RegisterPage } from './RegisterPage';
// import { VerifyEmailPage } from './VerifyEmailPage';
// import { ForgotPasswordPage } from './ForgotPasswordPage';
// import { TwoFactorPage } from './TwoFactorPage';

// interface AuthWrapperProps {
//   children: React.ReactNode;
// }

// type AuthView = 'login' | 'register' | 'verify' | 'forgot-password' | '2fa';

// export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
//   const { isAuthenticated, isLoading, twoFactorRequired } = useAuth();
//   const [currentView, setCurrentView] = useState<AuthView>('login');

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-900">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-slate-300">Loading SARAH AI...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     if (twoFactorRequired) {
//       return (
//         <TwoFactorPage
//           onSwitchToLogin={() => setCurrentView('login')}
//           onVerificationSuccess={() => {}}
//         />
//       );
//     }

//     switch (currentView) {
//       case 'register':
//         return (
//           <RegisterPage
//             onSwitchToLogin={() => setCurrentView('login')}
//             onSwitchToVerify={() => setCurrentView('verify')}
//           />
//         );
//       case 'verify':
//         return (
//           <VerifyEmailPage
//             onSwitchToLogin={() => setCurrentView('login')}
//             onVerificationSuccess={() => {}}
//           />
//         );
//       case 'forgot-password':
//         return (
//           <ForgotPasswordPage
//             onSwitchToLogin={() => setCurrentView('login')}
//             onSwitchToVerify={() => setCurrentView('verify')}
//           />
//         );
//       case '2fa':
//         return (
//           <TwoFactorPage
//             onSwitchToLogin={() => setCurrentView('login')}
//             onVerificationSuccess={() => {}}
//           />
//         );
//       default:
//         return (
//           <LoginPage
//             onSwitchToRegister={() => setCurrentView('register')}
//             onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
//             onSwitchTo2FA={() => setCurrentView('2fa')}
//           />
//         );
//     }
//   }

//   return <>{children}</>;
// };
