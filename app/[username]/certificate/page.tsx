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
import { Edit, Plus, Trash, Award, ExternalLink, Calendar, Hash } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface CertificateForm {
  id?: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  credentialId: string
  credentialUrl: string
  image: string
}

export default function CertificatesPage() {
  const params = useParams()
  const username = params.username as string
  const { data } = usePortfolio(username)
  const { user } = useAuth()
  const { addCertificate, updateCertificate, deleteCertificate, uploadMedia } = useEdit(username)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCert, setSelectedCert] = useState<any>(null)
  const [formData, setFormData] = useState<CertificateForm>({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    image: ''
  })
  const [newImage, setNewImage] = useState<File | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>('')

  const isOwner = user?.uid === data?.profile.uid

  const openCreate = () => {
    setFormData({
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      image: ''
    })
    setNewImage(null)
    setImageUrl('')
    setIsEditing(false)
    setModalOpen(true)
  }

  const openEdit = (cert: any) => {
    setFormData({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      credentialId: cert.credentialId,
      credentialUrl: cert.credentialUrl,
      image: cert.image
    })
    setNewImage(null)
    setImageUrl(cert.image || '')
    setIsEditing(true)
    setModalOpen(true)
  }

  const openPreview = (cert: any) => {
    setSelectedCert(cert)
  }

  const handleSave = async () => {
    let finalImageUrl = imageUrl || formData.image
    if (newImage) {
      finalImageUrl = await uploadMedia(newImage)
    }

    const dataToSave = {
      name: formData.name,
      issuer: formData.issuer,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      credentialId: formData.credentialId,
      credentialUrl: formData.credentialUrl,
      image: finalImageUrl,
      order: data?.certificates.length || 0
    }

    if (isEditing && formData.id) {
      await updateCertificate(formData.id, dataToSave)
    } else {
      await addCertificate(dataToSave)
    }

    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this certificate?')) {
      await deleteCertificate(id)
    }
  }

  const handleImageUpload = (url: string) => {
    setImageUrl(url)
    setNewImage(null)
  }

  const certificates = data?.certificates || []

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <GlitchText text="CERTIFICATE_VAULT" size="md" />
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/10 border border-[var(--primary)]">
                <Award size={14} className="text-[var(--primary)]" />
                <span className="font-pixel text-xs text-[var(--primary)]">
                  {certificates.length} CERTIFIED
                </span>
              </div>
            </div>
            {isOwner && (
              <PixelButton size="sm" onClick={openCreate} className="flex items-center gap-2">
                <Plus size={14} />
                Add Certificate
              </PixelButton>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <PixelCard 
                key={cert.id} 
                className="relative group cursor-pointer"
                onClick={() => openPreview(cert)}
              >
                {isOwner && (
                  <div 
                    className="absolute top-4 right-4 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => openEdit(cert)}
                      className="p-2 bg-[var(--primary)] text-[var(--background)] border-2 border-[var(--background)] hover:scale-110 transition-transform"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-2 bg-[var(--accent)] text-white border-2 border-[var(--background)] hover:scale-110 transition-transform"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                )}

                <div className="relative mb-4 overflow-hidden border-4 border-[var(--border)]">
                  {cert.image ? (
                    <img 
                      src={cert.image}
                      alt={cert.name}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 flex items-center justify-center">
                      <Award size={48} className="text-[var(--primary)]" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-[var(--background)]/90 border border-[var(--primary)]">
                    <span className="font-pixel text-xs text-[var(--primary)]">
                      #{String(index + 1).padStart(3, '0')}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-pixel text-xs text-[var(--text)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                    {cert.name}
                  </h3>
                  
                  <p className="font-cyber text-sm text-[var(--primary)]">
                    {cert.issuer}
                  </p>

                  <div className="flex items-center gap-2 text-[var(--text-muted)] font-cyber text-xs">
                    <Calendar size={12} />
                    Issued {formatDate(cert.issueDate)}
                  </div>

                  {cert.expiryDate && (
                    <div className="flex items-center gap-2 text-[var(--accent)] font-cyber text-xs">
                      <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
                      Expires {formatDate(cert.expiryDate)}
                    </div>
                  )}

                  {cert.credentialId && (
                    <div className="flex items-center gap-2 text-[var(--text-muted)] font-cyber text-xs pt-2 border-t border-[var(--border)]">
                      <Hash size={12} />
                      ID: {cert.credentialId.slice(0, 8)}...
                    </div>
                  )}
                </div>
              </PixelCard>
            ))}
          </div>

          {certificates.length === 0 && (
            <PixelCard className="text-center py-16">
              <Award size={64} className="mx-auto mb-4 text-[var(--text-muted)]" />
              <p className="font-pixel text-sm text-[var(--text-muted)] mb-2">
                No certificates in vault
              </p>
              <p className="font-cyber text-xs text-[var(--text-muted)]">
                Add your certifications to showcase your expertise
              </p>
            </PixelCard>
          )}
        </motion.div>
      </div>

      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "EDIT_CERTIFICATE.exe" : "ADD_CERTIFICATE.exe"}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">CERTIFICATE_NAME</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">ISSUING_ORGANIZATION</label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData({...formData, issuer: e.target.value})}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-xs text-[var(--primary)] block mb-2">ISSUE_DATE</label>
              <input
                type="month"
                value={formData.issueDate}
                onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-xs text-[var(--primary)] block mb-2">EXPIRY_DATE (optional)</label>
              <input
                type="month"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">CREDENTIAL_ID</label>
            <input
              type="text"
              value={formData.credentialId}
              onChange={(e) => setFormData({...formData, credentialId: e.target.value})}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">CREDENTIAL_URL</label>
            <input
              type="url"
              value={formData.credentialUrl}
              onChange={(e) => setFormData({...formData, credentialUrl: e.target.value})}
              className="w-full bg-[var(--background)] border-4 border-[var(--border)] px-4 py-3 font-cyber text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          
          <div>
            <label className="font-pixel text-xs text-[var(--primary)] block mb-2">CERTIFICATE_IMAGE</label>
            <MediaUpload
              onUpload={handleImageUpload}
              type="image"
              currentUrl={imageUrl || formData.image}
            />
          </div>
        </div>
      </EditModal>

      {selectedCert && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCert(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[var(--surface)] border-4 border-[var(--primary)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-pixel text-lg text-[var(--text)] mb-2">{selectedCert.name}</h2>
                  <p className="font-cyber text-[var(--primary)]">{selectedCert.issuer}</p>
                </div>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="text-[var(--text-muted)] hover:text-[var(--accent)]"
                >
                  Close
                </button>
              </div>

              {selectedCert.image && (
                <div className="mb-6 border-4 border-[var(--border)]">
                  <img 
                    src={selectedCert.image}
                    alt={selectedCert.name}
                    className="w-full"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-[var(--background)] border-2 border-[var(--border)]">
                  <p className="font-pixel text-xs text-[var(--text-muted)] mb-1">ISSUED</p>
                  <p className="font-cyber text-[var(--text)]">{formatDate(selectedCert.issueDate)}</p>
                </div>
                {selectedCert.expiryDate && (
                  <div className="p-4 bg-[var(--background)] border-2 border-[var(--border)]">
                    <p className="font-pixel text-xs text-[var(--text-muted)] mb-1">EXPIRES</p>
                    <p className="font-cyber text-[var(--accent)]">{formatDate(selectedCert.expiryDate)}</p>
                  </div>
                )}
              </div>

              {selectedCert.credentialId && (
                <div className="p-4 bg-[var(--background)] border-2 border-[var(--border)] mb-4">
                  <p className="font-pixel text-xs text-[var(--text-muted)] mb-1">CREDENTIAL_ID</p>
                  <p className="font-cyber text-[var(--text)] break-all">{selectedCert.credentialId}</p>
                </div>
              )}

              {selectedCert.credentialUrl && (
                <a 
                  href={selectedCert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <PixelButton className="w-full flex items-center justify-center gap-2">
                    <ExternalLink size={16} />
                    Verify Credential
                  </PixelButton>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}