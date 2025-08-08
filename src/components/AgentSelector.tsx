import React, { useState } from 'react';
import { Crown, Code, TrendingUp, Megaphone, Settings, Users, Briefcase, GraduationCap, Star, ChevronRight, Search, Filter } from 'lucide-react';
import { useAgent } from '../contexts/AgentContext';
import { useTheme } from '../contexts/ThemeContext';
import { Agent } from '../types/Agent';

const levelIcons = {
  executive: Crown,
  manager: Briefcase,
  senior: Star,
  junior: Code,
  intern: GraduationCap,
};

const levelColors = {
  executive: '#d4af37',
  manager: '#7c3aed',
  senior: '#0891b2',
  junior: '#ec4899',
  intern: '#22c55e',
};

export const AgentSelector: React.FC = () => {
  const { agents, setSelectedAgent } = useAgent();
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || agent.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const groupedAgents = filteredAgents.reduce((acc, agent) => {
    if (!acc[agent.level]) acc[agent.level] = [];
    acc[agent.level].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  const levelOrder = ['executive', 'manager', 'senior', 'junior', 'intern'];

  return (
    <div 
      className="min-h-screen transition-all duration-500 p-4 sm:p-6"
      style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
        color: currentTheme.colors.text
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent mb-4"
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
            }}
          >
            SARAH AI COMPANY
          </h1>
          <p className="text-lg sm:text-xl mb-6" style={{ color: currentTheme.colors.textSecondary }}>
            Select an AI Agent to Access Their Specialized Dashboard
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: currentTheme.colors.textSecondary }} />
              <input
                type="text"
                placeholder="Search agents by name, role, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200"
                style={{
                  backgroundColor: currentTheme.colors.surface + '80',
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: currentTheme.colors.textSecondary }} />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-xl border transition-all duration-200 appearance-none"
                style={{
                  backgroundColor: currentTheme.colors.surface + '80',
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }}
              >
                <option value="all">All Levels</option>
                <option value="executive">Executives</option>
                <option value="manager">Managers</option>
                <option value="senior">Senior</option>
                <option value="junior">Junior</option>
                <option value="intern">Interns</option>
              </select>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="space-y-8">
          {levelOrder.map(level => {
            const levelAgents = groupedAgents[level];
            if (!levelAgents || levelAgents.length === 0) return null;
            
            const LevelIcon = levelIcons[level as keyof typeof levelIcons];
            
            return (
              <div key={level}>
                <div className="flex items-center space-x-3 mb-6">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: levelColors[level as keyof typeof levelColors] + '20' }}
                  >
                    <LevelIcon 
                      className="w-6 h-6" 
                      style={{ color: levelColors[level as keyof typeof levelColors] }}
                    />
                  </div>
                  <h2 
                    className="text-2xl font-bold capitalize"
                    style={{ color: levelColors[level as keyof typeof levelColors] }}
                  >
                    {level}s ({levelAgents.length})
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {levelAgents.map((agent) => {
                    const LevelIcon = levelIcons[agent.level];
                    
                    return (
                      <div
                        key={agent.id}
                        onClick={() => setSelectedAgent(agent)}
                        className="group cursor-pointer backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl relative overflow-hidden"
                        style={{
                          backgroundColor: currentTheme.colors.surface + '80',
                          borderColor: currentTheme.colors.border,
                          boxShadow: `0 4px 15px -3px ${currentTheme.shadows.primary}`
                        }}
                      >
                        {/* Animated background effect */}
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
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: levelColors[agent.level] + '20' }}
                            >
                              <LevelIcon 
                                className="w-4 h-4" 
                                style={{ color: levelColors[agent.level] }}
                              />
                            </div>
                          </div>
                          
                          {/* Agent Info */}
                          <div className="space-y-2 mb-4">
                            <h3 
                              className="text-lg font-bold"
                              style={{ color: currentTheme.colors.text }}
                            >
                              {agent.name}
                            </h3>
                            <p 
                              className="text-sm font-medium"
                              style={{ color: currentTheme.colors.primary }}
                            >
                              {agent.role}
                            </p>
                            <p 
                              className="text-xs"
                              style={{ color: currentTheme.colors.textSecondary }}
                            >
                              {agent.description}
                            </p>
                          </div>
                          
                          {/* Department */}
                          <div 
                            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
                            style={{
                              backgroundColor: currentTheme.colors.primary + '20',
                              color: currentTheme.colors.primary
                            }}
                          >
                            {agent.department}
                          </div>
                          
                          {/* Specialties */}
                          <div className="space-y-2 mb-4">
                            <p 
                              className="text-xs font-medium"
                              style={{ color: currentTheme.colors.textSecondary }}
                            >
                              Specialties:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {agent.specialties.slice(0, 3).map((specialty, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs rounded-full"
                                  style={{
                                    backgroundColor: currentTheme.colors.surface + '60',
                                    color: currentTheme.colors.textSecondary
                                  }}
                                >
                                  {specialty}
                                </span>
                              ))}
                              {agent.specialties.length > 3 && (
                                <span
                                  className="px-2 py-1 text-xs rounded-full"
                                  style={{
                                    backgroundColor: currentTheme.colors.surface + '60',
                                    color: currentTheme.colors.textSecondary
                                  }}
                                >
                                  +{agent.specialties.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <div className="flex items-center justify-between">
                            <span 
                              className="text-sm font-medium"
                              style={{ color: currentTheme.colors.primary }}
                            >
                              Access Dashboard
                            </span>
                            <ChevronRight 
                              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                              style={{ color: currentTheme.colors.primary }}
                            />
                          </div>
                        </div>
                        
                        {/* Glow effect */}
                        <div 
                          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300"
                          style={{ backgroundColor: currentTheme.colors.primary + '40' }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};