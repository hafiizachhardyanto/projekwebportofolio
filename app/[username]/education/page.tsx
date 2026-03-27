'use client'

import { useParams } from 'next/navigation'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useAuth } from '@/hooks/useAuth'
import { useEdit } from '@/hooks/useEdit'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlitchText } from '@/components/ui/GlitchText'
import { PixelCard } from '@/components/ui/PixelCard'
import { PixelButton } from '@/components/ui/PixelButton'
import { EditModal } from '@/components/ui/EditModal'
import { MediaUpload } from '@/components/ui/MediaUpload'
import { Edit, Plus, Trash, GraduationCap, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface EducationForm {
  id?: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
  logo: string
}

export default function EducationPage() {
  const params = useParams()
  const username = params.username as string
  const { data } = usePortfolio(username)
  const { user } = useAuth()
  const { addEducation, updateEducation, deleteEducation, uploadMedia } = useEdit(username)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<EducationForm>({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
    logo: ''
  })
  const [newLogo, setNewLogo] = useState<File | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const isOwner = user?.uid === data?.profile.uid

  const openCreate = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
      logo: ''
    })
    setNewLogo(null)
    setIsEditing(false)
    setModalOpen(true)
  }

  const openEdit = (edu: any) => {
    setFormData({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description,
      logo: edu.logo
    })
    setNewLogo(null)
    setIsEditing(true)
    setModalOpen(true)
  }

  const handleSave = async () => {
    let logoUrl = formData.logo
    if (newLogo) {
      logoUrl = await uploadMedia(newLogo)
    }

    const dataToSave = {
      institution: formData.institution,
      degree: formData.degree,
      field: formData.field,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      logo: logoUrl,
      order: data?.educations.length || 0
    }

    if (isEditing && formData.id) {
      await updateEducation(formData.id, dataToSave)
    } else {
      await addEducation(dataToSave)
    }

    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this education entry?')) {
      await deleteEducation(id)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <GlitchText text="EDUCATION_LOG" size="md" />
            {isOwner && (
              <PixelButton size="sm" onClick={openCreate} className="flex items-center gap-2">
                <Plus size={14} />
                Add Education
              </PixelButton>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-[var(--border)] hidden md:block" />
            
            <div className="space-y-6">
              {(data?.educations || []).map((edu, index) => (
                <PixelCard key={edu.id} className="relative md:ml-16">
                  <div className="hidden md:flex absolute -left-12 top-6 w-6 h-6 bg-[var(--primary)] border-4 border-[var(--background)] items-center justify-center">
                    <div className="w-2 h-2 bg-[var(--background)]" />
                  </div>

                  {isOwner && (
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button
                        onClick={() => openEdit(edu)}
                        className="p-2 bg-[var(--primary)] text-[var(--background)] border-2 border-[var(--background)] hover:scale-110 transition-transform"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
                        className="p-2 bg-[var(--accent)] text-white border-2 border-[var(--background)] hover:scale-110 transition-transform"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {edu.logo ? (
                      <img 
                        src={edu.logo} 
                        alt={edu.institution}
                        className="w-16 h-16 border-4 border-[var(--border)] object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[var(--primary)]/20 border-4 border-[var(--primary)] flex items-center justify-center shrink-0">
                        <GraduationCap size={24} className="text-[var(--primary)]" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-pixel text-xs text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex items-center gap-2 text-[var(--text-muted)] font-cyber text-sm">
                          <Calendar size={14} />
                          {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                        </div>
                      </div>
                      
                      <h3 className="font-pixel text-base text-[var(--text)] mb-1">
                        {edu.degree}
                      </h3>
                      <p className="font-cyber text-[var(--primary)] mb-2">
                        {edu.field}
                      </p>
                      <p className="font-cyber text-lg text-[var(--text-muted)] mb-3">
                        {edu.institution}
                      </p>
                      
                      {edu.description && (
                        <p className="font-cyber text-sm text-[var(--text-muted)] leading-relaxed border-t-2 border-[var(--border)] pt-3">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                </PixelCard>
              ))}

              {(!data?.educations || data.educations.length === 0) && (
                <PixelCard className="text-center py-12">
                  <GraduationCap size={48} className="mx-auto mb-4 text-[var(--text-muted)]" />
                  <p className="font-pixel text-sm text-[var(--text-muted)]">
                    No education records found
                  </p>
                </PixelCard>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "EDIT_EDUCATION.exe" : "ADD_EDUCATION.exe"}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">INSTITUTION</label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-xs text-[var(--primary)] block mb-2">DEGREE</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({...formData, degree: e.target.value})}
                className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-xs text-[var(--primary)] block mb-2">FIELD</label>
              <input
                type="text"
                value={formData.field}
                onChange={(e) => setFormData({...formData, field: e.target.value})}
                className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-xs text-[var(--primary)] block mb-2">START DATE</label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-xs text-[var(--primary)] block mb-2">END DATE</label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none resize-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">INSTITUTION LOGO</label>
            <MediaUpload
              onUpload={setNewLogo}
              type="image"
              currentUrl={formData.logo}
            />
          </div>
        </div>
      </EditModal>
    </div>
  )
}