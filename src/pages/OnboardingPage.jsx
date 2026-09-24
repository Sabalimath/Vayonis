import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/index.js'
import { useApp } from '../state/AppContext.jsx'

const profileOptions = ['Créateur de contenu', 'Entrepreneur', 'Freelance', 'Community manager', 'Entreprise', 'Autre']
const goalOptions = ['Gagner du temps', 'Publier régulièrement', 'Centraliser mes réseaux', 'Programmer mes publications', 'Suivre mon activité']
const networkOptions = ['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'X']

const initialData = {
  profile: '',
  otherProfile: '',
  goals: [],
  networks: [],
}

function OptionCard({ label, selected, onClick, multi = false }) {
  return (
    <button className={`onboarding-option ${selected ? 'is-selected' : ''}`} type="button" aria-pressed={selected} onClick={onClick}>
      <span className={`onboarding-option-check ${selected ? 'is-selected' : ''}`}>{selected && <Check size={15} strokeWidth={3} />}</span>
      <span>{label}</span>
      {!multi && <ChevronRight className="onboarding-option-arrow" size={17} aria-hidden="true" />}
    </button>
  )
}

function OnboardingPage() {
  const navigate = useNavigate()
  const { updateOnboarding } = useApp()
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [completed, setCompleted] = useState(false)

  const updateData = (key, value) => {
    setData((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const toggleArrayValue = (key, value) => {
    setData((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }))
    setError('')
  }

  const validateStep = () => {
    if (step === 1 && !data.profile) {
      setError('Sélectionnez le profil qui vous correspond le mieux.')
      return false
    }
    if (step === 1 && data.profile === 'Autre' && !data.otherProfile.trim()) {
      setError('Précisez votre profil pour continuer.')
      return false
    }
    if (step === 2 && data.goals.length === 0) {
      setError('Sélectionnez au moins un objectif pour continuer.')
      return false
    }
    if (step === 3 && data.networks.length === 0) {
      setError('Sélectionnez au moins un réseau pour terminer.')
      return false
    }
    return true
  }

  const handleContinue = async () => {
    if (!validateStep()) return
    if (step < 3) {
      setStep((current) => current + 1)
      return
    }

    setSaving(true)
    await updateOnboarding(data)
    setSaving(false)
    setCompleted(true)
    window.setTimeout(() => navigate('/dashboard'), 1200)
  }

  const handleBack = () => {
    setError('')
    setStep((current) => Math.max(1, current - 1))
  }

  if (completed) {
    return (
      <main className="onboarding-page onboarding-success-page">
        <section className="onboarding-success" aria-live="polite">
          <span className="onboarding-success-icon"><CheckCircle2 size={34} /></span>
          <p className="onboarding-eyebrow">C'est prêt</p>
          <h1>Votre espace est configuré.</h1>
          <p>Nous avons préparé Vayonis selon vos objectifs. Votre tableau de bord arrive dans un instant.</p>
          <span className="onboarding-success-progress"><span /></span>
        </section>
      </main>
    )
  }

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <a className="landing-logo" href="/" aria-label="Vayonis, accueil"><span className="logo-mark">V</span><span>Vayonis</span></a>
        <span className="onboarding-save-note"><Sparkles size={14} /> Votre progression est sauvegardée</span>
      </header>

      <section className="onboarding-shell" aria-labelledby="onboarding-title">
        <div className="onboarding-progress-header">
          <div><p className="onboarding-eyebrow">Votre configuration</p><span>Étape {step} <b>/ 3</b></span></div>
          <span className="onboarding-progress-percent">{Math.round((step / 3) * 100)}%</span>
        </div>
        <div className="onboarding-progress-track" aria-label={`Progression : étape ${step} sur 3`} role="progressbar" aria-valuemin="1" aria-valuemax="3" aria-valuenow={step}><span style={{ width: `${(step / 3) * 100}%` }} /></div>
        <div className="onboarding-step-labels"><span className={step >= 1 ? 'is-current' : ''}>Profil</span><span className={step >= 2 ? 'is-current' : ''}>Objectifs</span><span className={step >= 3 ? 'is-current' : ''}>Réseaux</span></div>

        <div className="onboarding-content">
          <div className="onboarding-heading">
            <span className="onboarding-step-number">0{step}</span>
            <div>
              <h1 id="onboarding-title">{step === 1 && 'Parlez-nous de vous'}{step === 2 && 'Que souhaitez-vous accomplir avec Vayonis ?'}{step === 3 && 'Quels réseaux utilisez-vous ?'}</h1>
              <p>{step === 1 && 'Cela nous aide à personnaliser votre expérience.'}{step === 2 && 'Choisissez tout ce qui correspond à vos priorités.'}{step === 3 && 'Sélectionnez les réseaux que vous souhaitez centraliser.'}</p>
            </div>
          </div>

          <div className="onboarding-options">
            {step === 1 && <>
              <div className="onboarding-option-grid">{profileOptions.map((option) => <OptionCard key={option} label={option} selected={data.profile === option} onClick={() => updateData('profile', option)} />)}</div>
              {data.profile === 'Autre' && <Input id="other-profile" label="Votre profil" placeholder="Dites-nous en un peu plus" value={data.otherProfile} onChange={(event) => updateData('otherProfile', event.target.value)} error={error && !data.otherProfile.trim() ? error : undefined} autoComplete="off" />}
            </>}
            {step === 2 && <div className="onboarding-option-grid onboarding-option-grid-wide">{goalOptions.map((option) => <OptionCard key={option} label={option} selected={data.goals.includes(option)} multi onClick={() => toggleArrayValue('goals', option)} />)}</div>}
            {step === 3 && <div className="onboarding-network-grid">{networkOptions.map((option) => <OptionCard key={option} label={option} selected={data.networks.includes(option)} multi onClick={() => toggleArrayValue('networks', option)} />)}</div>}
          </div>

          {error && !(step === 1 && data.profile === 'Autre' && !data.otherProfile.trim()) && <p className="onboarding-error" role="alert">{error}</p>}
          <div className="onboarding-actions">
            <button className="onboarding-back" type="button" onClick={handleBack} disabled={step === 1 || saving}><ArrowLeft size={16} /> Retour</button>
            <Button className="onboarding-continue" type="button" loading={saving} icon={!saving && <ArrowRight size={17} />} onClick={handleContinue}>{step === 3 ? 'Terminer' : 'Continuer'}</Button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default OnboardingPage
