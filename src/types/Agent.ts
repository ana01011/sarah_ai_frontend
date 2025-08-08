export interface Agent {
  id: string;
  name: string;
  role: string;
  department: string;
  level: 'executive' | 'manager' | 'senior' | 'junior' | 'intern';
  description: string;
  avatar: string;
  specialties: string[];
  metrics: Record<string, any>;
  themeId: string;
}

export interface AgentDashboardProps {
  agent: Agent;
  onBack: () => void;
  onOpenChat: () => void;
}

export const agents: Agent[] = [
  // C-Level Executives
  {
    id: 'ceo',
    name: 'Alexander Sterling',
    role: 'Chief Executive Officer',
    department: 'Executive',
    level: 'executive',
    description: 'Strategic leadership and company vision',
    avatar: '👨‍💼',
    specialties: ['Strategic Planning', 'Leadership', 'Vision Setting', 'Board Relations'],
    metrics: {
      companyValuation: '$2.4B',
      revenue: '$847M',
      growth: '+23%',
      employees: '12,847'
    },
    themeId: 'executive-gold'
  },
  {
    id: 'cto',
    name: 'Dr. Sarah Chen',
    role: 'Chief Technology Officer',
    department: 'Technology',
    level: 'executive',
    description: 'Technology strategy and innovation leadership',
    avatar: '👩‍💻',
    specialties: ['AI/ML Strategy', 'System Architecture', 'Innovation', 'Tech Leadership'],
    metrics: {
      systemUptime: '99.98%',
      deployments: '247',
      techDebt: 'Low',
      innovations: '12'
    },
    themeId: 'tech-blue'
  },
  {
    id: 'cfo',
    name: 'Michael Rodriguez',
    role: 'Chief Financial Officer',
    department: 'Finance',
    level: 'executive',
    description: 'Financial strategy and fiscal management',
    avatar: '👨‍💼',
    specialties: ['Financial Planning', 'Risk Management', 'Investment Strategy', 'Compliance'],
    metrics: {
      cashFlow: '+$127M',
      profitMargin: '34.2%',
      roi: '18.7%',
      expenses: '$623M'
    },
    themeId: 'finance-green'
  },
  {
    id: 'cmo',
    name: 'Emma Thompson',
    role: 'Chief Marketing Officer',
    department: 'Marketing',
    level: 'executive',
    description: 'Brand strategy and market expansion',
    avatar: '👩‍🎨',
    specialties: ['Brand Strategy', 'Digital Marketing', 'Customer Acquisition', 'Analytics'],
    metrics: {
      brandValue: '$1.2B',
      cac: '$47',
      ltv: '$2,340',
      campaigns: '23'
    },
    themeId: 'marketing-purple'
  },
  {
    id: 'coo',
    name: 'James Wilson',
    role: 'Chief Operating Officer',
    department: 'Operations',
    level: 'executive',
    description: 'Operational excellence and process optimization',
    avatar: '👨‍🔧',
    specialties: ['Operations Management', 'Process Optimization', 'Supply Chain', 'Quality'],
    metrics: {
      efficiency: '94.7%',
      quality: '99.2%',
      processes: '156',
      automation: '78%'
    },
    themeId: 'operations-orange'
  },
  // Managers
  {
    id: 'eng-manager',
    name: 'David Kim',
    role: 'Engineering Manager',
    department: 'Engineering',
    level: 'manager',
    description: 'Engineering team leadership and delivery',
    avatar: '👨‍💻',
    specialties: ['Team Management', 'Agile', 'Code Quality', 'Delivery'],
    metrics: {
      teamSize: '12',
      velocity: '47',
      bugs: '3',
      satisfaction: '4.8/5'
    },
    themeId: 'tech-blue'
  },
  {
    id: 'product-manager',
    name: 'Lisa Park',
    role: 'Product Manager',
    department: 'Product',
    level: 'manager',
    description: 'Product strategy and roadmap execution',
    avatar: '👩‍💼',
    specialties: ['Product Strategy', 'User Research', 'Roadmapping', 'Analytics'],
    metrics: {
      features: '23',
      userSat: '4.6/5',
      adoption: '87%',
      revenue: '+$12M'
    },
    themeId: 'product-teal'
  },
  // Senior Developers
  {
    id: 'senior-fullstack',
    name: 'Alex Johnson',
    role: 'Senior Full-Stack Developer',
    department: 'Engineering',
    level: 'senior',
    description: 'Full-stack development and architecture',
    avatar: '👨‍💻',
    specialties: ['React', 'Node.js', 'System Design', 'Mentoring'],
    metrics: {
      commits: '1,247',
      prs: '89',
      reviews: '156',
      mentees: '3'
    },
    themeId: 'dev-cyan'
  },
  {
    id: 'senior-ai',
    name: 'Dr. Priya Patel',
    role: 'Senior AI Engineer',
    department: 'AI/ML',
    level: 'senior',
    description: 'AI model development and optimization',
    avatar: '👩‍🔬',
    specialties: ['Deep Learning', 'NLP', 'Computer Vision', 'MLOps'],
    metrics: {
      models: '12',
      accuracy: '94.7%',
      papers: '5',
      patents: '2'
    },
    themeId: 'ai-purple'
  },
  // Junior Developers
  {
    id: 'junior-frontend',
    name: 'Sophie Martinez',
    role: 'Junior Frontend Developer',
    department: 'Engineering',
    level: 'junior',
    description: 'Frontend development and UI implementation',
    avatar: '👩‍💻',
    specialties: ['React', 'CSS', 'JavaScript', 'UI/UX'],
    metrics: {
      components: '47',
      bugs: '2',
      learning: '12 courses',
      mentor: 'Alex Johnson'
    },
    themeId: 'junior-pink'
  },
  {
    id: 'junior-backend',
    name: 'Ryan Cooper',
    role: 'Junior Backend Developer',
    department: 'Engineering',
    level: 'junior',
    description: 'Backend services and API development',
    avatar: '👨‍💻',
    specialties: ['Python', 'APIs', 'Databases', 'Testing'],
    metrics: {
      apis: '8',
      tests: '234',
      uptime: '99.5%',
      mentor: 'David Kim'
    },
    themeId: 'junior-blue'
  },
  // Interns
  {
    id: 'intern-data',
    name: 'Maya Singh',
    role: 'Data Science Intern',
    department: 'Data Science',
    level: 'intern',
    description: 'Data analysis and machine learning projects',
    avatar: '👩‍🎓',
    specialties: ['Python', 'Data Analysis', 'Visualization', 'Statistics'],
    metrics: {
      projects: '3',
      insights: '12',
      presentations: '2',
      supervisor: 'Dr. Priya Patel'
    },
    themeId: 'intern-green'
  }
];