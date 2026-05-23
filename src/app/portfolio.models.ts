export interface Metric {
  label: string;
  value: string;
  note: string;
}

export interface LinkSet {
  live?: string;
  repo?: string;
  caseStudy?: string;
}

export interface Project {
  slug: string;
  title: string;
  role: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string;
  metrics: Metric[];
  stack: string[];
  featured: boolean;
  links: LinkSet;
}

export interface SkillGroup {
  name: string;
  signal: string;
  tools: string[];
}

export interface Experience {
  company: string;
  location: string;
  role: string;
  period: string;
  highlights: string[];
}

export interface Service {
  title: string;
  tagline: string;
  description: string;
  approach: string;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  summary: string;
}

export interface PortfolioContent {
  profile: Profile;
  metrics: Metric[];
  projects: Project[];
  skills: SkillGroup[];
  experiences: Experience[];
  services?: Service[];
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
  consent: boolean;
  website?: string;
}

export interface EnquiryResponse {
  enquiryId: string;
  message: string;
}
