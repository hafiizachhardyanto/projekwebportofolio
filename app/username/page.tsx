'use client'

import { useParams } from 'next/navigation'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { GlitchText } from '@/components/ui/GlitchText'
import { PixelCard } from '@/components/ui/PixelCard'
import { PixelButton } from '@/components/ui/PixelButton'
import { EditModal } from '@/components/ui/EditModal'
import { MediaUpload } from '@/components/ui/MediaUpload'
import { useEdit } from '@/hooks/useEdit'
import { useState } from 'react'
import { Globe, MapPin, Pencil, Plus, Link2, Code2 } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const params = useParams()
  const username = params.username as string
  const { data } = usePortfolio(username)
  const { user } = useAuth()
  const { updateProfile, uploadMedia, saving } = useEdit(username)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editData, setEditData] = useState({
    displayName: '',
    title: '',
    bio: '',
    location: '',
    website: '',
    photoURL: ''
  })
  const [newPhoto, setNewPhoto] = useState<File | null>(null)

  const isOwner = user?.uid === data?.profile.uid

  const openEdit = () => {
    if (!data) return
    setEditData({
      displayName: data.profile.displayName || '',
      title: data.profile.title || '',
      bio: data.profile.bio || '',
      location: data.profile.location || '',
      website: data.profile.website || '',
      photoURL: data.profile.photoURL || ''
    })
    setNewPhoto(null)
    setEditModalOpen(true)
  }

  const handleSave = async () => {
    let photoURL = editData.photoURL
    if (newPhoto) {
      photoURL = await uploadMedia(newPhoto)
    }
    await updateProfile({
      ...editData,
      photoURL
    })
    setEditModalOpen(false)
  }

  if (!data) return null

  const { profile } = data

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-1">
            <PixelCard className="sticky top-28">
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-6 border-4 border-[var(--primary)] overflow-hidden bg-[var(--background)]">
                  {profile.photoURL ? (
                    <img 
                      src={profile.photoURL} 
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--surface)]">
                      <span className="font-pixel text-4xl text-[var(--primary)]">
                        {profile.displayName?.charAt(0) || username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {isOwner && (
                  <button
                    onClick={openEdit}
                    className="absolute top-0 right-0 p-2 bg-[var(--primary)] text-[var(--background)] border-2 border-[var(--background)] hover:scale-110 transition-transform"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </div>

              <div className="text-center mb-6">
                <h1 className="font-pixel text-lg text-[var(--text)] mb-2">
                  {profile.displayName || username}
                </h1>
                <p className="font-cyber text-[var(--primary)]">
                  {profile.title || 'Digital Creator'}
                </p>
              </div>

              {profile.bio && (
                <p className="font-cyber text-sm text-[var(--text-muted)] text-center mb-6 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              <div className="space-y-3 mb-6">
                {profile.location && (
                  <div className="flex items-center gap-3 text-[var(--text-muted)] font-cyber text-sm">
                    <MapPin size={16} className="text-[var(--primary)]" />
                    {profile.location}
                  </div>
                )}
                {profile.website && (
                  <a 
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[var(--primary)] font-cyber text-sm hover:underline"
                  >
                    <Globe size={16} />
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>

              <div className="flex justify-center gap-3">
                {profile.socialLinks?.github && (
                  <a 
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border-2 border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                  >
                    <Code2 size={20} />
                  </a>
                )}
                {profile.socialLinks?.linkedin && (
                  <a 
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border-2 border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                  >
                    <Link2 size={20} />
                  </a>
                )}
              </div>
            </PixelCard>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <PixelCard>
              <div className="flex items-center justify-between mb-6">
                <GlitchText text="SYSTEM_OVERVIEW" size="sm" />
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <span className="w-2 h-2 bg-[var(--primary)] animate-pulse" />
                  <span className="font-pixel text-xs">ONLINE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-[var(--background)] border-2 border-[var(--border)]">
                  <div className="font-pixel text-2xl text-[var(--primary)] mb-1">
                    {data.projects.length}
                  </div>
                  <div className="font-pixel text-xs text-[var(--text-muted)]">PROJECTS</div>
                </div>
                <div className="text-center p-4 bg-[var(--background)] border-2 border-[var(--border)]">
                  <div className="font-pixel text-2xl text-[var(--primary)] mb-1">
                    {data.educations.length}
                  </div>
                  <div className="font-pixel text-xs text-[var(--text-muted)]">EDUCATION</div>
                </div>
                <div className="text-center p-4 bg-[var(--background)] border-2 border-[var(--border)]">
                  <div className="font-pixel text-2xl text-[var(--primary)] mb-1">
                    {data.certificates.length}
                  </div>
                  <div className="font-pixel text-xs text-[var(--text-muted)]">CERTIFICATES</div>
                </div>
                <div className="text-center p-4 bg-[var(--background)] border-2 border-[var(--border)]">
                  <div className="font-pixel text-2xl text-[var(--primary)] mb-1">
                    {new Date().getFullYear() - 2020}+
                  </div>
                  <div className="font-pixel text-xs text-[var(--text-muted)]">YEARS_EXP</div>
                </div>
              </div>

              <div className="space-y-4">
                <Link href={`/${username}/projects`}>
                  <PixelButton variant="secondary" className="w-full flex items-center justify-between group">
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
                        01
                      </span>
                      View Projects
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </PixelButton>
                </Link>
                
                <Link href={`/${username}/education`}>
                  <PixelButton variant="secondary" className="w-full flex items-center justify-between group">
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
                        02
                      </span>
                      Education History
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </PixelButton>
                </Link>
                
                <Link href={`/${username}/certificates`}>
                  <PixelButton variant="secondary" className="w-full flex items-center justify-between group">
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
                        03
                      </span>
                      Certificates
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </PixelButton>
                </Link>
              </div>
            </PixelCard>

            {data.projects.filter(p => p.featured).length > 0 && (
              <PixelCard>
                <GlitchText text="FEATURED_PROJECTS" size="sm" className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects
                    .filter(p => p.featured)
                    .slice(0, 2)
                    .map((project, i) => (
                      <Link 
                        key={project.id} 
                        href={`/${username}/projects`}
                        className="group"
                      >
                        <div className="border-4 border-[var(--border)] overflow-hidden hover:border-[var(--primary)] transition-colors">
                          {project.image ? (
                            <img 
                              src={project.image} 
                              alt={project.title}
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-32 bg-[var(--background)] flex items-center justify-center">
                              <span className="font-pixel text-[var(--primary)]">PRJ_{i + 1}</span>
                            </div>
                          )}
                          <div className="p-4 bg-[var(--surface)]">
                            <h3 className="font-pixel text-xs text-[var(--text)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                              {project.title}
                            </h3>
                            <p className="font-cyber text-xs text-[var(--text-muted)] line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </PixelCard>
            )}
          </div>
        </motion.div>
      </div>

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="EDIT_PROFILE.exe"
        onSave={handleSave}
        saving={saving}
      >
        <div className="space-y-4">
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">DISPLAY_NAME</label>
            <input
              type="text"
              value={editData.displayName}
              onChange={(e) => setEditData({...editData, displayName: e.target.value})}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">TITLE</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">BIO</label>
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({...editData, bio: e.target.value})}
              rows={3}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none resize-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">LOCATION</label>
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData({...editData, location: e.target.value})}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">WEBSITE</label>
            <input
              type="text"
              value={editData.website}
              onChange={(e) => setEditData({...editData, website: e.target.value})}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">PROFILE_PHOTO</label>
            <MediaUpload
              onUpload={setNewPhoto}
              type="image"
              currentUrl={editData.photoURL}
            />
          </div>
        </div>
      </EditModal>
    </div>
  )
}