import { useState } from 'react'
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Checkbox, Input } from '../components/index.js'
import { useAuth } from '../state/AuthContext.jsx'

const initialValues = {
  email: '',
  password: '',
  remember: false,
}

function validate(values) {
  const errors = {}

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

  return errors
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValues = { ...values, [name]: type === 'checkbox' ? checked : value }
    setValues(nextValues)

    if (touched[name]) {
      setErrors(validate(nextValues))
    }
  }

  const handleBlur = (event) => {
    const { name } = event.target
    const nextTouched = { ...touched, [name]: true }
    setTouched(nextTouched)
    setErrors(validate(values))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setTouched({ email: true, password: true })

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)
    await login(values)
    navigate('/dashboard')
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel" aria-labelledby="auth-brand-title">
        <div className="auth-brand-content">
          <a className="landing-logo auth-logo" href="/" aria-label="Vayonis, accueil">
            <span className="logo-mark">V</span>
            <span>Vayonis</span>
          </a>
          <div className="auth-brand-message">
            <p className="auth-eyebrow"><Sparkles size={14} /> Votre espace social, en mieux</p>
            <h1 id="auth-brand-title">Tout ce qu'il vous faut pour rester <em>visible.</em></h1>
            <p>Retrouvez vos idées, vos réseaux et votre calendrier éditorial dans un espace qui vous ressemble.</p>
          </div>
          <div className="auth-brand-proof"><span><Check size={14} /> Simple à prendre en main</span><span><Check size={14} /> Pensé pour votre rythme</span></div>
        </div>
        <div className="auth-brand-orbit auth-brand-orbit-one" />
        <div className="auth-brand-orbit auth-brand-orbit-two" />
      </section>

      <section className="auth-form-panel" aria-labelledby="login-title">
        <div className="auth-form-wrap">
          <div className="auth-mobile-logo"><a className="landing-logo" href="/" aria-label="Vayonis, accueil"><span className="logo-mark">V</span><span>Vayonis</span></a></div>
          <div className="auth-form-heading">
            <span className="auth-form-icon"><LockKeyhole size={18} /></span>
            <p className="landing-eyebrow">Espace membre</p>
            <h2 id="login-title">Bon retour.</h2>
            <p>Connectez-vous pour gérer vos réseaux sociaux.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <Input
              id="login-email"
              label="Email"
              name="email"
              type="email"
              placeholder="vous@exemple.com"
              autoComplete="email"
              value={values.email}
              error={touched.email ? errors.email : undefined}
              required
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="auth-password-field">
              <Input
                id="login-password"
                label="Mot de passe"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="8 caractères minimum"
                autoComplete="current-password"
                value={values.password}
                error={touched.password ? errors.password : undefined}
                required
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                className="auth-password-toggle"
                type="button"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="auth-form-options">
              <Checkbox label="Se souvenir de moi" name="remember" checked={values.remember} onChange={handleChange} />
              <a href="#mot-de-passe-oublie">Mot de passe oublié ?</a>
            </div>
            <Button className="auth-submit" type="submit" loading={loading} icon={!loading && <ArrowRight size={17} />}>
              Se connecter
            </Button>
          </form>

          <p className="auth-signup">Vous n'avez pas encore de compte ? <a href="/register">Créer un compte</a></p>
          <p className="auth-demo-note">Connexion de démonstration : aucune donnée n'est envoyée à un serveur.</p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
