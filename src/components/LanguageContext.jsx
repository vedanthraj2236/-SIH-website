import { createContext, useContext, useMemo, useState } from 'react'
import { LANGUAGES, uiText } from '../data/i18n'

const LanguageContext = createContext(null)
const STORAGE_KEY = 'indian-heritage-language'

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem(STORAGE_KEY) || 'en')
  const setLanguage = (code) => { setLanguageState(code); localStorage.setItem(STORAGE_KEY, code); document.documentElement.lang = code }
  const value = useMemo(() => ({ language, setLanguage, languages: LANGUAGES, t: uiText(language), active: LANGUAGES.find((x) => x.code === language) || LANGUAGES[0] }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
export function useLanguage(){ const ctx = useContext(LanguageContext); if(!ctx) throw new Error('useLanguage must be used inside LanguageProvider'); return ctx }
