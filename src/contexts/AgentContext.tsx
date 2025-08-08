import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Agent, agents } from '../types/Agent';

interface AgentContextType {
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;
  agents: Agent[];
  currentView: 'welcome' | 'selector' | 'dashboard';
  setCurrentView: (view: 'welcome' | 'selector' | 'dashboard') => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [currentView, setCurrentView] = useState<'welcome' | 'selector' | 'dashboard'>('welcome');

  return (
    <AgentContext.Provider value={{
      selectedAgent,
      setSelectedAgent,
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