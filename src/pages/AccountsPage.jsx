import { useState } from 'react'
import { BriefcaseBusiness, Camera, CheckCircle2, Globe2, Hash, Music2, ShieldCheck, Unplug } from 'lucide-react'
import { Button, ConfirmationModal, EmptyState, Toast } from '../components/index.js'
import { useApp } from '../state/AppContext.jsx'

const accountDetails = {
  instagram: { description: 'Partagez vos contenus visuels avec votre communauté.', icon: Camera, tone: 'instagram' },
  facebook: { description: 'Gardez le lien avec votre audience et vos clients.', icon: Globe2, tone: 'facebook' },
  linkedin: { description: 'Développez votre présence professionnelle avec constance.', icon: BriefcaseBusiness, tone: 'linkedin' },
  tiktok: { description: 'Donnez vie à vos idées dans un format court et créatif.', icon: Music2, tone: 'tiktok' },
  x: { description: 'Rejoignez les conversations qui comptent pour vous.', icon: Hash, tone: 'x' },
}

function AccountsPage() {
  const { connectedAccounts: socialAccounts, connectAccount, disconnectAccount } = useApp()
  const [selectedId, setSelectedId] = useState(null)
  const [modalMode, setModalMode] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState('')
  const connectedAccounts = socialAccounts.filter((account) => account.connected)
  const selectedAccount = socialAccounts.find((account) => account.id === selectedId)

  const openModal = (id, mode) => {
    setSelectedId(id)
    setModalMode(mode)
  }

  const closeModal = () => {
    if (!actionLoading) {
      setSelectedId(null)
      setModalMode(null)
    }
  }

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3500)
  }

  const confirmAction = async () => {
    if (!selectedAccount) return

    setActionLoading(true)
    if (modalMode === 'connect') {
      await connectAccount(selectedAccount.id)
      showToast(`${selectedAccount.name} a bien été connecté.`)
    } else {
      await disconnectAccount(selectedAccount.id)
      showToast(`${selectedAccount.name} a été déconnecté.`)
    }
    setActionLoading(false)
    setSelectedId(null)
    setModalMode(null)
  }

  return (
    <div className="accounts-page">
      <section className="accounts-intro" aria-labelledby="accounts-title">
        <div><p className="dashboard-eyebrow">Vos canaux de diffusion</p><h2 id="accounts-title">Comptes sociaux</h2><p>Centralisez vos réseaux pour publier depuis un seul espace.</p></div>
        <div className="accounts-summary"><strong>{connectedAccounts.length}</strong><span>réseau{connectedAccounts.length > 1 ? 'x' : ''} connecté{connectedAccounts.length > 1 ? 's' : ''}</span></div>
      </section>

      {connectedAccounts.length === 0 && <div className="accounts-empty"><EmptyState title="Connectez votre premier réseau" description="Commencez par ajouter un compte social pour publier et suivre votre activité avec Vayonis." action={<Button onClick={() => openModal(socialAccounts[0]?.id, 'connect')}>Connecter un compte</Button>} /></div>}

      <section className="accounts-grid" aria-label="Réseaux sociaux disponibles">
        {socialAccounts.map((account) => {
          const details = accountDetails[account.id]
          const Icon = details.icon
          const busy = actionLoading && selectedId === account.id

          return (
            <article className={`account-card ${account.connected ? 'is-connected' : ''}`} key={account.id}>
              <div className="account-card-top"><span className={`account-card-icon account-card-icon-${details.tone}`}><Icon size={22} /></span>{account.connected && <span className="account-connected-label"><CheckCircle2 size={14} /> Connecté</span>}</div>
              <div className="account-card-copy"><h3>{account.name}</h3><p>{details.description}</p>{account.connected && <span className="account-handle">{account.handle}</span>}</div>
              {account.connected ? <Button className="account-card-button" variant="secondary" loading={busy} icon={!busy && <Unplug size={16} />} onClick={() => openModal(account.id, 'disconnect')}>Déconnecter</Button> : <Button className="account-card-button" loading={busy} onClick={() => openModal(account.id, 'connect')}>Connecter</Button>}
            </article>
          )
        })}
      </section>

      <div className="accounts-demo-note"><ShieldCheck size={17} /><span><strong>Simulation frontend</strong> Vos comptes ne sont pas réellement connectés. Cette interface reproduit uniquement le parcours d’autorisation.</span></div>

      <ConfirmationModal isOpen={Boolean(selectedAccount && modalMode)} onClose={closeModal} onConfirm={confirmAction} loading={actionLoading} title={modalMode === 'connect' ? 'Autoriser une connexion' : 'Déconnecter ce compte'} description={selectedAccount ? modalMode === 'connect' ? `Autoriser Vayonis à se connecter à ${selectedAccount.name} ? Aucune donnée réelle ne sera transmise.` : `Voulez-vous vraiment déconnecter ${selectedAccount.name} de Vayonis ?` : ''} confirmLabel={modalMode === 'connect' ? 'Autoriser' : 'Déconnecter'} tone={modalMode === 'connect' ? 'primary' : 'danger'} />

      {toast && <div className="accounts-toast"><Toast message={toast} onClose={() => setToast('')} /></div>}
    </div>
  )
}

export default AccountsPage
