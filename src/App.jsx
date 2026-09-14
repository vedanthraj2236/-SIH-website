import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { Compass, GitCompare, Info, Menu, Sparkles, Trophy, X, MapPinned, ShieldAlert, Route as RouteIcon } from 'lucide-react'
import { useState } from 'react'
import Home from './pages/Home'
import StateDetail from './pages/StateDetail'
import SearchPage from './pages/Search'
import Compare from './pages/Compare'
import About from './pages/About'
import Quiz from './pages/Quiz'
import NotFound from './pages/NotFound'
import HeritageAtRiskPage from './pages/HeritageAtRiskPage'
import TraditionDetail from './pages/TraditionDetail'
import Trails from './pages/Trails'
import Crafts from './pages/Crafts'
import CraftDetail from './pages/CraftDetail'
import AIHeritage from './pages/AIHeritage'
import SearchBar from './components/SearchBar'
import CultureBot from './components/CultureBot'
import LanguageSelector from './components/LanguageSelector'
import { useLanguage } from './components/LanguageContext'

const nav = [
  { to: '/search', label: 'Explore', icon: MapPinned },
  { to: '/quiz', label: 'Culture Quiz', icon: Trophy },
  { to: '/compare', label: 'Compare', icon: GitCompare },
  { to: '/about', label: 'About', icon: Info },
  { to: '/heritage-at-risk', label: 'Heritage at Risk', icon: ShieldAlert },
  { to: '/trails', label: 'Heritage Trails', icon: RouteIcon },
  { to: '/crafts', label: 'Traditional Crafts', icon: Sparkles },
  { to: '/ai-heritage', label: 'AI + Heritage', icon: Sparkles },
]

function Header(){
 const [open,setOpen]=useState(false)
 const { t } = useLanguage()
 return <header className="sticky top-0 z-50 border-b border-maroon/10 bg-cream/88 shadow-sm backdrop-blur-xl">
  <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
   <Link to="/" className="group flex items-center gap-3" onClick={()=>setOpen(false)}>
    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-maroon text-gold shadow-lg shadow-maroon/15 transition group-hover:-rotate-3 group-hover:scale-105"><Compass size={21}/></span>
    <div><div className="font-display text-2xl leading-none text-maroon">Indian Heritage</div><div className="hidden text-[10px] font-bold uppercase tracking-[.22em] text-ink/45 sm:block">India • culture • living heritage</div></div>
   </Link>
   <div className="hidden min-w-0 flex-1 justify-center lg:flex"><SearchBar compact/></div>
   <LanguageSelector compact/>
   <nav className="hidden items-center gap-1 md:flex">
    {nav.filter(item=>!item.to.startsWith('/#')).map(({to,label,icon:Icon})=>{const labels={'/search':t.explore,'/quiz':t.quiz,'/compare':t.compare,'/about':t.about,'/heritage-at-risk':t.risk,'/trails':t.trails,'/crafts':t.crafts,'/ai-heritage':'AI + Heritage'}; return <NavLink key={to} to={to} className={({isActive})=>`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${isActive?'bg-maroon text-white shadow-md':'text-ink/70 hover:bg-maroon/5 hover:text-maroon'}`}><Icon size={16}/> {labels[to]||label}</NavLink>})}

   </nav>
   <button className="rounded-full p-2 text-maroon transition hover:bg-maroon/5 md:hidden" onClick={()=>setOpen(v=>!v)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
  </div>
  {open&&<div className="border-t border-maroon/10 bg-cream/95 px-4 pb-5 pt-3 shadow-lg md:hidden">
    <div className="mb-3 flex items-center justify-between gap-2"><SearchBar compact/><LanguageSelector compact/></div>
    <div className="grid gap-1">
      <Link onClick={()=>setOpen(false)} to="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-maroon/5"><Compass size={17}/> {t.home}</Link>
      {nav.filter(item=>!item.to.startsWith('/#')).map(({to,label,icon:Icon})=>{const labels={'/search':t.explore,'/quiz':t.quiz,'/compare':t.compare,'/about':t.about,'/heritage-at-risk':t.risk,'/trails':t.trails,'/crafts':t.crafts,'/ai-heritage':'AI + Heritage'}; return <Link key={to} onClick={()=>setOpen(false)} to={to} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-maroon/5"><Icon size={17}/>{labels[to]||label}</Link>})}
      <Link onClick={()=>setOpen(false)} to="/heritage-at-risk" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-maroon/5"><ShieldAlert size={17}/>Heritage at Risk</Link>
    </div>
   </div>}
 </header>
}

function Footer(){return <footer className="mt-10 border-t border-maroon/10 bg-[#242424] text-cream"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8"><div><div className="flex items-center gap-2 font-display text-2xl text-gold"><Sparkles size={17}/> Indian Heritage</div><p className="mt-1 max-w-md text-sm text-cream/55">An immersive cultural atlas for discovering India’s living traditions, places, foodways and stories.</p></div><div className="flex flex-wrap gap-4 text-xs text-cream/45"><Link to="/about" className="hover:text-gold">About</Link><Link to="/quiz" className="hover:text-gold">Quiz</Link><Link to="/compare" className="hover:text-gold">Compare</Link><Link to="/search" className="hover:text-gold">Explore</Link><Link to="/heritage-at-risk" className="hover:text-gold">Heritage at Risk</Link><Link to="/trails" className="hover:text-gold">Heritage Trails</Link><Link to="/crafts" className="hover:text-gold">Traditional Crafts</Link></div></div></footer>}

export default function App(){return <div className="min-h-screen"><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/state/:stateName" element={<StateDetail/>}/><Route path="/search" element={<SearchPage/>}/><Route path="/compare" element={<Compare/>}/><Route path="/about" element={<About/>}/><Route path="/quiz" element={<Quiz/>}/><Route path="/heritage-at-risk" element={<HeritageAtRiskPage/>}/><Route path="/trails" element={<Trails/>}/><Route path="/crafts" element={<Crafts/>}/><Route path="/craft/:craftId" element={<CraftDetail/>}/><Route path="/ai-heritage" element={<AIHeritage/>}/><Route path="/tradition/:traditionId" element={<TraditionDetail/>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/><CultureBot/></div>}
