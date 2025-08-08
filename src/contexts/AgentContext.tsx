import React, { createContext, useContext, useState } from 'react';
import { Agent, agents } from '../types/Agent';

interface AgentContextType {
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;
  agents: Agent[];
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <AgentContext.Provider value={{ selectedAgent, setSelectedAgent, agents }}>
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