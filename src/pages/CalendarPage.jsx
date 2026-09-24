import { useMemo, useState } from 'react'
import { BriefcaseBusiness, CalendarDays, Camera, ChevronLeft, ChevronRight, Clock3, Globe2, Hash, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, EmptyState, Modal, Toast } from '../components/index.js'
import { useApp } from '../state/AppContext.jsx'

const MOCK_TODAY = new Date(2026, 8, 24)
const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const monthFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
const shortDateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })

const networkMeta = {
  instagram: { label: 'Instagram', tone: 'warning', icon: Camera },
  facebook: { label: 'Facebook', tone: 'warning', icon: Globe2 },
  linkedin: { label: 'LinkedIn', tone: 'success', icon: BriefcaseBusiness },
  tiktok: { label: 'TikTok', tone: 'warning', icon: Camera },
  x: { label: 'X', tone: 'default', icon: Hash },
}

function toCalendarEvent(post) {
  const meta = networkMeta[post.networks?.[0]] || networkMeta.instagram
  const tone = post.status === 'Publié' ? 'success' : post.status === 'Brouillon' ? 'default' : meta.tone
  return { ...post, network: meta.label, tone, icon: meta.icon }
}

function toDateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

function startOfWeek(date) {
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function getMonthCells(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const offset = (firstDay.getDay() + 6) % 7
  return [...Array.from({ length: offset }, () => null), ...Array.from({ length: daysInMonth }, (_, index) => new Date(date.getFullYear(), date.getMonth(), index + 1))]
}

function EventButton({ event, compact = false, weekly = false, onClick }) {
  const Icon = event.icon
  const [hour, minute] = event.time.split(':').map(Number)
  const top = ((hour + minute / 60 - 8) / 3) * 92

  return (
    <button className={`calendar-event calendar-event-${event.tone} ${compact ? 'calendar-event-compact' : ''}`} style={weekly ? { top: `${Math.max(6, top)}px` } : undefined} type="button" onClick={() => onClick(event)}>
      <span className="calendar-event-time">{event.time}</span>
      <span className="calendar-event-content"><strong>{event.content}</strong><small><Icon size={11} /> {event.network}</small></span>
    </button>
  )
}

function CalendarPage() {
  const navigate = useNavigate()
  const [view, setView] = useState('month')
  const [cursorDate, setCursorDate] = useState(MOCK_TODAY)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [toast, setToast] = useState('')
  const { posts, deletePost } = useApp()
  const events = posts.map(toCalendarEvent)
  const SelectedEventIcon = selectedEvent?.icon

  const monthCells = useMemo(() => getMonthCells(cursorDate), [cursorDate])
  const weekDays = useMemo(() => {
    const monday = startOfWeek(cursorDate)
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + index)
      return date
    })
  }, [cursorDate])
  const title = view === 'month' ? monthFormatter.format(cursorDate) : `Semaine du ${shortDateFormatter.format(weekDays[0])}`

  const getEvents = (date) => events.filter((event) => event.date === toDateKey(date))
  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  const shiftPeriod = (amount) => {
    const nextDate = new Date(cursorDate)
    if (view === 'month') nextDate.setMonth(cursorDate.getMonth() + amount)
    else nextDate.setDate(cursorDate.getDate() + amount * 7)
    setCursorDate(nextDate)
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    deletePost(selectedEvent.id)
    showToast('Publication supprimée du calendrier.')
    setSelectedEvent(null)
  }

  const handleModify = () => {
    const { icon, ...editableEvent } = selectedEvent
    navigate('/create', { state: { event: editableEvent } })
    setSelectedEvent(null)
  }

  return (
    <div className="calendar-page">
      <section className="calendar-intro" aria-labelledby="calendar-title"><div><p className="dashboard-eyebrow">Votre rythme éditorial</p><h2 id="calendar-title">Calendrier</h2><p>Visualisez vos publications et gardez le fil de votre présence sociale.</p></div><span className="calendar-event-count"><CalendarDays size={16} /> {events.length} publications mockées</span></section>

      <section className="calendar-toolbar" aria-label="Contrôles du calendrier">
        <div className="calendar-view-tabs"><button className={view === 'month' ? 'is-active' : ''} type="button" onClick={() => setView('month')}>Mensuelle</button><button className={view === 'week' ? 'is-active' : ''} type="button" onClick={() => setView('week')}>Hebdomadaire</button></div>
        <div className="calendar-navigation"><button type="button" aria-label="Période précédente" onClick={() => shiftPeriod(-1)}><ChevronLeft size={18} /></button><button className="calendar-today-button" type="button" onClick={() => setCursorDate(MOCK_TODAY)}>Aujourd'hui</button><button type="button" aria-label="Période suivante" onClick={() => shiftPeriod(1)}><ChevronRight size={18} /></button></div>
      </section>

      <section className="calendar-panel" aria-label={`${view === 'month' ? 'Vue mensuelle' : 'Vue hebdomadaire'} du calendrier`}>
        <div className="calendar-panel-heading"><h3>{title.charAt(0).toUpperCase() + title.slice(1)}</h3><div className="calendar-legend"><span><i className="calendar-legend-dot calendar-legend-scheduled" /> Programmé</span><span><i className="calendar-legend-dot calendar-legend-published" /> Publié</span><span><i className="calendar-legend-dot calendar-legend-draft" /> Brouillon</span></div></div>
        {events.length === 0 ? <EmptyState title="Votre calendrier est vide" description="Programmez votre première publication pour voir votre rythme éditorial apparaître ici." action={<Button onClick={() => navigate('/create')}>Créer une publication</Button>} /> : view === 'month' ? <div className="calendar-month-grid"><div className="calendar-weekday-row">{weekdays.map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-month-cells">{monthCells.map((date, index) => date ? <div className={`calendar-day-cell ${toDateKey(date) === toDateKey(MOCK_TODAY) ? 'is-today' : ''}`} key={toDateKey(date)}><span className="calendar-day-number">{date.getDate()}</span><div className="calendar-day-events">{getEvents(date).map((event) => <EventButton key={event.id} event={event} compact onClick={setSelectedEvent} />)}</div></div> : <div className="calendar-day-cell calendar-day-empty" key={`empty-${index}`} />)}</div></div> : <div className="calendar-week-view"><div className="calendar-week-hours"><span /><span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span></div>{weekDays.map((date) => <div className={`calendar-week-day ${toDateKey(date) === toDateKey(MOCK_TODAY) ? 'is-today' : ''}`} key={toDateKey(date)}><div className="calendar-week-day-heading"><strong>{weekdays[date.getDay() === 0 ? 6 : date.getDay() - 1]}</strong><span>{date.getDate()}</span></div><div className="calendar-week-timeline"><i /><i /><i /><i />{getEvents(date).map((event) => <EventButton key={event.id} event={event} weekly onClick={setSelectedEvent} />)}</div></div>)}</div>}
      </section>

      <Modal isOpen={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)} title="Détail de la publication" size="sm">{selectedEvent && <div className="calendar-detail"><div className="calendar-detail-meta"><span className="calendar-detail-network"><SelectedEventIcon size={17} /> {selectedEvent.network}</span><Badge tone={selectedEvent.tone}>{selectedEvent.status}</Badge></div><p className="calendar-detail-content">{selectedEvent.content}</p><div className="calendar-detail-date"><span><CalendarDays size={16} /> {dateFormatter.format(new Date(`${selectedEvent.date}T12:00:00`))}</span><span><Clock3 size={16} /> {selectedEvent.time}</span></div><div className="calendar-detail-actions"><Button variant="secondary" icon={<Pencil size={16} />} onClick={handleModify}>Modifier</Button><Button variant="danger" icon={<Trash2 size={16} />} onClick={handleDelete}>Supprimer</Button></div></div>}</Modal>
      {toast && <div className="accounts-toast"><Toast message={toast} onClose={() => setToast('')} /></div>}
    </div>
  )
}

export default CalendarPage
