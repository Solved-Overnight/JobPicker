import { JobSearchParams, Job } from '../types';

// List of mock companies with job titles
const companies = [
  { name: 'TechVision Inc.', domain: 'software' },
  { name: 'DataMind', domain: 'data' },
  { name: 'Cloud Systems', domain: 'cloud' },
  { name: 'AI Innovations', domain: 'ai' },
  { name: 'Digital Frontier', domain: 'frontend' },
  { name: 'RapidGrowth Startup', domain: 'startup' },
  { name: 'Enterprise Solutions', domain: 'enterprise' },
  { name: 'Creative Tech', domain: 'creative' },
  { name: 'SecurityFirst', domain: 'security' },
  { name: 'MobileMasters', domain: 'mobile' },
];

// Job titles for different domains
const jobTitles: Record<string, string[]> = {
  software: [
    'Software Engineer', 'Senior Developer', 'Full-Stack Engineer',
    'Backend Developer', 'DevOps Engineer', 'Software Architect'
  ],
  data: [
    'Data Scientist', 'Data Engineer', 'Data Analyst',
    'Business Intelligence Developer', 'Database Administrator'
  ],
  cloud: [
    'Cloud Engineer', 'AWS Specialist', 'Cloud Architect',
    'Azure Developer', 'Cloud Operations Engineer'
  ],
  ai: [
    'AI Engineer', 'Machine Learning Engineer', 'NLP Specialist',
    'Computer Vision Engineer', 'AI Research Scientist'
  ],
  frontend: [
    'Frontend Developer', 'UI Engineer', 'React Developer',
    'Angular Engineer', 'Web Developer'
  ],
  startup: [
    'Full-Stack Developer', 'Growth Engineer', 'Product Developer',
    'Technical Co-Founder', 'Startup Engineer'
  ],
  enterprise: [
    'Enterprise Architect', 'Solutions Engineer', 'Integration Specialist',
    'Systems Analyst', 'IT Consultant'
  ],
  creative: [
    'UI/UX Engineer', 'Creative Technologist', 'Interactive Developer',
    'Digital Experience Engineer', 'Product Designer'
  ],
  security: [
    'Security Engineer', 'Cybersecurity Specialist', 'Security Analyst',
    'Penetration Tester', 'Security Consultant'
  ],
  mobile: [
    'Mobile Developer', 'iOS Engineer', 'Android Developer',
    'React Native Engineer', 'Mobile App Architect'
  ],
};

// Locations
const locations = [
  'New York, NY', 'San Francisco, CA', 'Seattle, WA', 'Austin, TX',
  'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO',
  'Atlanta, GA', 'Remote', 'Washington, DC', 'Portland, OR'
];

// Salary ranges
const salaryRanges = [
  '$100,000 - $130,000', '$80,000 - $100,000', '$120,000 - $150,000',
  '$90,000 - $115,000', '$140,000 - $180,000', '$75,000 - $95,000',
  '$130,000 - $160,000', 'Competitive Salary'
];

// Posted dates
const postedDates = [
  'Today', 'Yesterday', '2 days ago', '3 days ago', 'Last week',
  '1 week ago', '2 weeks ago', '3 weeks ago', 'Last month'
];

// Skills per domain
const skills: Record<string, string[]> = {
  software: ['JavaScript', 'Python', 'Java', 'Go', 'Node.js', 'Docker', 'Kubernetes', 'REST API', 'Git'],
  data: ['SQL', 'Python', 'R', 'Hadoop', 'Spark', 'Tableau', 'Power BI', 'ETL', 'Statistics'],
  cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CloudFormation', 'Serverless'],
  ai: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'ML Ops', 'Neural Networks'],
  frontend: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Redux', 'Webpack', 'UI/UX', 'SASS'],
  startup: ['Full-Stack', 'React', 'Node.js', 'Agile', 'DevOps', 'Product Design', 'Rapid Prototyping'],
  enterprise: ['Java', 'Spring', '.NET', 'Oracle', 'SAP', 'Enterprise Architecture', 'SOAP/REST'],
  creative: ['JavaScript', 'Three.js', 'WebGL', 'CSS Animation', 'UX Design', 'Creative Coding', 'SVG'],
  security: ['Network Security', 'OWASP', 'Ethical Hacking', 'Encryption', 'Vulnerability Assessment'],
  mobile: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Mobile UI', 'iOS', 'Android', 'App Store'],
};

