import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)
const APP_STORAGE_KEY = 'vayonis:app'

const initialConnectedAccounts = [
  { id: 'instagram', name: 'Instagram', handle: '@atelier.dakar', connected: true },
  { id: 'facebook', name: 'Facebook', handle: 'Atelier Dakar', connected: true },
  { id: 'linkedin', name: 'LinkedIn', handle: 'Atelier Dakar', connected: true },
  { id: 'tiktok', name: 'TikTok', handle: '@atelier.dakar', connected: false },
  { id: 'x', name: 'X', handle: '@atelier_dakar', connected: false },
]

const initialPosts = [
  { id: 'post-1', date: '2026-09-21', time: '09:30', content: 'Les coulisses de notre équipe : une semaine pour créer, apprendre et avancer ensemble.', networks: ['linkedin'], status: 'Publié' },
  { id: 'post-2', date: '2026-09-22', time: '12:15', content: '5 idées simples pour nourrir votre calendrier éditorial cette semaine.', networks: ['facebook'], status: 'Programmé' },
  { id: 'post-3', date: '2026-09-24', time: '18:00', content: 'Une nouvelle collection arrive. Voici un aperçu de ce que nous préparons.', networks: ['instagram'], status: 'Programmé' },
  { id: 'post-4', date: '2026-09-25', time: '08:45', content: 'Votre rappel du vendredi : la régularité compte plus que la perfection.', networks: ['x'], status: 'Brouillon' },
  { id: 'post-5', date: '2026-09-26', time: '10:00', content: 'Dans les coulisses de notre processus créatif, sans filtre et avec intention.', networks: ['tiktok'], status: 'Programmé' },
]

const initialAppState = {
  connectedAccounts: initialConnectedAccounts,
  posts: initialPosts,
  drafts: [],
  onboardingData: null,
}

function readStoredState() {
  try {
    const storedState = window.localStorage.getItem(APP_STORAGE_KEY)
    if (!storedState) return initialAppState
    const parsedState = JSON.parse(storedState)
    return {
      connectedAccounts: Array.isArray(parsedState.connectedAccounts) ? parsedState.connectedAccounts : initialConnectedAccounts,
      posts: Array.isArray(parsedState.posts) ? parsedState.posts : initialPosts,
      drafts: Array.isArray(parsedState.drafts) ? parsedState.drafts : [],
      onboardingData: parsedState.onboardingData || null,
    }
  } catch {
    return initialAppState
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export function AppProvider({ children }) {
  const [state, setState] = useState(readStoredState)

  useEffect(() => {
    window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const connectAccount = async (id) => {
    await wait(750)
    setState((current) => ({ ...current, connectedAccounts: current.connectedAccounts.map((account) => account.id === id ? { ...account, connected: true } : account) }))
  }

  const disconnectAccount = async (id) => {
    await wait(500)
    setState((current) => ({ ...current, connectedAccounts: current.connectedAccounts.map((account) => account.id === id ? { ...account, connected: false } : account) }))
  }

  const createPost = async (post) => {
    await wait(850)
    const nextPost = {
      ...post,
      id: `post-${Date.now()}`,
      status: post.status || (post.scheduleDate ? 'Programmé' : 'Publié'),
      date: post.date || post.scheduleDate || '2026-09-24',
      time: post.time || post.scheduleTime || '18:00',
    }
    setState((current) => ({ ...current, posts: [nextPost, ...current.posts] }))
    return nextPost
  }

  const updatePost = (id, updates) => {
    setState((current) => ({ ...current, posts: current.posts.map((post) => post.id === id ? { ...post, ...updates } : post) }))
  }

  const deletePost = (id) => {
    setState((current) => ({ ...current, posts: current.posts.filter((post) => post.id !== id) }))
  }

  const saveDraft = async (draft) => {
    await wait(450)
    const nextDraft = { ...draft, id: `draft-${Date.now()}`, savedAt: new Date().toISOString() }
    setState((current) => ({ ...current, drafts: [nextDraft, ...current.drafts] }))
    return nextDraft
  }

  const deleteDraft = (id) => {
    setState((current) => ({ ...current, drafts: current.drafts.filter((draft) => draft.id !== id) }))
  }

  const updateOnboarding = async (data) => {
    await wait(900)
    setState((current) => ({ ...current, onboardingData: data }))
    return data
  }

  return <AppContext.Provider value={{ ...state, connectAccount, disconnectAccount, createPost, updatePost, deletePost, saveDraft, deleteDraft, updateOnboarding }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useApp doit être utilisé dans un AppProvider')
  }

  return context
}
