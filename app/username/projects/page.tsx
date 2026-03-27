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
import { Edit, Plus, Trash, ExternalLink, Github, Star, Calendar, Code } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Project } from '@/types'

interface ProjectForm {
  id?: string
  title: string
  description: string
  technologies: string
  image: string
  video: string
  githubUrl: string
  liveUrl: string
  startDate: string
  endDate: string
  featured: boolean
}

export default function ProjectsPage() {
  const params = useParams()
  const username = params.username as string
  const { data } = usePortfolio(username)
  const { user } = useAuth()
  const { addProject, updateProject, deleteProject, uploadMedia } = useEdit(username)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    description: '',
    technologies: '',
    image: '',
    video: '',
    githubUrl: '',
    liveUrl: '',
    startDate: '',
    endDate: '',
    featured: false
  })
  const [newMedia, setNewMedia] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [isEditing, setIsEditing] = useState(false)

  const isOwner = user?.uid === data?.profile.uid

  const openCreate = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      image: '',
      video: '',
      githubUrl: '',
      liveUrl: '',
      startDate: '',
      endDate: '',
      featured: false
    })
    setNewMedia(null)
    setMediaType('image')
    setIsEditing(false)
    setModalOpen(true)
  }

  const openEdit = (project: Project) => {
    setFormData({
      id: project.id,
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(', ') || '',
      image: project.image || '',
      video: project.video || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      startDate: project.startDate,
      endDate: project.endDate,
      featured: project.featured
    })
    setMediaType(project.video ? 'video' : 'image')
    setNewMedia(null)
    setIsEditing(true)
    setModalOpen(true)
  }

  const handleSave = async () => {
    let mediaUrl = ''
    if (newMedia) {
      mediaUrl = await uploadMedia(newMedia)
    }

    const dataToSave: Omit<Project, 'id'> = {
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      image: mediaType === 'image' ? mediaUrl : formData.image,
      video: mediaType === 'video' ? mediaUrl : formData.video,
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      startDate: formData.startDate,
      endDate: formData.endDate,
      featured: formData.featured,
      order: data?.projects.length || 0
    }

    if (isEditing && formData.id) {
      await updateProject(formData.id, dataToSave)
    } else {
      await addProject(dataToSave)
    }

    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project?')) {
      await deleteProject(id)
    }
  }

  const projects = data?.projects || []

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <GlitchText text="PROJECT_ARCHIVE" size="md" />
            {isOwner && (
              <PixelButton size="sm" onClick={openCreate} className="flex items-center gap-2">
                <Plus size={14} />
                New Project
              </PixelButton>
            )}
          </div>

          {projects.filter(p => p.featured).length > 0 && (
            <div className="mb-8">
              <h3 className="font-pixel text-xs text-[var(--primary)] mb-4 flex items-center gap-2">
                <Star size={14} />
                FEATURED_PROJECTS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.filter(p => p.featured).map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    isOwner={isOwner}
                    onEdit={() => openEdit(project)}
                    onDelete={() => handleDelete(project.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-pixel text-xs text-[var(--text-muted)] mb-4 flex items-center gap-2">
              <Code size={14} />
              ALL_PROJECTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => !p.featured).map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  isOwner={isOwner}
                  onEdit={() => openEdit(project)}
                  onDelete={() => handleDelete(project.id)}
                />
              ))}
            </div>
          </div>

          {projects.length === 0 && (
            <PixelCard className="text-center py-16">
              <Code size={64} className="mx-auto mb-4 text-[var(--text-muted)]" />
              <p className="font-pixel text-sm text-[var(--text-muted)]">
                No projects in archive
              </p>
            </PixelCard>
          )}
        </motion.div>
      </div>

      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "EDIT_PROJECT.exe" : "NEW_PROJECT.exe"}
        onSave={handleSave}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">PROJECT_TITLE</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
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
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">TECHNOLOGIES (comma separated)</label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({...formData, technologies: e.target.value})}
              placeholder="React, TypeScript, Node.js"
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="w-4 h-4 accent-[var(--primary)]"
              />
              <label htmlFor="featured" className="font-pixel text-xs text-[var(--text)]">
                FEATURED PROJECT
              </label>
            </div>
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">
              {mediaType === 'video' ? 'PROJECT_VIDEO' : 'PROJECT_IMAGE'}
            </label>
            <MediaUpload
              onUpload={setNewMedia}
              type={mediaType}
              currentUrl={mediaType === 'video' ? formData.video : formData.image}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-xs text-[var(--primary)] block mb-2">GITHUB_URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-xs text-[var(--primary)] block mb-2">LIVE_URL</label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-xs text-[var(--primary)] block mb-2">START_DATE</label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-xs text-[var(--primary)] block mb-2">END_DATE</label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </EditModal>
    </div>
  )
}

function ProjectCard({ 
  project, 
  isOwner, 
  onEdit, 
  onDelete 
}: { 
  project: Project
  isOwner: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <PixelCard className="relative group h-full flex flex-col">
      {isOwner && (
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 bg-[var(--primary)] text-[var(--background)] border-2 border-[var(--background)] hover:scale-110 transition-transform"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-[var(--accent)] text-white border-2 border-[var(--background)] hover:scale-110 transition-transform"
          >
            <Trash size={14} />
          </button>
        </div>
      )}

      {project.featured && (
        <div className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 bg-[var(--primary)] text-[var(--background)] font-pixel text-xs z-10">
          <Star size={12} fill="currentColor" />
          FEATURED
        </div>
      )}

      <div className="relative overflow-hidden border-b-4 border-[var(--border)] -mx-6 -mt-6 mb-4">
        {project.video ? (
          <video 
            src={project.video}
            className="w-full h-48 object-cover"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => e.currentTarget.pause()}
          />
        ) : project.image ? (
          <img 
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-[var(--background)] flex items-center justify-center">
            <Code size={48} className="text-[var(--border)]" />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2 text-[var(--text-muted)] font-cyber text-xs">
          <Calendar size={12} />
          {formatDate(project.startDate)}
          {project.endDate && ` - ${formatDate(project.endDate)}`}
        </div>

        <h3 className="font-pixel text-sm text-[var(--text)] mb-2 group-hover:text-[var(--primary)] transition-colors">
          {project.title}
        </h3>
        
        <p className="font-cyber text-sm text-[var(--text-muted)] mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech: string) => (
              <span 
                key={tech}
                className="px-2 py-1 bg-[var(--primary)]/10 border border-[var(--primary)]/30 font-pixel text-xs text-[var(--primary)]"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 bg-[var(--border)] font-pixel text-xs text-[var(--text-muted)]">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t-2 border-[var(--border)]">
          {project.githubUrl && (
            <a 
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors font-cyber text-sm"
            >
              <Github size={16} />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a 
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors font-cyber text-sm ml-auto"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </PixelCard>
  )
}