import { useEffect, useRef, useState } from 'react'
import { CalendarClock, Camera, Check, Clock3, ImagePlus, Link2, Save, Send, Trash2, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Button, Toast } from '../components/index.js'
import { useApp } from '../state/AppContext.jsx'

const networkOptions = [
  { id: 'instagram', label: 'Instagram', limit: 2200, icon: Camera, tone: 'instagram' },
  { id: 'facebook', label: 'Facebook', limit: 63206, icon: Link2, tone: 'facebook' },
  { id: 'linkedin', label: 'LinkedIn', limit: 3000, icon: Link2, tone: 'linkedin' },
  { id: 'tiktok', label: 'TikTok', limit: 2200, icon: Camera, tone: 'tiktok' },
  { id: 'x', label: 'X', limit: 280, icon: X, tone: 'x' },
]

const initialForm = {
  content: '',
  networks: [],
  scheduleDate: '',
  scheduleTime: '',
}

function CreatePage() {
  const location = useLocation()
  const { saveDraft, createPost } = useApp()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(initialForm)
  const [media, setMedia] = useState(null)
  const [errors, setErrors] = useState({})
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [submittingMode, setSubmittingMode] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => () => {
    if (media?.url) URL.revokeObjectURL(media.url)
  }, [media?.url])

  useEffect(() => {
    const event = location.state?.event
    if (!event) return
    const network = networkOptions.find((option) => option.label === event.network)
    setForm({ content: event.content, networks: network ? [network.id] : [], scheduleDate: event.date, scheduleTime: event.time })
    setErrors({})
  }, [location.state])

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '', content: name === 'content' ? '' : current.content }))
  }

  const toggleNetwork = (networkId) => {
    setForm((current) => ({ ...current, networks: current.networks.includes(networkId) ? current.networks.filter((id) => id !== networkId) : [...current.networks, networkId] }))
    setErrors((current) => ({ ...current, networks: '' }))
  }

  const handleMediaChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setErrors((current) => ({ ...current, media: 'Choisissez une image ou une vidéo valide.' }))
      event.target.value = ''
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors((current) => ({ ...current, media: 'Le fichier ne doit pas dépasser 10 Mo.' }))
      event.target.value = ''
      return
    }

    if (media?.url) URL.revokeObjectURL(media.url)
    setMedia({ file, url: URL.createObjectURL(file), type: file.type.startsWith('video/') ? 'video' : 'image' })
    setErrors((current) => ({ ...current, media: '' }))
    event.target.value = ''
  }

  const removeMedia = () => {
    if (media?.url) URL.revokeObjectURL(media.url)
    setMedia(null)
  }

  const resetForm = () => {
    removeMedia()
    setForm(initialForm)
    setErrors({})
    setScheduleOpen(false)
    setSubmittingMode(null)
  }

  const validate = (mode) => {
    const nextErrors = {}
    if (!form.content.trim()) nextErrors.content = 'Ajoutez du contenu avant de publier.'
    if (form.networks.length === 0) nextErrors.networks = 'Sélectionnez au moins un réseau de publication.'
    if (mode === 'schedule' && !form.scheduleDate) nextErrors.scheduleDate = 'Choisissez une date de programmation.'
    if (mode === 'schedule' && !form.scheduleTime) nextErrors.scheduleTime = 'Choisissez une heure de programmation.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3500)
  }

  const handlePublish = async (mode) => {
    if (!validate(mode)) return
    setSubmittingMode(mode)
    await createPost({ content: form.content, networks: form.networks, status: mode === 'schedule' ? 'Programmé' : 'Publié', date: form.scheduleDate || '2026-09-24', time: form.scheduleTime || '18:00', scheduleDate: form.scheduleDate, scheduleTime: form.scheduleTime })
    showToast(mode === 'schedule' ? 'Publication programmée avec succès.' : 'Publication envoyée avec succès.')
    resetForm()
  }

  const handleSaveDraft = async () => {
    if (!form.content.trim()) {
      setErrors({ content: 'Ajoutez du contenu avant d’enregistrer le brouillon.' })
      return
    }
    setSubmittingMode('draft')
    await saveDraft({ ...form, mediaName: media?.file.name || null })
    showToast('Brouillon enregistré avec succès.')
    resetForm()
  }

  const selectedNetworkDetails = networkOptions.filter((network) => form.networks.includes(network.id))
  const selectedLimit = selectedNetworkDetails.length ? Math.min(...selectedNetworkDetails.map((network) => network.limit)) : null

  return (
    <div className="create-page">
      <section className="create-intro" aria-labelledby="create-title"><div><p className="dashboard-eyebrow">Votre espace de création</p><h2 id="create-title">Créer une publication</h2><p>Préparez une publication et diffusez-la sur vos réseaux en quelques instants.</p></div><span className="create-draft-count"><Save size={15} /> Brouillons dans votre espace</span></section>

      <div className="create-layout">
        <section className="create-composer-panel" aria-label="Composition de la publication">
          <div className="create-section-heading"><span className="create-section-number">01</span><div><h3>Votre contenu</h3><p>Un message clair, au bon endroit.</p></div></div>
          <div className="create-textarea-wrap"><label htmlFor="publication-content">Texte de la publication</label><textarea id="publication-content" className={`create-textarea ${errors.content ? 'has-error' : ''}`} maxLength={selectedLimit || 63206} placeholder="Que souhaitez-vous partager aujourd'hui ?" value={form.content} onChange={(event) => setField('content', event.target.value)} /><div className="create-textarea-footer"><span>{errors.content ? <span className="create-error">{errors.content}</span> : selectedLimit ? `Limite du réseau le plus court : ${selectedLimit.toLocaleString('fr-FR')} caractères` : 'Sélectionnez un réseau pour voir sa limite'}</span><strong>{form.content.length.toLocaleString('fr-FR')} / {(selectedLimit || 63206).toLocaleString('fr-FR')}</strong></div></div>

          <div className="create-section-heading create-section-heading-spaced"><span className="create-section-number">02</span><div><h3>Publier sur</h3><p>Sélectionnez un ou plusieurs réseaux.</p></div></div>
          <div className="create-network-grid">{networkOptions.map(({ id, label, limit, icon: Icon, tone }) => <button className={`create-network-card ${form.networks.includes(id) ? 'is-selected' : ''}`} key={id} type="button" aria-pressed={form.networks.includes(id)} onClick={() => toggleNetwork(id)}><span className={`create-network-icon create-network-icon-${tone}`}><Icon size={18} /></span><span><strong>{label}</strong><small>{form.networks.includes(id) ? `${limit.toLocaleString('fr-FR')} caractères` : 'Sélectionner'}</small></span><span className="create-network-check">{form.networks.includes(id) && <Check size={14} />}</span></button>)}</div>
          {errors.networks && <p className="create-error create-block-error" role="alert">{errors.networks}</p>}

          <div className="create-section-heading create-section-heading-spaced"><span className="create-section-number">03</span><div><h3>Média</h3><p>Ajoutez une image ou une vidéo pour illustrer votre message.</p></div></div>
          <input ref={fileInputRef} className="create-file-input" type="file" accept="image/*,video/*" onChange={handleMediaChange} />
          {media ? <div className="create-media-preview"><div className="create-media-visual">{media.type === 'image' ? <img src={media.url} alt="Aperçu du média sélectionné" /> : <video src={media.url} controls />}</div><div className="create-media-info"><strong>{media.file.name}</strong><span>{(media.file.size / 1024 / 1024).toFixed(1)} Mo · {media.type === 'image' ? 'Image' : 'Vidéo'}</span></div><button className="create-media-remove" type="button" aria-label="Supprimer le média" onClick={removeMedia}><Trash2 size={16} /></button></div> : <button className="create-media-add" type="button" onClick={() => fileInputRef.current?.click()}><span><ImagePlus size={20} /></span><strong>Ajouter un média</strong><small>Image ou vidéo · 10 Mo maximum</small></button>}
          {errors.media && <p className="create-error create-block-error" role="alert">{errors.media}</p>}
        </section>

        <aside className="create-options-panel" aria-label="Options de publication">
          <div className="create-options-heading"><h3>Options</h3><span>Choisissez quand publier</span></div>
          <div className="create-actions"><Button icon={<Send size={16} />} loading={submittingMode === 'now'} disabled={Boolean(submittingMode)} onClick={() => handlePublish('now')}>Publier maintenant</Button><Button variant="secondary" icon={<CalendarClock size={16} />} disabled={Boolean(submittingMode)} onClick={() => setScheduleOpen(true)}>Programmer</Button></div>
          {scheduleOpen && <div className="create-schedule-fields"><div><label htmlFor="schedule-date">Date</label><input id="schedule-date" className={errors.scheduleDate ? 'has-error' : ''} type="date" value={form.scheduleDate} onChange={(event) => setField('scheduleDate', event.target.value)} /></div><div><label htmlFor="schedule-time">Heure</label><div className="create-time-input"><Clock3 size={15} /><input id="schedule-time" className={errors.scheduleTime ? 'has-error' : ''} type="time" value={form.scheduleTime} onChange={(event) => setField('scheduleTime', event.target.value)} /></div></div>{(errors.scheduleDate || errors.scheduleTime) && <p className="create-error" role="alert">{errors.scheduleDate || errors.scheduleTime}</p>}<Button className="create-schedule-confirm" loading={submittingMode === 'schedule'} disabled={Boolean(submittingMode)} onClick={() => handlePublish('schedule')}>Confirmer la programmation</Button></div>}
          <div className="create-options-divider" />
          <button className="create-draft-button" type="button" disabled={Boolean(submittingMode)} onClick={handleSaveDraft}><Save size={16} /> Enregistrer comme brouillon</button>
          <div className="create-options-note"><Check size={15} /><span>Vos modifications restent privées jusqu’à la publication.</span></div>
        </aside>
      </div>

      {toast && <div className="accounts-toast"><Toast message={toast} onClose={() => setToast('')} /></div>}
    </div>
  )
}

export default CreatePage
