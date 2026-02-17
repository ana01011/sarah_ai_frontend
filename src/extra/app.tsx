// import React from 'react';
// import { ThemeProvider } from './contexts/ThemeContext';
// import { AuthProvider } from './contexts/AuthContext';
// import { AgentProvider } from './contexts/AgentContext';
// import { AuthWrapper } from './components/auth/AuthWrapper';
// import { useAgent } from './contexts/AgentContext';
// import { useAuth } from './contexts/AuthContext';
// import { WelcomeScreen } from './components/WelcomeScreen';
// import { Dashboard } from './components/Dashboard';
// import { AgentSelector } from './components/AgentSelector';
// import { AgentDashboard } from './components/AgentDashboard';

// const AppContent: React.FC = () => {
//   const { currentView } = useAgent();
//   const { isAuthenticated } = useAuth();

//   switch (currentView) {
//     case 'welcome':
//       return <WelcomeScreen />;
//     case 'dashboard':
//       return <Dashboard />;
//     case 'selector':
//       return <AgentSelector />;
//     case 'agent':
//       return <AgentDashboard />;
//     default:
//       return <WelcomeScreen />;
//   }
// };

// function App() {
//   return (
//     <ThemeProvider>
//       <AuthProvider>
//         <AgentProvider>
//           <div className="min-h-screen transition-colors">
//             <AuthWrapper>
//               <AppContent />
//             </AuthWrapper>
//           </div>
//         </AgentProvider>
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

// import React, { useState } from 'react';
// import { ThemeProvider, useTheme } from './contexts/ThemeContext';
// import { AuthProvider } from './contexts/AuthContext';
// import { AgentProvider, useAgent } from './contexts/AgentContext';
// import { AuthWrapper } from './components/auth/AuthWrapper';
// import { WelcomeScreen } from './components/WelcomeScreen';
// import { Dashboard } from './components/Dashboard';
// // import { AgentSelector } from './components/AgentSelector';
// import { AgentSelector } from './components/agent/AgentSelector';
// // import { AgentDashboard } from './components/AgentDashboard';
// import { AgentDashboard } from './components/AgentDashboard';
// import { Sidebar } from './components/Sidebar';
// import { AmesieDashboard } from './components/amesie/AmesieDashboard';
// import { AmesieOrders } from './components/amesie/AmesieOrders';
// import { AmesieMenu } from './components/amesie/AmesieMenu';
// import AmesieProfile from './components/amesie/profile';
// import { Menu } from 'lucide-react';

// const AppContent: React.FC = () => {
//   const { currentView } = useAgent();
//   const { currentTheme } = useTheme();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: currentTheme.colors.background }}>
      
//       {/* Responsive Sidebar */}
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
//       <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
//         {/* Mobile Header (Only visible on small screens) */}
//         <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-30" style={{ borderColor: currentTheme.colors.border }}>
//           <button 
//             onClick={() => setIsSidebarOpen(true)}
//             className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600"
//           >
//             <Menu size={24} />
//           </button>
//           <span className="font-bold text-lg text-slate-800">AMESIE</span>
//           <div className="w-8" /> {/* Spacer for centering */}
//         </div>

//         {/* Main Scrollable Content */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="h-full w-full">
//             {(() => {
//               switch (currentView) {
//                 case 'welcome': return <WelcomeScreen />;
//                 case 'dashboard': return <Dashboard />;
//                 case 'selector': return <AgentSelector />;
//                 case 'agent': return <AgentDashboard />;
                
//                 case 'amesie-dashboard': return <AmesieDashboard />;
//                 case 'amesie-orders': return <AmesieOrders />;
//                 case 'amesie-menu': return <AmesieMenu />;
//                 case 'profile': return <AmesieProfile />;
                  
//                 default: return <WelcomeScreen />;
//               }
//             })()}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// function App() {
//   return (
//     <ThemeProvider>
//       {/* 1. AgentProvider MUST be outside AuthProvider */}
//       <AgentProvider>
//         {/* 2. Now AuthProvider can safely use useAgent() */}
//         <AuthProvider>
//           <AuthWrapper>
//             <AppContent />
//           </AuthWrapper>
//         </AuthProvider>
//       </AgentProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

