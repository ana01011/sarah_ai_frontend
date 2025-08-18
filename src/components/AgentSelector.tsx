import React, { useState } from 'react';
import { ArrowLeft, Search, Users, Star, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAgent } from '../contexts/AgentContext';
import { agents, agentCategories } from '../types/Agent';

export const AgentSelector: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setSelectedAgent, setCurrentView } = useAgent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  const handleAgentSelect = (agent: any) => {
    setSelectedAgent(agent);
    setCurrentView('agent-dashboard');
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
                           (selectedCategory === 'c-level' && agent.level === 'C-Level') ||
                           (selectedCategory === 'managers' && agent.level === 'Manager') ||
                           (selectedCategory === 'senior-developers' && agent.level === 'Senior') ||
                           (selectedCategory === 'junior-developers' && agent.level === 'Junior');
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Header */}
      <header 
        className="backdrop-blur-md border-b sticky top-0 z-40"
        style={{ 
          backgroundColor: currentTheme.colors.surface + '80',
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-white/10"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold" style={{ color: currentTheme.colors.text }}>
                  AI Agents
                </h1>
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  Choose an AI agent to chat with
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
              <span className="text-sm font-medium">{agents.length} Agents</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                   style={{ color: currentTheme.colors.textSecondary }} />
            <input
              type="text"
              placeholder="Search agents by name, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border transition-colors focus:outline-none"
              style={{
                backgroundColor: currentTheme.colors.surface + '60',
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                !selectedCategory ? 'scale-105' : 'hover:scale-105'
              }`}
              style={{
                backgroundColor: !selectedCategory 
                  ? currentTheme.colors.primary + '20'
                  : currentTheme.colors.surface + '40',
                borderColor: !selectedCategory 
                  ? currentTheme.colors.primary + '50'
                  : currentTheme.colors.border,
                color: !selectedCategory 
                  ? currentTheme.colors.primary
                  : currentTheme.colors.textSecondary
              }}
            >
              All Agents
            </button>
            
            {agentCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  selectedCategory === category.id ? 'scale-105' : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id 
                    ? currentTheme.colors.primary + '20'
                    : currentTheme.colors.surface + '40',
                  borderColor: selectedCategory === category.id 
                    ? currentTheme.colors.primary + '50'
                    : currentTheme.colors.border,
                  color: selectedCategory === category.id 
                    ? currentTheme.colors.primary
                    : currentTheme.colors.textSecondary
                }}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => handleAgentSelect(agent)}
              className="group cursor-pointer backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
                borderColor: currentTheme.colors.border,
                boxShadow: `0 8px 32px -8px ${currentTheme.shadows.primary}`
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{agent.avatar}</div>
                <div 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: currentTheme.colors.success + '20',
                    color: currentTheme.colors.success
                  }}
                >
                  {agent.level}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold mb-1" style={{ color: currentTheme.colors.text }}>
                  {agent.name}
                </h3>
                <p className="text-sm font-medium mb-2" style={{ color: currentTheme.colors.primary }}>
                  {agent.role}
                </p>
                <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                  {agent.department}
                </p>
              </div>

              <p className="text-sm mb-4 line-clamp-2" style={{ color: currentTheme.colors.textSecondary }}>
                {agent.description}
              </p>

              {/* Specialties */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {agent.specialties.slice(0, 2).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: currentTheme.colors.accent + '20',
                        color: currentTheme.colors.accent
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                  {agent.specialties.length > 2 && (
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: currentTheme.colors.textSecondary + '20',
                        color: currentTheme.colors.textSecondary
                      }}
                    >
                      +{agent.specialties.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star className="w-3 h-3" style={{ color: currentTheme.colors.warning }} />
                    <span style={{ color: currentTheme.colors.text }}>{agent.metrics.performance}%</span>
                  </div>
                  <span style={{ color: currentTheme.colors.textSecondary }}>Performance</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <TrendingUp className="w-3 h-3" style={{ color: currentTheme.colors.success }} />
                    <span style={{ color: currentTheme.colors.text }}>{agent.metrics.efficiency}%</span>
                  </div>
                  <span style={{ color: currentTheme.colors.textSecondary }}>Efficiency</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: currentTheme.colors.textSecondary }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
              No agents found
            </h3>
            <p style={{ color: currentTheme.colors.textSecondary }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};