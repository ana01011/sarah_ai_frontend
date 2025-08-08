import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Agent, agents } from '../types/Agent';
import { useTheme } from './ThemeContext';

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
  };

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