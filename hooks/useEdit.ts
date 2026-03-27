'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  collection
} from 'firebase/firestore'
import { UserProfile, Education, Project, Certificate, SectionContent } from '@/types'

export function useEdit(username: string) {
  const [saving, setSaving] = useState(false)

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    setSaving(true)
    await updateDoc(doc(db, 'portfolios', username), {
      ...data,
      updatedAt: new Date()
    })
    setSaving(false)
  }

  const addEducation = async (data: Omit<Education, 'id'>) => {
    setSaving(true)
    await addDoc(collection(db, 'portfolios', username, 'educations'), data)
    setSaving(false)
  }

  const updateEducation = async (id: string, data: Partial<Education>) => {
    setSaving(true)
    await updateDoc(doc(db, 'portfolios', username, 'educations', id), data)
    setSaving(false)
  }

  const deleteEducation = async (id: string) => {
    setSaving(true)
    await deleteDoc(doc(db, 'portfolios', username, 'educations', id))
    setSaving(false)
  }

  const addProject = async (data: Omit<Project, 'id'>) => {
    setSaving(true)
    await addDoc(collection(db, 'portfolios', username, 'projects'), data)
    setSaving(false)
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    setSaving(true)
    await updateDoc(doc(db, 'portfolios', username, 'projects', id), data)
    setSaving(false)
  }

  const deleteProject = async (id: string) => {
    setSaving(true)
    await deleteDoc(doc(db, 'portfolios', username, 'projects', id))
    setSaving(false)
  }

  const addCertificate = async (data: Omit<Certificate, 'id'>) => {
    setSaving(true)
    await addDoc(collection(db, 'portfolios', username, 'certificates'), data)
    setSaving(false)
  }

  const updateCertificate = async (id: string, data: Partial<Certificate>) => {
    setSaving(true)
    await updateDoc(doc(db, 'portfolios', username, 'certificates', id), data)
    setSaving(false)
  }

  const deleteCertificate = async (id: string) => {
    setSaving(true)
    await deleteDoc(doc(db, 'portfolios', username, 'certificates', id))
    setSaving(false)
  }

  const uploadMedia = async (file: File): Promise<string> => {
    const base64 = await fileToBase64(file)
    return base64
  }

  const updateSection = async (sectionId: string, data: Partial<SectionContent>) => {
    setSaving(true)
    await updateDoc(doc(db, 'portfolios', username, 'sections', sectionId), data)
    setSaving(false)
  }

  return {
    saving,
    updateProfile,
    addEducation,
    updateEducation,
    deleteEducation,
    addProject,
    updateProject,
    deleteProject,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    uploadMedia,
    updateSection
  }
}