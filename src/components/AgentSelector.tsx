import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Star, Users, Brain, Code, Briefcase, Calculator, Target, Settings, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAgent } from '../contexts/AgentContext';
import { agents, agentCategories } from '../types/Agent';

export const AgentSelector: React.FC = () => {
  const { currentTheme } = useTheme();
  const { setCurrentView, setSelectedAgent } = useAgent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'performance' | 'level'>('performance');

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  const handleAgentSelect = (agent: any) => {
    setSelectedAgent(agent);
    setCurrentView('agent');
  };

  const filteredAgents = agents
    .filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
                             (selectedCategory === 'c-level' && agent.level === 'C-Level') ||
                             (selectedCategory === 'managers' && agent.level === 'Manager') ||
                             (selectedCategory === 'senior-developers' && agent.level === 'Senior') ||
                             (selectedCategory === 'junior-developers' && agent.level === 'Junior');
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'performance':
          return b.metrics.performance - a.metrics.performance;
        case 'level':
          const levelOrder = { 'C-Level': 5, 'Manager': 4, 'Senior': 3, 'Junior': 2, 'Intern': 1, 'Specialist': 3 };
          return levelOrder[b.level as keyof typeof levelOrder] - levelOrder[a.level as keyof typeof levelOrder];
        default:
          return 0;
      }
    });

  const getCategoryIcon = (categoryId: string) => {
    const icons = {
      'c-level': Briefcase,
      'managers': Users,
      'senior-developers': Code,
      'junior-developers': Brain,
      'mathematicians': Calculator,
      'physicists': Zap
    };
    return icons[categoryId as keyof typeof icons] || Users;
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500"
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

      <div className="relative z-10">
        {/* Header */}
        <div 
          className="backdrop-blur-md border-b p-4 sm:p-6"
          style={{ 
            backgroundColor: currentTheme.colors.surface + '80',
            borderColor: currentTheme.colors.border
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBack}
                  className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: currentTheme.colors.textSecondary }} />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: currentTheme.colors.text }}>
                    AI Agent Selection
                  </h1>
                  <p className="text-sm sm:text-base" style={{ color: currentTheme.colors.textSecondary }}>
                    Choose your specialized AI assistant
                  </p>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                        style={{ color: currentTheme.colors.textSecondary }} />
                <input
                  type="text"
                  placeholder="Search agents by name, role, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: currentTheme.colors.surface + '60',
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text,
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'performance' | 'level')}
                className="px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none min-w-[120px]"
                style={{
                  backgroundColor: currentTheme.colors.surface + '60',
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text,
                  fontSize: '16px'
                }}
              >
                <option value="performance">By Performance</option>
                <option value="name">By Name</option>
                <option value="level">By Level</option>
              </select>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105 ${
                  selectedCategory === 'all' ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: selectedCategory === 'all' 
                    ? currentTheme.colors.primary + '20' 
                    : currentTheme.colors.surface + '40',
                  color: selectedCategory === 'all' 
                    ? currentTheme.colors.primary 
                    : currentTheme.colors.textSecondary,
                  borderColor: selectedCategory === 'all' 
                    ? currentTheme.colors.primary + '50' 
                    : currentTheme.colors.border
                }}
              >
                All Agents ({agents.length})
              </button>
              
              {agentCategories.map((category) => {
                const Icon = getCategoryIcon(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105 ${
                      selectedCategory === category.id ? 'font-semibold' : ''
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category.id 
                        ? currentTheme.colors.primary + '20' 
                        : currentTheme.colors.surface + '40',
                      color: selectedCategory === category.id 
                        ? currentTheme.colors.primary 
                        : currentTheme.colors.textSecondary
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name} ({category.count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => handleAgentSelect(agent)}
                  className="backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.colors.surface}80, ${currentTheme.colors.surface}40)`,
                    borderColor: currentTheme.colors.border,
                    boxShadow: `0 8px 32px -8px ${currentTheme.shadows.primary}`
                  }}
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent 
                                  transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                  transition-transform duration-1000"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{agent.avatar}</div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" style={{ color: currentTheme.colors.warning }} />
                        <span className="text-sm font-semibold" style={{ color: currentTheme.colors.text }}>
                          {agent.metrics.performance}%
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-1" style={{ color: currentTheme.colors.text }}>
                      {agent.name}
                    </h3>
                    
                    <p className="text-sm mb-2" style={{ color: currentTheme.colors.primary }}>
                      {agent.role}
                    </p>
                    
                    <p className="text-xs mb-4 line-clamp-2" style={{ color: currentTheme.colors.textSecondary }}>
                      {agent.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {agent.specialties.slice(0, 2).map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: currentTheme.colors.primary + '20',
                            color: currentTheme.colors.primary
                          }}
                        >
                          {specialty}
                        </span>
                      ))}
                      {agent.specialties.length > 2 && (
                        <span
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: currentTheme.colors.surface + '60',
                            color: currentTheme.colors.textSecondary
                          }}
                        >
                          +{agent.specialties.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: currentTheme.colors.secondary + '20',
                          color: currentTheme.colors.secondary
                        }}
                      >
                        {agent.level}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" 
                             style={{ backgroundColor: currentTheme.colors.success }} />
                        <span className="text-xs" style={{ color: currentTheme.colors.success }}>
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredAgents.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" 
                       style={{ color: currentTheme.colors.textSecondary }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: currentTheme.colors.text }}>
                  No agents found
                </h3>
                <p style={{ color: currentTheme.colors.textSecondary }}>
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};