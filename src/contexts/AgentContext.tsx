import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Agent, agents } from '../types/Agent';

export type ViewType = 'welcome' | 'dashboard' | 'selector' | 'agent';

interface AgentContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;
  agents: Agent[];
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('welcome');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <AgentContext.Provider value={{
      currentView,
      setCurrentView,
      selectedAgent,
      setSelectedAgent,
      agents
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