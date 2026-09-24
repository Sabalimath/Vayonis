import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  Check,
  ChevronRight,
  ClipboardCheck,
  Camera,
  Layers3,
  Link2,
  Menu,
  Play,
  Sparkles,
  X,
} from 'lucide-react'
import { Button } from '../components/index.js'

const features = [
  {
    icon: Link2,
    title: 'Connexion',
    description: 'Rassemblez vos comptes sociaux dans un espace clair et sécurisé.',
  },
  {
    icon: Layers3,
    title: 'Publication multiple',
    description: 'Adaptez et diffusez un même contenu sur plusieurs réseaux.',
  },
  {
    icon: CalendarClock,
    title: 'Programmation',
    description: 'Planifiez vos prises de parole pour garder le rythme sans stress.',
  },
  {
    icon: BarChart3,
    title: 'Tableau de bord',
    description: 'Suivez votre activité sociale grâce à une vue simple et lisible.',
  },
  {
    icon: ClipboardCheck,
    title: 'Questionnaire personnalisé',
    description: 'Commencez avec des recommandations adaptées à vos objectifs.',
  },
]

const steps = [
  { number: '01', title: 'Connectez vos réseaux', description: 'Centralisez vos comptes en quelques instants.' },
  { number: '02', title: 'Créez votre contenu', description: 'Préparez vos textes et médias depuis un seul espace.' },
  { number: '03', title: 'Programmez ou publiez', description: 'Gardez le contrôle de votre calendrier éditorial.' },
]

function Logo({ light = false }) {
  return (
    <a className={`landing-logo ${light ? 'landing-logo-light' : ''}`} href="#top" aria-label="Vayonis, accueil">
      <span className="logo-mark">V</span>
      <span>Vayonis</span>
    </a>
  )
}

