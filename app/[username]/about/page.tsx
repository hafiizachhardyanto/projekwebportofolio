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
import { Edit, Plus } from 'lucide-react'

interface AboutSection {
  id: string
  title: string
  content: string
  image?: string
  video?: string
  order: number
}

export default function AboutPage() {
  const params = useParams()
  const username = params.username as string
  const { data } = usePortfolio(username)
  const { user } = useAuth()
  const { updateSection } = useEdit(username)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editSection, setEditSection] = useState<AboutSection | null>(null)
  const [newMediaFile, setNewMediaFile] = useState<File | null>(null)
  const [newMediaBase64, setNewMediaBase64] = useState<string>('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [isCreating, setIsCreating] = useState(false)

  const isOwner = user?.uid === data?.profile.uid

  const aboutSections: AboutSection[] = data?.sections?.filter(s => s.section === 'about').map(s => ({
    id: s.id,
    title: s.title,
    content: s.description,
    image: s.media?.find(m => m.type === 'image')?.url,
    video: s.media?.find(m => m.type === 'video')?.url,
    order: s.order
  })) || []

  const defaultSections: AboutSection[] = [
    {
      id: 'default-1',
      title: 'My Story',
      content: data?.profile.bio || 'No bio available yet.',
      order: 1
    }
  ]

  const displaySections = aboutSections.length > 0 ? aboutSections : defaultSections

  const openEdit = (section: AboutSection) => {
    setEditSection(section)
    setNewMediaFile(null)
    setNewMediaBase64('')
    setMediaType(section.video ? 'video' : 'image')
    setIsCreating(false)
    setEditModalOpen(true)
  }

  const openCreate = () => {
    setEditSection({
      id: '',
      title: '',
      content: '',
      order: displaySections.length + 1
    })
    setNewMediaFile(null)
    setNewMediaBase64('')
    setMediaType('image')
    setIsCreating(true)
    setEditModalOpen(true)
  }

  const handleMediaSelect = (file: File | null, base64: string) => {
    setNewMediaFile(file)
    setNewMediaBase64(base64)
  }

  const handleSave = async () => {
    if (!editSection) return

    const finalMediaUrl = newMediaBase64 || (mediaType === 'video' ? editSection.video : editSection.image) || ''

    const media = []
    if (finalMediaUrl) {
      media.push({
        id: Date.now().toString(),
        type: mediaType,
        url: finalMediaUrl,
        thumbnail: finalMediaUrl,
        caption: '',
        order: 1
      })
    }

    await updateSection(editSection.id, {
      section: 'about',
      title: editSection.title,
      description: editSection.content,
      media,
      order: editSection.order
    })

    setEditModalOpen(false)
    setNewMediaFile(null)
    setNewMediaBase64('')
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <GlitchText text="ABOUT_SYSTEM" size="md" />
            {isOwner && (
              <PixelButton size="sm" onClick={openCreate} className="flex items-center gap-2">
                <Plus size={14} />
                Add Section
              </PixelButton>
            )}
          </div>

          <div className="space-y-6">
            {displaySections.map((section, index) => (
              <PixelCard key={section.id} className="relative">
                {isOwner && (
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => openEdit(section)}
                      className="p-2 bg-[var(--primary)] text-[var(--background)] border-2 border-[var(--background)] hover:scale-110 transition-transform"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}

                <div className={`grid gap-6 ${section.image || section.video ? 'md:grid-cols-2' : ''}`}>
                  <div className={index % 2 === 1 && (section.image || section.video) ? 'md:order-2' : ''}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-pixel text-xs text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 border border-[var(--primary)]">
                        SECTION_0{index + 1}
                      </span>
                    </div>
                    <h2 className="font-pixel text-lg text-[var(--text)] mb-4">
                      {section.title}
                    </h2>
                    <div className="font-cyber text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </div>

                  {(section.image || section.video) && (
                    <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                      {section.video ? (
                        <video 
                          src={section.video}
                          controls
                          className="w-full border-4 border-[var(--border)]"
                        />
                      ) : (
                        <img 
                          src={section.image}
                          alt={section.title}
                          className="w-full border-4 border-[var(--border)]"
                        />
                      )}
                    </div>
                  )}
                </div>
              </PixelCard>
            ))}
          </div>

          <PixelCard className="mt-6">
            <h3 className="font-pixel text-sm text-[var(--primary)] mb-4">SKILLS_MATRIX</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['React', 'TypeScript', 'Node.js', 'Firebase', 'Next.js', 'Tailwind', 'Python', 'AWS'].map((skill) => (
                <div 
                  key={skill}
                  className="flex items-center gap-2 p-3 bg-[var(--background)] border-2 border-[var(--border)]"
                >
                  <span className="w-2 h-2 bg-[var(--primary)]" />
                  <span className="font-cyber text-sm text-[var(--text)]">{skill}</span>
                </div>
              ))}
            </div>
          </PixelCard>
        </motion.div>
      </div>

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={isCreating ? "CREATE_SECTION.exe" : "EDIT_SECTION.exe"}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">TITLE</label>
            <input
              type="text"
              value={editSection?.title || ''}
              onChange={(e) => setEditSection(prev => prev ? {...prev, title: e.target.value} : null)}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">CONTENT</label>
            <textarea
              value={editSection?.content || ''}
              onChange={(e) => setEditSection(prev => prev ? {...prev, content: e.target.value} : null)}
              rows={6}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none resize-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">MEDIA_TYPE</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">MEDIA</label>
            <MediaUpload
              onFileSelect={handleMediaSelect}
              type={mediaType}
              currentUrl={mediaType === 'video' ? editSection?.video : editSection?.image}
            />
          </div>
        </div>
      </EditModal>
    </div>
  )
}