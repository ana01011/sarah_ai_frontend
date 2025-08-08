import React, { useState } from 'react';
import { Search, Filter, ArrowRight, Star, Users, Briefcase } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAgent } from '../contexts/AgentContext';
import { agentCategories, agents } from '../types/Agent';

export const AgentSelector: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setSelectedAgent, setCurrentView } = useAgent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAgents, setShowAgents] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowAgents(true);
  };

  const handleAgentSelect = (agent: any) => {
    setSelectedAgent(agent);
    setCurrentView('agent-dashboard');
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || 
                           (selectedCategory === 'c-level' && agent.level === 'C-Level') ||
                           (selectedCategory === 'managers' && agent.level === 'Manager') ||
                           (selectedCategory === 'senior-developers' && agent.level === 'Senior') ||
                           (selectedCategory === 'junior-developers' && agent.level === 'Junior') ||
                           (selectedCategory === 'interns' && agent.level === 'Intern');
    
    return matchesSearch && matchesCategory;
  });

  if (showAgents && selectedCategory) {
    return (
      <div 
        className="min-h-screen transition-all duration-500 p-4 sm:p-6"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
          color: currentTheme.colors.text
        }}
      >
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <button
            onClick={() => setShowAgents(false)}
            className="mb-6 flex items-center space-x-2 text-sm hover:scale-105 transition-transform"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Categories</span>
          </button>
          
          <div className="text-center mb-8">
            <h1 
              className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent mb-4"
              style={{
                backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
              }}
            >
              {agentCategories.find(c => c.id === selectedCategory)?.name}
            </h1>
            <p className="text-lg" style={{ color: currentTheme.colors.textSecondary }}>
              {agentCategories.find(c => c.id === selectedCategory)?.description}
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: currentTheme.colors.textSecondary }} />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border backdrop-blur-md transition-all duration-300"
              style={{
                backgroundColor: currentTheme.colors.surface + '80',
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}
            />
          </div>
        </div>

        {/* Agents Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => handleAgentSelect(agent)}
                className="group backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500 hover:scale-[1.05] cursor-pointer relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
                  borderColor: currentTheme.colors.border,
                  boxShadow: `0 8px 32px -8px ${currentTheme.shadows.primary}`
                }}
              >
                {/* Animated background */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.primary}10, ${currentTheme.colors.secondary}10)`
                  }}
                />
                
                <div className="relative z-10">
                  {/* Avatar and Level */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{agent.avatar}</div>
                    <div 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: currentTheme.colors.primary + '20',
                        color: currentTheme.colors.primary
                      }}
                    >
                      {agent.level}
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-1" style={{ color: currentTheme.colors.text }}>
                      {agent.name}
                    </h3>
                    <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                      {agent.role}
                    </p>
                    <p className="text-xs mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                      {agent.department}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-4" style={{ color: currentTheme.colors.textSecondary }}>
                    {agent.description}
                  </p>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.slice(0, 2).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-lg text-xs"
                          style={{
                            backgroundColor: currentTheme.colors.surface + '60',
                            color: currentTheme.colors.textSecondary
                          }}
                        >
                          {specialty}
                        </span>
                      ))}
                      {agent.specialties.length > 2 && (
                        <span
                          className="px-2 py-1 rounded-lg text-xs"
                          style={{
                            backgroundColor: currentTheme.colors.surface + '60',
                            color: currentTheme.colors.textSecondary
                          }}
                        >
                          +{agent.specialties.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: currentTheme.colors.primary }}>
                        {agent.metrics.performance}%
                      </div>
                      <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                        Performance
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: currentTheme.colors.secondary }}>
                        {agent.metrics.efficiency}%
                      </div>
                      <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                        Efficiency
                      </div>
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    className="w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                      color: currentTheme.colors.text
                    }}
                  >
                    <span>Select Agent</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-all duration-500 p-4 sm:p-6"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-[32rem] h-[32rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ backgroundColor: currentTheme.colors.primary }}
        />
        <div 
          className="absolute top-0 right-0 w-[28rem] h-[28rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"
          style={{ backgroundColor: currentTheme.colors.secondary }}
        />
        <div 
          className="absolute bottom-0 left-1/2 w-[30rem] h-[30rem] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"
          style={{ backgroundColor: currentTheme.colors.accent }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent mb-4"
            style={{
              backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
            }}
          >
            AI Employee Company
          </h1>
          <p className="text-lg sm:text-xl" style={{ color: currentTheme.colors.textSecondary }}>
            Choose your AI agent from our professional team
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="group backdrop-blur-xl border rounded-2xl p-8 transition-all duration-500 hover:scale-[1.05] cursor-pointer relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
                borderColor: currentTheme.colors.border,
                boxShadow: `0 8px 32px -8px ${currentTheme.shadows.primary}`
              }}
            >
              {/* Animated background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${category.color}10, ${category.color}05)`
                }}
              />
              
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="text-5xl mb-4">{category.icon}</div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                  {category.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm mb-4" style={{ color: currentTheme.colors.textSecondary }}>
                  {category.description}
                </p>
                
                {/* Count */}
                <div 
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
                  style={{ 
                    backgroundColor: category.color + '20',
                    color: category.color
                  }}
                >
                  <Users className="w-4 h-4" />
                  <span>{category.count} Agents</span>
                </div>
                
                {/* Select Button */}
                <button
                  className="w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}40, ${category.color}60)`,
                    color: currentTheme.colors.text,
                    border: `1px solid ${category.color}50`
                  }}
                >
                  <span>View Agents</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};