// import React, { useState } from 'react';
// import { ThemeProvider, useTheme } from './contexts/ThemeContext';
// import { AuthProvider } from './contexts/AuthContext';
// import { AgentProvider, useAgent } from './contexts/AgentContext';
// import { AuthWrapper } from './components/auth/AuthWrapper';
// import { WelcomeScreen } from './components/WelcomeScreen';
// import { Dashboard } from './components/Dashboard';
// import { AgentSelector } from './components/agent/AgentSelector';
// import { AgentDashboard } from './components/AgentDashboard';
// import { Sidebar } from './components/Sidebar';
// import { AmesieDashboard } from './components/amesie/AmesieDashboard';
// import { AmesieOrders } from './components/amesie/AmesieOrders';
// import { AmesieMenu } from './components/amesie/AmesieMenu';
// import AmesieProfile from './components/amesie/profile';
// import { Menu } from 'lucide-react';

// // 1. IMPORT THE CHAT COMPONENT
// import { AgentChat } from './components/agent/AgentChat';

// const AppContent: React.FC = () => {
//   const { currentView } = useAgent();
//   const { currentTheme } = useTheme();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: currentTheme.colors.background }}>
      
//       {/* Responsive Sidebar */}
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
//       <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
//         {/* Mobile Header (Only visible on small screens) */}
//         <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-30" style={{ borderColor: currentTheme.colors.border }}>
//           <button 
//             onClick={() => setIsSidebarOpen(true)}
//             className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600"
//           >
//             <Menu size={24} />
//           </button>
//           <span className="font-bold text-lg text-slate-800">AMESIE</span>
//           <div className="w-8" /> {/* Spacer for centering */}
//         </div>

//         {/* Main Scrollable Content */}
//         {/* <div className="flex-1 overflow-y-auto"> */}
//         <div className="flex-1 min-h-0">
//           <div className="h-full w-full">
//             {(() => {
//               switch (currentView) {
//                 // --- General Views ---
//                 case 'welcome': return <WelcomeScreen />;
//                 case 'dashboard': return <Dashboard />;
                
//                 // --- Agent Views ---
//                 case 'selector': return <AgentSelector />;
//                 case 'agent': return <AgentDashboard />;
//                 case 'chat': return <AgentChat isIntegrated={true}/>; // <--- 2. ADDED THIS CASE
                
//                 // --- Amesie Specific Views ---
//                 case 'amesie-dashboard': return <AmesieDashboard />;
//                 case 'amesie-orders': return <AmesieOrders />;
//                 case 'amesie-menu': return <AmesieMenu />;
//                 case 'profile': return <AmesieProfile />;
                  
//                 default: 
//                   console.warn(`Unknown view: ${currentView}`);
//                   return <WelcomeScreen />;
//               }
//             })()}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// function App() {
//   return (
//     <ThemeProvider>
//       <AgentProvider>
//         <AuthProvider>
//           <AuthWrapper>
//             <AppContent />
//           </AuthWrapper>
//         </AuthProvider>
//       </AgentProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

// import React, { useState } from 'react';
// import { ThemeProvider, useTheme } from './contexts/ThemeContext';
// import { AuthProvider } from './contexts/AuthContext';
// import { AgentProvider, useAgent } from './contexts/AgentContext';
// import { AuthWrapper } from './components/auth/AuthWrapper';
// import { WelcomeScreen } from './components/WelcomeScreen';
// import { Dashboard } from './components/Dashboard';
// import { AgentSelector } from './components/agent/AgentSelector';
// import { AgentDashboard } from './components/AgentDashboard';
// import { Sidebar } from './components/Sidebar';
// import { AmesieDashboard } from './components/amesie/AmesieDashboard';
// import { AmesieOrders } from './components/amesie/AmesieOrders';
// import { AmesieMenu } from './components/amesie/AmesieMenu';
// import AmesieProfile from './components/amesie/profile';
// import { Menu } from 'lucide-react';
// import { AgentChat } from './components/agent/AgentChat';

// const AppContent: React.FC = () => {
//   const { currentView } = useAgent();
//   const { currentTheme } = useTheme();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: currentTheme.colors.background }}>
      
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
//       <main className="flex-1 flex flex-col h-full overflow-hidden relative z-0">
        
//         <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-30" style={{ borderColor: currentTheme.colors.border }}>
//           <button 
//             onClick={() => setIsSidebarOpen(true)}
//             className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600"
//           >
//             <Menu size={24} />
//           </button>
//           <span className="font-bold text-lg text-slate-800">AMESIE</span>
//           <div className="w-8" />
//         </div>

