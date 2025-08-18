import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Agent, agents } from '../types/Agent';

interface AgentContextType {
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;
  agents: Agent[];
  currentView: 'welcome' | 'dashboard' | 'selector' | 'agent-dashboard';
  setCurrentView: (view: 'welcome' | 'dashboard' | 'selector' | 'agent-dashboard') => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard' | 'selector' | 'agent-dashboard'>('welcome');

  const handleSetSelectedAgent = (agent: Agent | null) => {
    setSelectedAgent(agent);
    // Add browser back button handling
    if (agent && typeof window !== 'undefined') {
      window.history.pushState({ agentId: agent.id }, '', `#agent-${agent.id}`);
    }
  };

  // Handle browser back button
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.agentId) {
        // User navigated back to an agent
        const agent = agents.find(a => a.id === event.state.agentId);
        if (agent) {
          setSelectedAgent(agent);
          setCurrentView('agent-dashboard');
        }
      } else {
        // User navigated back to main dashboard
        setSelectedAgent(null);
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <AgentContext.Provider value={{
      selectedAgent,
      setSelectedAgent: handleSetSelectedAgent,
      agents,
      currentView,
      setCurrentView
    }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};