'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { 
  doc, 
  getDoc, 
  onSnapshot,
  collection,
  query,
  orderBy
} from 'firebase/firestore'
import { PortfolioData, UserProfile, Education, Project, Certificate, SectionContent } from '@/types'

export function usePortfolio(username: string) {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) return

    const unsubscribe = onSnapshot(
      doc(db, 'portfolios', username),
      async (docSnap) => {
        if (!docSnap.exists()) {
          setError('Portfolio not found')
          setLoading(false)
          return
        }

        const profile = docSnap.data() as UserProfile

        const [educationsSnap, projectsSnap, certificatesSnap, sectionsSnap] = await Promise.all([
          getDocs(query(collection(db, 'portfolios', username, 'educations'), orderBy('order'))),
          getDocs(query(collection(db, 'portfolios', username, 'projects'), orderBy('order'))),
          getDocs(query(collection(db, 'portfolios', username, 'certificates'), orderBy('order'))),
          getDocs(query(collection(db, 'portfolios', username, 'sections'), orderBy('order')))
        ])

        const educations = educationsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Education))
        const projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
        const certificates = certificatesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate))
        const sections = sectionsSnap.docs.map(d => ({ id: d.id, ...d.data() } as SectionContent))

        setData({
          profile,
          educations,
          projects,
          certificates,
          sections
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [username])

  return { data, loading, error }
}

import { getDocs } from 'firebase/firestore'