function DashboardMockup() {
  return (
    <div className="dashboard-visual" aria-label="Aperçu du tableau de bord Vayonis" role="img">
      <div className="dashboard-window">
        <div className="dashboard-topbar">
          <div className="window-dots"><span /><span /><span /></div>
          <span className="dashboard-url">app.vayonis.com / dashboard</span>
          <span className="dashboard-avatar">A</span>
        </div>
        <div className="dashboard-body">
          <aside className="dashboard-sidebar">
            <div className="dashboard-mini-logo"><span className="logo-mark">V</span> Vayonis</div>
            <div className="dashboard-nav-item dashboard-nav-active"><BarChart3 size={14} /> Vue d'ensemble</div>
            <div className="dashboard-nav-item"><CalendarClock size={14} /> Calendrier</div>
            <div className="dashboard-nav-item"><Layers3 size={14} /> Publications</div>
            <div className="dashboard-nav-item"><Link2 size={14} /> Comptes</div>
            <div className="dashboard-nav-spacer" />
            <div className="dashboard-profile"><span className="dashboard-profile-avatar">AD</span><span>Atelier D.</span></div>
          </aside>
          <div className="dashboard-content">
            <div className="dashboard-heading">
              <div><span className="dashboard-kicker">Mardi 24 septembre</span><strong>Bonjour, Aïcha</strong></div>
              <span className="dashboard-add">+ Créer</span>
            </div>
            <div className="dashboard-stats">
              <div className="dashboard-stat"><span>Posts programmés</span><strong>24</strong><small><b>+12%</b> ce mois-ci</small></div>
              <div className="dashboard-stat"><span>Comptes connectés</span><strong>04</strong><small>tous actifs</small></div>
              <div className="dashboard-stat"><span>Portée totale</span><strong>18,6k</strong><small><b>+8,4%</b> cette semaine</small></div>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-chart">
                <div className="dashboard-panel-heading"><strong>Activité de la semaine</strong><span>Cette semaine⌄</span></div>
                <div className="chart-area"><div className="chart-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 460 130" preserveAspectRatio="none" aria-hidden="true"><path d="M0 105 C35 95, 50 102, 78 82 S128 98, 157 67 S205 74, 230 52 S277 74, 308 41 S361 63, 390 27 S430 50, 460 17" /><path className="chart-fill" d="M0 105 C35 95, 50 102, 78 82 S128 98, 157 67 S205 74, 230 52 S277 74, 308 41 S361 63, 390 27 S430 50, 460 17 V130 H0Z" /></svg></div>
                <div className="chart-labels"><span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span></div>
              </div>
              <div className="dashboard-next"><div className="dashboard-panel-heading"><strong>À venir</strong><span>Voir tout <ChevronRight size={12} /></span></div><div className="next-post"><span className="next-post-icon"><Camera size={14} /></span><div><b>Nouvelle collection</b><small>Instagram · Aujourd'hui, 18:00</small></div><Check size={14} /></div><div className="next-post"><span className="next-post-icon next-post-linkedin">in</span><div><b>Les coulisses de l'équipe</b><small>LinkedIn · Demain, 09:30</small></div><Check size={14} /></div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-float dashboard-float-top"><Sparkles size={15} /><span>Votre semaine est planifiée</span></div>
      <div className="dashboard-float dashboard-float-bottom"><span className="float-check"><Check size={12} /></span><span><b>4 réseaux actifs</b><small>Tout est centralisé</small></span></div>
    </div>
  )
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="landing-page" id="top">
      <header className="landing-header">
        <div className="container landing-nav-wrap">
          <Logo />
          <button className="landing-menu-button" type="button" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav className={`landing-nav ${menuOpen ? 'landing-nav-open' : ''}`} aria-label="Navigation principale">
            <a href="#fonctionnalites" onClick={closeMenu}>Fonctionnalités</a>
            <a href="#comment-ca-marche" onClick={closeMenu}>Comment ça marche</a>
            <a className="landing-login" href="/login" onClick={closeMenu}>Connexion</a>
            <a className="button button-primary landing-nav-cta" href="/register" onClick={closeMenu}>Commencer gratuitement <ArrowRight size={16} /></a>
          </nav>
        </div>
      </header>

      <main>
        <section className="landing-hero section" aria-labelledby="hero-title">
          <div className="container landing-hero-grid">
            <div className="landing-hero-copy">
              <p className="landing-eyebrow"><span className="eyebrow-dot" /> La gestion sociale, autrement</p>
              <h1 id="hero-title">Gagnez du temps,<br /><em>publiez avec régularité.</em></h1>
              <p className="landing-hero-description">Centralisez la gestion de vos réseaux sociaux depuis une seule interface pensée pour vous aider à créer, organiser et faire grandir votre présence.</p>
              <div className="landing-hero-actions"><a className="button button-primary" href="/register">Commencer gratuitement <ArrowRight size={17} /></a><a className="landing-text-link" href="#comment-ca-marche"><span className="landing-play"><Play size={13} fill="currentColor" /></span> Découvrir Vayonis</a></div>
              <div className="landing-proof"><div className="proof-avatars"><span>MK</span><span>AD</span><span>FN</span><span>+</span></div><p><strong>Déjà adopté par des créateurs</strong><br /><span>qui veulent faire plus, simplement.</span></p></div>
            </div>
            <DashboardMockup />
          </div>
        </section>

        <section className="landing-features section" id="fonctionnalites" aria-labelledby="features-title">
          <div className="container"><div className="section-intro"><p className="landing-eyebrow">Tout au même endroit</p><h2 id="features-title">Votre présence sociale,<br /><em>enfin bien organisée.</em></h2><p>Les outils essentiels pour rester visible, constant et serein au quotidien.</p></div><div className="feature-grid">{features.map(({ icon: Icon, title, description }) => <article className="feature-card" key={title}><span className="feature-icon"><Icon size={21} /></span><h3>{title}</h3><p>{description}</p><a href="#comment-ca-marche" aria-label={`En savoir plus sur ${title}`}><ArrowRight size={16} /></a></article>)}</div></div>
        </section>

        <section className="landing-process section" id="comment-ca-marche" aria-labelledby="process-title">
          <div className="container process-grid"><div className="process-intro"><p className="landing-eyebrow">Simple, vraiment</p><h2 id="process-title">De l'idée à la publication,<br /><em>sans friction.</em></h2><p>Vayonis vous accompagne à chaque étape pour transformer votre organisation en habitudes durables.</p><a className="button button-outline" href="/register">Commencer maintenant <ArrowRight size={16} /></a></div><div className="steps-list">{steps.map((step) => <article className="step-item" key={step.number}><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div><ArrowRight className="step-arrow" size={19} /></article>)}</div></div>
        </section>

        <section className="landing-cta section"><div className="container landing-cta-inner"><div><p className="landing-eyebrow">Prêt à passer à la vitesse supérieure ?</p><h2>Centralisez votre<br /><em>présence sociale.</em></h2></div><a className="button button-light" href="/register">Commencer gratuitement <ArrowRight size={17} /></a></div></section>
      </main>

      <footer className="landing-footer"><div className="container footer-grid"><div className="footer-brand"><Logo light /><p>La plateforme simple et chaleureuse pour gérer vos réseaux sociaux avec intention.</p></div><div className="footer-links"><div><strong>Explorer</strong><a href="#fonctionnalites">Fonctionnalités</a><a href="#comment-ca-marche">Comment ça marche</a><a href="/register">Commencer</a></div><div><strong>Ressources</strong><a href="mailto:bonjour@vayonis.com">Nous contacter</a><a href="#mentions">Mentions légales</a><a href="#confidentialite">Confidentialité</a></div></div></div><div className="container footer-bottom"><span>© 2026 Vayonis. Fait avec intention.</span><span>Abidjan · Dakar · Partout</span></div></footer>
    </div>
  )
}

export default LandingPage