//         <div className="flex-1 min-h-0 relative">
//           <div className="h-full w-full">
//             {(() => {
//               switch (currentView) {
//                 case 'welcome': return <WelcomeScreen />;
//                 case 'dashboard': return <Dashboard />;
//                 case 'selector': return <AgentSelector />;
//                 case 'agent': return <AgentDashboard />;
                
//                 case 'chat': return <AgentChat />;
                
//                 case 'amesie-dashboard': return <AmesieDashboard />;
//                 case 'amesie-orders': return <AmesieOrders />;
//                 case 'amesie-menu': return <AmesieMenu />;
//                 case 'profile': return <AmesieProfile />;
                  
//                 default: 
//                   console.warn(`Unknown view: ${currentView}`);
//                   return <WelcomeScreen />;
//               }
//             })()}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// function App() {
//   return (
//     <ThemeProvider>
//       <AgentProvider>
//         <AuthProvider>
//           <AuthWrapper>
//             <AppContent />
//           </AuthWrapper>
//         </AuthProvider>
//       </AgentProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

// import React, { useState } from 'react';
// import { ThemeProvider, useTheme } from './contexts/ThemeContext';
// import { AuthProvider } from './contexts/AuthContext';
// import { AgentProvider, useAgent } from './contexts/AgentContext';
// import { AuthWrapper } from './components/auth/AuthWrapper';
// import { WelcomeScreen } from './components/WelcomeScreen';
// import { Dashboard } from './components/Dashboard';
// import { AgentSelector } from './components/agent/AgentSelector';
// import { AgentDashboard } from './components/AgentDashboard';
// import { Sidebar } from './components/Sidebar';
// import { AmesieDashboard } from './components/amesie/AmesieDashboard';
// import { AmesieOrders } from './components/amesie/AmesieOrders';
// import { AmesieMenu } from './components/amesie/AmesieMenu';
// import AmesieProfile from './components/amesie/profile';
// import { Menu } from 'lucide-react';
// import { AgentChat } from './components/agent/AgentChat';

// const AppContent: React.FC = () => {
//   const { currentView } = useAgent();
//   const { currentTheme } = useTheme();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: currentTheme.colors.background }}>
      
//       {/* Sidebar Overlay */}
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
//       <main className="flex-1 flex flex-col h-full overflow-hidden relative z-0">
        
//         {/* GLOBAL FLOATING MENU BUTTON - TOP RIGHT
//            1. 'fixed': Ensures it stays on top of everything (even Chat).
//            2. 'top-4 right-4': Positions it in the right corner.
//            3. 'z-[100]': Max z-index to prevent being covered.
//         */}
//         <button 
//           onClick={() => setIsSidebarOpen(true)}
//           className="md:hidden fixed top-0 right-0 z-[100] p-2.5  bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 text-slate-600 transition-all active:scale-95 hover:bg-white hover:text-slate-900"
//           style={{ borderColor: currentTheme.colors.border }}
//         >
//           <Menu size={20} />
//         </button>

//         {/* Content Wrapper */}
//         <div className="flex-1 min-h-0 relative">
//           <div className="h-full w-full">
//             {(() => {
//               switch (currentView as any) {
//                 case 'welcome': return <WelcomeScreen />;
//                 case 'dashboard': return <Dashboard />;
//                 case 'selector': return <AgentSelector />;
//                 case 'agent': return <AgentDashboard />;
                
//                 // Chat View - No special props needed, global button handles navigation
//                 case 'chat': return <AgentChat />;
                
//                 case 'amesie-dashboard': return <AmesieDashboard />;
//                 case 'amesie-orders': return <AmesieOrders />;
//                 case 'amesie-menu': return <AmesieMenu />;
//                 case 'profile': return <AmesieProfile />;
                  
//                 default: 
//                   return <WelcomeScreen />;
//               }
//             })()}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// function App() {
//   return (
//     <ThemeProvider>
//       <AgentProvider>
//         <AuthProvider>
//           <AuthWrapper>
//             <AppContent />
//           </AuthWrapper>
//         </AuthProvider>
//       </AgentProvider>
//     </ThemeProvider>
//   );
// }

// export default App;