// Job description templates
const descriptionTemplates = [
  'We are looking for a talented %TITLE% to join our team. You will be responsible for developing %DOMAIN% solutions and working closely with our cross-functional teams. The ideal candidate has strong %SKILLS% skills and enjoys solving complex problems in a fast-paced environment.',
  'Join our innovative team as a %TITLE%. In this role, you will design and build %DOMAIN% systems, collaborate with product managers, and create high-quality solutions. We value expertise in %SKILLS% and a commitment to excellence.',
  'Exciting opportunity for a %TITLE% to make an impact at our growing company. You will lead development efforts, architect scalable %DOMAIN% solutions, and mentor junior team members. Strong background in %SKILLS% required.',
  'As a %TITLE%, you will be at the forefront of our %DOMAIN% initiatives. Your responsibilities include developing robust solutions, optimizing performance, and staying current with industry trends. Must have experience with %SKILLS%.',
  'We\'re seeking an experienced %TITLE% to help build our next-generation %DOMAIN% platform. You\'ll work in an agile environment, contribute to technical decisions, and implement best practices. Proficiency in %SKILLS% is essential.'
];

// Generate a random job description
function generateJobDescription(title: string, domain: string, jobSkills: string[]): string {
  const template = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)];
  let description = template.replace(/%TITLE%/g, title)
    .replace(/%DOMAIN%/g, domain)
    .replace(/%SKILLS%/g, jobSkills.slice(0, 3).join(', '));
  
  // Add some more detailed paragraphs
  description += '\n\nResponsibilities:\n';
  description += '• Design, develop, and maintain high-quality code\n';
  description += '• Collaborate with cross-functional teams to define and implement new features\n';
  description += '• Ensure the performance, quality, and responsiveness of applications\n';
  description += '• Identify and correct bottlenecks and fix bugs\n';
  description += '• Help maintain code quality, organization, and automatization\n';
  
  description += '\n\nQualifications:\n';
  description += '• Proven experience as a ' + title + ' or similar role\n';
  description += '• Proficiency in ' + jobSkills.join(', ') + '\n';
  description += '• Experience with software development methodologies\n';
  description += '• Excellent problem-solving and communication skills\n';
  description += '• BS/MS degree in Computer Science or related field (or equivalent experience)\n';
  
  return description;
}

// Generate mock jobs based on search params
export function generateMockJobs(searchParams: JobSearchParams, count: number): Job[] {
  const mockJobs: Job[] = [];
  const enabledPlatforms = searchParams.platforms.filter(p => p.enabled);
  
  if (enabledPlatforms.length === 0) return [];
  
  // Find domain that most closely matches the search role
  let matchingDomain = 'software'; // default
  const searchTermLower = searchParams.role.toLowerCase();
  
  Object.entries(jobTitles).forEach(([domain, titles]) => {
    if (titles.some(title => title.toLowerCase().includes(searchTermLower)) || 
        domain.includes(searchTermLower)) {
      matchingDomain = domain;
    }
  });
  
  // Get relevant job titles for the domain
  const relevantTitles = jobTitles[matchingDomain].filter(title => 
    title.toLowerCase().includes(searchTermLower) || searchTermLower.includes(title.toLowerCase())
  );
  
  // If no relevant titles found, use the search term as the title
  const availableTitles = relevantTitles.length > 0 ? relevantTitles : [searchParams.role];
  
  // Get domain-specific skills
  const domainSkills = skills[matchingDomain] || skills.software;
  
  for (let i = 0; i < count; i++) {
    // Select random company, but prefer companies in matching domain
    const company = companies.find(c => c.domain === matchingDomain) || 
                    companies[Math.floor(Math.random() * companies.length)];
    
    // Select random job title from relevant titles
    const title = availableTitles[Math.floor(Math.random() * availableTitles.length)];
    
    // Location - either use provided location or random one
    const location = searchParams.location || locations[Math.floor(Math.random() * locations.length)];
    
    // Select random platform from enabled platforms
    const platform = enabledPlatforms[Math.floor(Math.random() * enabledPlatforms.length)].name;
    
    // Generate random skills (3-5)
    const shuffledSkills = [...domainSkills].sort(() => 0.5 - Math.random());
    const jobSkills = shuffledSkills.slice(0, 3 + Math.floor(Math.random() * 3));
    
    mockJobs.push({
      id: `job-${i}-${Date.now()}`,
      title,
      company: company.name,
      location,
      description: generateJobDescription(title, matchingDomain, jobSkills),
      salary: Math.random() > 0.3 ? salaryRanges[Math.floor(Math.random() * salaryRanges.length)] : undefined,
      postedDate: postedDates[Math.floor(Math.random() * postedDates.length)],
      platform,
      applyUrl: `https://example.com/jobs/${i}`,
      skills: jobSkills,
      saved: Math.random() > 0.8, // 20% chance of being saved
      applied: Math.random() > 0.9 // 10% chance of being applied to
    });
  }
  
  return mockJobs;
}