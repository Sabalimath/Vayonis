import { useState } from 'react'
import { ArrowRight, Check, Eye, EyeOff, Sparkles, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/index.js'
import { useAuth } from '../state/AuthContext.jsx'

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmation: '',
}

function getPasswordStrength(password) {
  if (!password) return { label: '', level: 0 }

  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 1) return { label: 'À renforcer', level: 1 }
  if (score === 2) return { label: 'Correct', level: 2 }
  if (score === 3) return { label: 'Bonne', level: 3 }
  return { label: 'Excellente', level: 4 }
}

function validate(values) {
  const errors = {}

  if (!values.firstName.trim()) errors.firstName = 'Votre prénom est obligatoire.'
  if (!values.lastName.trim()) errors.lastName = 'Votre nom est obligatoire.'
  if (!values.email.trim()) {
    errors.email = 'Votre adresse email est obligatoire.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Saisissez une adresse email valide.'
  }
  if (!values.password) {
    errors.password = 'Votre mot de passe est obligatoire.'
  } else if (values.password.length < 8) {
    errors.password = 'Votre mot de passe doit contenir au moins 8 caractères.'
  }
  if (!values.confirmation) {
    errors.confirmation = 'Confirmez votre mot de passe.'
  } else if (values.confirmation !== values.password) {
    errors.confirmation = 'Les mots de passe ne correspondent pas.'
  }

  return errors
}

function RegisterPasswordField({ id, label, name, value, error, touched, showPassword, onToggle, onChange, onBlur, autoComplete }) {
  return (
    <div className="auth-password-field">
      <Input
        id={id}
        label={label}
        name={name}
        type={showPassword ? 'text' : 'password'}
        placeholder="8 caractères minimum"
        autoComplete={autoComplete}
        value={value}
        error={touched ? error : undefined}
        required
        onChange={onChange}
        onBlur={onBlur}
      />
      <button
        className="auth-password-toggle"
        type="button"
        aria-label={showPassword ? `Masquer ${label.toLowerCase()}` : `Afficher ${label.toLowerCase()}`}
        onClick={onToggle}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const strength = getPasswordStrength(values.password)

  const handleChange = (event) => {
    const { name, value } = event.target
    const nextValues = { ...values, [name]: value }
    setValues(nextValues)

    if (touched[name] || (name === 'password' && touched.confirmation)) {
      setErrors(validate(nextValues))
    }
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
    setErrors(validate(values))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmation: true })

    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    await register(values)
    navigate('/onboarding')
  }

  return (
    <main className="auth-page register-page">
      <section className="auth-brand-panel" aria-labelledby="register-brand-title">
        <div className="auth-brand-content">
          <a className="landing-logo auth-logo" href="/" aria-label="Vayonis, accueil">
            <span className="logo-mark">V</span>
            <span>Vayonis</span>
          </a>
          <div className="auth-brand-message">
            <p className="auth-eyebrow"><Sparkles size={14} /> Votre espace social, en mieux</p>
            <h1 id="register-brand-title">Donnez à vos idées la place de <em>grandir.</em></h1>
            <p>Une organisation claire pour publier avec plus de constance et moins de charge mentale.</p>
          </div>
          <div className="auth-brand-proof"><span><Check size={14} /> Démarrage en quelques minutes</span><span><Check size={14} /> Aucun engagement</span></div>
        </div>
        <div className="auth-brand-orbit auth-brand-orbit-one" />
        <div className="auth-brand-orbit auth-brand-orbit-two" />
      </section>

      <section className="auth-form-panel" aria-labelledby="register-title">
        <div className="auth-form-wrap">
          <div className="auth-mobile-logo"><a className="landing-logo" href="/" aria-label="Vayonis, accueil"><span className="logo-mark">V</span><span>Vayonis</span></a></div>
          <div className="auth-form-heading">
            <span className="auth-form-icon"><UserRound size={18} /></span>
            <p className="landing-eyebrow">Créer votre espace</p>
            <h2 id="register-title">Bienvenue chez vous.</h2>
            <p>Créez votre compte pour commencer à organiser votre présence sociale.</p>
          </div>

          <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
            <div className="register-name-fields">
              <Input id="register-first-name" label="Prénom" name="firstName" autoComplete="given-name" placeholder="Aïcha" value={values.firstName} error={touched.firstName ? errors.firstName : undefined} required onChange={handleChange} onBlur={handleBlur} />
              <Input id="register-last-name" label="Nom" name="lastName" autoComplete="family-name" placeholder="Diop" value={values.lastName} error={touched.lastName ? errors.lastName : undefined} required onChange={handleChange} onBlur={handleBlur} />
            </div>
            <Input id="register-email" label="Email" name="email" type="email" autoComplete="email" placeholder="vous@exemple.com" value={values.email} error={touched.email ? errors.email : undefined} required onChange={handleChange} onBlur={handleBlur} />
            <RegisterPasswordField id="register-password" label="Mot de passe" name="password" value={values.password} error={errors.password} touched={touched.password} showPassword={showPassword} onToggle={() => setShowPassword((visible) => !visible)} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" />
            <div className="password-strength" aria-live="polite" aria-label={`Force du mot de passe : ${strength.label || 'non renseignée'}`}>
              <div className="password-strength-top"><span>Force du mot de passe</span><strong className={`password-strength-label password-strength-${strength.level}`}>{strength.label}</strong></div>
              <div className="password-strength-bars" aria-hidden="true">{[1, 2, 3, 4].map((bar) => <span className={bar <= strength.level ? `is-filled password-strength-${strength.level}` : ''} key={bar} />)}</div>
              <small>8 caractères minimum, avec une majuscule et un chiffre pour plus de sécurité.</small>
            </div>
            <RegisterPasswordField id="register-confirmation" label="Confirmation du mot de passe" name="confirmation" value={values.confirmation} error={errors.confirmation} touched={touched.confirmation} showPassword={showConfirmation} onToggle={() => setShowConfirmation((visible) => !visible)} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" />
            <Button className="auth-submit" type="submit" loading={loading} icon={!loading && <ArrowRight size={17} />}>Créer mon compte</Button>
          </form>

          <p className="auth-signup">Déjà un compte ? <a href="/login">Se connecter</a></p>
          <p className="auth-demo-note">Création de compte de démonstration : aucune donnée n'est envoyée à un serveur.</p>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
