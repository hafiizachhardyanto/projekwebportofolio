import { db } from './firebase'
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { UserProfile, Education, Project, Certificate, SectionContent, ThemeConfig } from '@/types'

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const portfolioSnap = await getDoc(doc(db, 'portfolios', username))
  return !portfolioSnap.exists()
}

export async function createPortfolio(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>) {
  const portfolioRef = doc(db, 'portfolios', profile.username)
  
  const defaultTheme: ThemeConfig = {
    id: 'green',
    primary: '#00ff41',
    secondary: '#008f11',
    accent: '#ff0080',
    background: '#0a0a0f',
    surface: '#0f172a',
    text: '#ffffff',
    textMuted: '#94a3b8',
    border: '#1e293b',
    glow: 'rgba(0, 255, 65, 0.5)',
    scanline: true,
    crt: true
  }
  
  await setDoc(portfolioRef, {
    ...profile,
    theme: defaultTheme,
    font: 'cyber',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })

  const sections = ['home', 'about', 'education', 'projects', 'certificates']
  for (const section of sections) {
    await addDoc(collection(db, 'portfolios', profile.username, 'sections'), {
      section,
      title: section.toUpperCase(),
      description: '',
      media: [],
      layout: 'grid',
      order: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  return portfolioRef.id
}

export async function getPortfolio(username: string) {
  const portfolioSnap = await getDoc(doc(db, 'portfolios', username))
  if (!portfolioSnap.exists()) return null
  
  const profile = portfolioSnap.data() as UserProfile

  const [educationsSnap, projectsSnap, certificatesSnap, sectionsSnap] = await Promise.all([
    getDocs(query(collection(db, 'portfolios', username, 'educations'), orderBy('order'))),
    getDocs(query(collection(db, 'portfolios', username, 'projects'), orderBy('order'))),
    getDocs(query(collection(db, 'portfolios', username, 'certificates'), orderBy('order'))),
    getDocs(query(collection(db, 'portfolios', username, 'sections'), orderBy('order')))
  ])

  return {
    profile,
    educations: educationsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Education)),
    projects: projectsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project)),
    certificates: certificatesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate)),
    sections: sectionsSnap.docs.map(d => ({ id: d.id, ...d.data() } as SectionContent))
  }
}

export async function updatePortfolio(username: string, data: Partial<UserProfile>) {
  const portfolioRef = doc(db, 'portfolios', username)
  await updateDoc(portfolioRef, {
    ...data,
    updatedAt: serverTimestamp()
  })
}

export async function addEducation(username: string, education: Omit<Education, 'id'>) {
  const educationsRef = collection(db, 'portfolios', username, 'educations')
  return addDoc(educationsRef, {
    ...education,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export async function updateEducation(username: string, id: string, data: Partial<Education>) {
  const educationRef = doc(db, 'portfolios', username, 'educations', id)
  await updateDoc(educationRef, {
    ...data,
    updatedAt: serverTimestamp()
  })
}

export async function deleteEducation(username: string, id: string) {
  await deleteDoc(doc(db, 'portfolios', username, 'educations', id))
}

export async function addProject(username: string, project: Omit<Project, 'id'>) {
  const projectsRef = collection(db, 'portfolios', username, 'projects')
  return addDoc(projectsRef, {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export async function updateProject(username: string, id: string, data: Partial<Project>) {
  const projectRef = doc(db, 'portfolios', username, 'projects', id)
  await updateDoc(projectRef, {
    ...data,
    updatedAt: serverTimestamp()
  })
}

export async function deleteProject(username: string, id: string) {
  await deleteDoc(doc(db, 'portfolios', username, 'projects', id))
}

export async function addCertificate(username: string, certificate: Omit<Certificate, 'id'>) {
  const certificatesRef = collection(db, 'portfolios', username, 'certificates')
  return addDoc(certificatesRef, {
    ...certificate,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

export async function updateCertificate(username: string, id: string, data: Partial<Certificate>) {
  const certificateRef = doc(db, 'portfolios', username, 'certificates', id)
  await updateDoc(certificateRef, {
    ...data,
    updatedAt: serverTimestamp()
  })
}

export async function deleteCertificate(username: string, id: string) {
  await deleteDoc(doc(db, 'portfolios', username, 'certificates', id))
}

export async function updateSection(username: string, id: string, data: Partial<SectionContent>) {
  const sectionRef = doc(db, 'portfolios', username, 'sections', id)
  await updateDoc(sectionRef, {
    ...data,
    updatedAt: serverTimestamp()
  })
}