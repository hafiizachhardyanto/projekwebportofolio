export interface UserProfile {
  uid: string
  username: string
  displayName: string
  email: string
  photoURL: string
  bio: string
  title: string
  location: string
  website: string
  socialLinks: {
    github: string
    linkedin: string
    twitter: string
    instagram: string
  }
  theme: ThemeConfig
  font: string
  createdAt: Date
  updatedAt: Date
}

export interface ThemeConfig {
  id: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textMuted: string
  border: string
  glow: string
  scanline: boolean
  crt: boolean
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
  logo: string
  order: number
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  image: string
  video: string
  githubUrl: string
  liveUrl: string
  startDate: string
  endDate: string
  featured: boolean
  order: number
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  credentialId: string
  credentialUrl: string
  image: string
  order: number
}

export interface SectionContent {
  id: string
  section: 'home' | 'about' | 'education' | 'projects' | 'certificates'
  title: string
  subtitle: string
  description: string
  media: MediaItem[]
  layout: 'grid' | 'list' | 'carousel' | 'fullscreen'
  order: number
}

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail: string
  caption: string
  order: number
}

export interface PortfolioData {
  profile: UserProfile
  educations: Education[]
  projects: Project[]
  certificates: Certificate[]
  sections: SectionContent[]
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  displayName: string
}