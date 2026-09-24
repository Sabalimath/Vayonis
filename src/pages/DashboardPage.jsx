import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Globe2,
  Music2,
  Plus,
  Send,
  UsersRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, EmptyState, Skeleton } from '../components/index.js'
import { useApp } from '../state/AppContext.jsx'
import { useAuth } from '../state/AuthContext.jsx'

const mockStats = [
  { label: 'Comptes connectés', value: '4', detail: '+1 ce mois-ci', icon: UsersRound, tone: 'green' },
  { label: 'Publications programmées', value: '12', detail: '+3 cette semaine', icon: CalendarDays, tone: 'orange' },
  { label: 'Publications cette semaine', value: '8', detail: 'sur 10 prévues', icon: Send, tone: 'blue' },
  { label: "Taux d'activité", value: '78 %', detail: '+12 % vs. le mois dernier', icon: Activity, tone: 'purple' },
]

const dashboardDateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })

const networkMeta = {
  instagram: { name: 'Instagram', icon: Camera, tone: 'instagram' },
  facebook: { name: 'Facebook', icon: Globe2, tone: 'facebook' },
  linkedin: { name: 'LinkedIn', icon: BriefcaseBusiness, tone: 'linkedin' },
  tiktok: { name: 'TikTok', icon: Music2, tone: 'tiktok' },
  x: { name: 'X', icon: Globe2, tone: 'x' },
}

function toDashboardPublication(post) {
  const network = networkMeta[post.networks?.[0]] || networkMeta.instagram
  return { title: post.content, excerpt: post.content, network: network.name, date: dashboardDateFormatter.format(new Date(`${post.date}T12:00:00`)), time: post.time, status: post.status, tone: post.status === 'Publié' ? 'success' : post.status === 'Brouillon' ? 'default' : 'warning', icon: network.icon }
}

function StatCard({ label, value, detail, icon: Icon, tone }) {
  return (
    <article className="dashboard-stat-card">
      <div className={`dashboard-stat-icon dashboard-stat-icon-${tone}`}><Icon size={19} /></div>
      <span className="dashboard-stat-label">{label}</span>
      <strong>{value}</strong>
      <span className="dashboard-stat-detail">{detail}</span>
    </article>
  )
}

function PublicationRow({ publication }) {
  const Icon = publication.icon

  return (
    <article className="dashboard-publication-row">
      <span className={`dashboard-publication-icon dashboard-network-${publication.network.toLowerCase()}`}><Icon size={17} /></span>
      <div className="dashboard-publication-copy"><strong>{publication.title}</strong><p>{publication.excerpt}</p></div>
      <span className="dashboard-publication-network">{publication.network}</span>
      <div className="dashboard-publication-date"><strong>{publication.date}</strong><span><Clock3 size={13} /> {publication.time}</span></div>
      <Badge tone={publication.tone}>{publication.status}</Badge>
    </article>
  )
}

function AccountRow({ account }) {
  const Icon = account.icon

  return (
    <div className="dashboard-account-row">
      <span className={`dashboard-account-icon dashboard-account-${account.tone}`}><Icon size={17} /></span>
      <span className="dashboard-account-copy"><strong>{account.name}</strong><small>{account.handle}</small></span>
      <span className="dashboard-account-status"><CheckCircle2 size={14} /> Connecté</span>
    </div>
  )
}

function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { posts, connectedAccounts } = useApp()
  const [isLoading, setIsLoading] = useState(true)
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Aïcha'
  const recentPublications = posts.slice(0, 3).map(toDashboardPublication)
  const activeAccounts = connectedAccounts.filter((account) => account.connected).map((account) => ({ ...account, ...(networkMeta[account.id] || networkMeta.instagram) }))
  const stats = mockStats.map((stat) => stat.label === 'Comptes connectés' ? { ...stat, value: String(activeAccounts.length) } : stat)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 550)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome" aria-labelledby="dashboard-welcome-title">
        <div><p className="dashboard-eyebrow">Mardi 24 septembre 2026</p><h2 id="dashboard-welcome-title">Bonjour, {firstName} <span aria-hidden="true">👋</span></h2><p>Voici un aperçu de votre activité.</p></div>
        <Button icon={<Plus size={17} />} onClick={() => navigate('/create')}>Créer une publication</Button>
      </section>

      <section className="dashboard-stats-grid" aria-label="Statistiques de votre activité" aria-busy={isLoading}>
        {isLoading ? stats.map((stat) => <article className="dashboard-stat-card dashboard-stat-card-loading" key={stat.label}><Skeleton variant="avatar" /><Skeleton variant="line" /><Skeleton variant="value" /><Skeleton variant="short-line" /></article>) : stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-publications-panel" aria-labelledby="publications-title">
          <div className="dashboard-panel-heading"><div><p className="dashboard-section-eyebrow">Votre calendrier</p><h2 id="publications-title">Dernières publications</h2></div><button className="dashboard-panel-link" type="button" onClick={() => navigate('/calendar')}>Voir le calendrier <ArrowUpRight size={15} /></button></div>
          {recentPublications.length > 0 ? <div className="dashboard-publications-list">{recentPublications.map((publication) => <PublicationRow key={`${publication.title}-${publication.date}`} publication={publication} />)}</div> : <EmptyState title="Aucune publication récente" description="Créez votre première publication pour voir votre activité apparaître ici." action={<Button onClick={() => navigate('/create')}>Créer une publication</Button>} />}
        </section>

        <section className="dashboard-panel dashboard-accounts-panel" aria-labelledby="accounts-title">
          <div className="dashboard-panel-heading"><div><p className="dashboard-section-eyebrow">Votre écosystème</p><h2 id="accounts-title">Réseaux connectés</h2></div><span className="dashboard-panel-count">{activeAccounts.length}/5</span></div>
          {activeAccounts.length > 0 ? <div className="dashboard-accounts-list">{activeAccounts.map((account) => <AccountRow key={account.name} account={account} />)}<Button variant="secondary" className="dashboard-accounts-button" icon={<UsersRound size={16} />} onClick={() => navigate('/accounts')}>Gérer mes comptes</Button></div> : <EmptyState title="Connectez votre premier réseau" description="Centralisez vos comptes pour commencer à publier depuis Vayonis." action={<Button onClick={() => navigate('/accounts')}>Connecter un compte</Button>} />}
        </section>
      </div>

      <div className="dashboard-tip"><FileText size={18} /><span><strong>Votre prochain objectif :</strong> programmez 2 publications cette semaine pour garder le rythme.</span><button type="button" onClick={() => navigate('/create')}>Créer maintenant <ArrowUpRight size={14} /></button></div>
    </div>
  )
}

export default DashboardPage
