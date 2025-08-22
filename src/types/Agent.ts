export interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  level: 'C-Level' | 'Manager' | 'Senior' | 'Junior' | 'Intern' | 'Specialist';
  avatar: string;
  specialties: string[];
  description: string;
  themeId: string;
  metrics: {
    performance: number;
    efficiency: number;
    experience: number;
    availability: number;
  };
}

export const agents: Agent[] = [
  // C-Level Executives
  {
    id: 'ceo',
    name: 'Alexander Sterling',
    role: 'Chief Executive Officer',
    department: 'Executive',
    level: 'C-Level',
    avatar: '👔',
    specialties: ['Strategic Planning', 'Leadership', 'Business Development', 'Stakeholder Management'],
    description: 'Visionary leader driving company strategy and growth initiatives',
    themeId: 'dark',
    metrics: { performance: 98, efficiency: 95, experience: 99, availability: 85 }
  },
  {
    id: 'cto',
    name: 'Dr. Sarah Chen',
    role: 'Chief Technology Officer',
    department: 'Technology',
    level: 'C-Level',
    avatar: '🚀',
    specialties: ['Technology Strategy', 'Innovation', 'System Architecture', 'AI/ML Leadership'],
    description: 'Technology visionary leading digital transformation and innovation',
    themeId: 'tech-blue',
    metrics: { performance: 97, efficiency: 94, experience: 98, availability: 88 }
  },
  {
    id: 'cfo',
    name: 'Michael Rodriguez',
    role: 'Chief Financial Officer',
    department: 'Finance',
    level: 'C-Level',
    avatar: '💰',
    specialties: ['Financial Strategy', 'Risk Management', 'Investment Analysis', 'Corporate Finance'],
    description: 'Financial strategist optimizing capital allocation and growth investments',
    themeId: 'finance-green',
    metrics: { performance: 96, efficiency: 97, experience: 95, availability: 90 }
  },
  {
    id: 'cmo',
    name: 'Emma Thompson',
    role: 'Chief Marketing Officer',
    department: 'Marketing',
    level: 'C-Level',
    avatar: '🎯',
    specialties: ['Brand Strategy', 'Digital Marketing', 'Customer Acquisition', 'Market Analysis'],
    description: 'Marketing innovator driving brand growth and customer engagement',
    themeId: 'marketing-purple',
    metrics: { performance: 94, efficiency: 92, experience: 93, availability: 87 }
  },
  {
    id: 'coo',
    name: 'James Wilson',
    role: 'Chief Operating Officer',
    department: 'Operations',
    level: 'C-Level',
    avatar: '⚙️',
    specialties: ['Operations Management', 'Process Optimization', 'Supply Chain', 'Quality Assurance'],
    description: 'Operations expert ensuring seamless business execution and efficiency',
    themeId: 'dark',
    metrics: { performance: 95, efficiency: 98, experience: 94, availability: 92 }
  },

  // Managers
  {
    id: 'eng-manager',
    name: 'David Kim',
    role: 'Engineering Manager',
    department: 'Engineering',
    level: 'Manager',
    avatar: '👨‍💻',
    specialties: ['Team Leadership', 'Project Management', 'Code Review', 'Technical Strategy'],
    description: 'Engineering leader managing high-performance development teams',
    themeId: 'tech-blue',
    metrics: { performance: 92, efficiency: 90, experience: 88, availability: 85 }
  },
  {
    id: 'product-manager',
    name: 'Lisa Zhang',
    role: 'Product Manager',
    department: 'Product',
    level: 'Manager',
    avatar: '📱',
    specialties: ['Product Strategy', 'User Research', 'Roadmap Planning', 'Stakeholder Management'],
    description: 'Product strategist driving user-centric innovation and growth',
    themeId: 'product-teal',
    metrics: { performance: 91, efficiency: 89, experience: 87, availability: 83 }
  },

  // Senior Developers
  {
    id: 'senior-fullstack',
    name: 'Alex Johnson',
    role: 'Senior Full-Stack Developer',
    department: 'Engineering',
    level: 'Senior',
    avatar: '🔧',
    specialties: ['React/Node.js', 'System Design', 'Database Architecture', 'DevOps'],
    description: 'Full-stack expert building scalable web applications and APIs',
    themeId: 'developer-dark',
    metrics: { performance: 89, efficiency: 87, experience: 85, availability: 88 }
  },
  {
    id: 'senior-ai',
    name: 'Dr. Priya Patel',
    role: 'Senior AI Engineer',
    department: 'AI Research',
    level: 'Senior',
    avatar: '🧠',
    specialties: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision'],
    description: 'AI specialist developing cutting-edge machine learning solutions',
    themeId: 'ai-neural',
    metrics: { performance: 93, efficiency: 91, experience: 89, availability: 86 }
  },

  // Junior Developers
  {
    id: 'junior-frontend',
    name: 'Sophie Martinez',
    role: 'Junior Frontend Developer',
    department: 'Engineering',
    level: 'Junior',
    avatar: '🎨',
    specialties: ['React', 'TypeScript', 'CSS/Tailwind', 'UI/UX Implementation'],
    description: 'Frontend developer creating beautiful and responsive user interfaces',
    themeId: 'frontend-pink',
    metrics: { performance: 78, efficiency: 76, experience: 65, availability: 92 }
  },
  {
    id: 'junior-backend',
    name: 'Ryan O\'Connor',
    role: 'Junior Backend Developer',
    department: 'Engineering',
    level: 'Junior',
    avatar: '🔗',
    specialties: ['Node.js', 'Python', 'Database Design', 'API Development'],
    description: 'Backend developer building robust server-side applications and APIs',
    themeId: 'backend-slate',
    metrics: { performance: 80, efficiency: 78, experience: 68, availability: 90 }
  },

  // Interns
  {
    id: 'data-intern',
    name: 'Maya Singh',
    role: 'Data Science Intern',
    department: 'Data Science',
    level: 'Intern',
    avatar: '📊',
    specialties: ['Python', 'Data Analysis', 'Statistics', 'Visualization'],
    description: 'Data science intern learning advanced analytics and machine learning',
    themeId: 'data-cyan',
    metrics: { performance: 72, efficiency: 70, experience: 45, availability: 95 }
  }
];

export const agentCategories = [
  {
    id: 'c-level',
    name: 'C-Level Executives',
    description: 'Strategic leadership and executive decision making',
    icon: '👔',
    color: '#f59e0b',
    count: agents.filter(a => a.level === 'C-Level').length
  },
  {
    id: 'managers',
    name: 'General Managers',
    description: 'Team leadership and operational management',
    icon: '👨‍💼',
    color: '#8b5cf6',
    count: agents.filter(a => a.level === 'Manager').length
  },
  {
    id: 'senior-developers',
    name: 'Senior Developers',
    description: 'Expert-level development and architecture',
    icon: '🚀',
    color: '#06b6d4',
    count: agents.filter(a => a.level === 'Senior').length
  },
  {
    id: 'junior-developers',
    name: 'Junior Developers',
    description: 'Growing talent and implementation specialists',
    icon: '💻',
    color: '#10b981',
    count: agents.filter(a => a.level === 'Junior').length
  },
  {
    id: 'mathematicians',
    name: 'Mathematicians',
    description: 'Advanced mathematical modeling and analysis',
    icon: '📐',
    color: '#f97316',
    count: 0 // Placeholder for future expansion
  },
  {
    id: 'physicists',
    name: 'Physicists',
    description: 'Quantum computing and theoretical research',
    icon: '⚛️',
    color: '#ef4444',
    count: 0 // Placeholder for future expansion
  }
];