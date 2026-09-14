import { ArrowRight, Bot, Heart, Landmark, MapPinned, ShieldCheck, Sparkles, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeritageAtlas from '../components/HeritageAtlas'
import SearchBar from '../components/SearchBar'
import HeritageAtRisk from '../components/HeritageAtRisk'
import MiniQuiz from '../components/MiniQuiz'
import LanguageSelector from '../components/LanguageSelector'
import { useLanguage } from '../components/LanguageContext'
import CultureExplorer from '../components/CultureExplorer'


export default function Home(){ const { t, active } = useLanguage(); return <main className="home-page">
 <section className="relative overflow-hidden home-dark-hero"><div className="absolute inset-0 heritage-grid opacity-30"/><div className="relative mx-auto max-w-7xl px-4 pb-8 pt-12 text-center md:px-8 md:pb-12 md:pt-16"><div className="mx-auto max-w-4xl animate-fadeUp"><div className="inline-flex items-center gap-2 rounded-full border border-maroon/10 bg-white/75 px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-maroon"><Sparkles size={13}/> India as a living cultural atlas</div><h1 className="mt-5 font-display text-5xl leading-[.96] text-ink sm:text-6xl lg:text-8xl">Find the place.<br/><span className="text-maroon">Meet its traditions.</span></h1><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-ink/55 md:text-lg">Explore India by geography, then go deeper: <b>India → State → District → Tradition.</b> Every layer adds context, people, practices and places.</p><div className="mx-auto mt-7 max-w-2xl"><SearchBar/></div></div><div className="mt-8 text-left home-atlas-frame rounded-[2rem] atlas-dark overflow-hidden"><HeritageAtlas/></div></div></section>

 <div className="home-culture-band"><CultureExplorer/></div>

 <section className="mx-auto max-w-7xl px-4 -mt-1 py-5 md:px-8"><div className="relative overflow-hidden rounded-[2rem] border border-maroon/10 bg-gradient-to-br from-white via-[#F4F7FA] to-[#E7ECEF] p-6 shadow-card md:p-8"><div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gold/20 blur-3xl"/><div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-2xl"><div className="text-xs font-bold uppercase tracking-[.22em] text-maroon/65">{t.languages}</div><h2 className="mt-2 font-display text-4xl text-maroon md:text-5xl">{t.languageTitle}</h2><p className="mt-3 text-sm leading-6 text-ink/55">{t.languageSub}</p><div className="mt-5 flex flex-wrap items-center gap-2"><span className="rounded-full bg-maroon px-4 py-2 text-xs font-bold text-white">{active.native}</span><span className="text-xs text-ink/45">{active.name}</span><span className="hidden text-xs text-ink/40 sm:inline">• navigation, stories, trails & guide</span></div></div><div className="flex flex-wrap items-center gap-3"><button onClick={()=>window.dispatchEvent(new CustomEvent('open-language-picker'))} className="inline-flex items-center gap-2 rounded-full bg-maroon px-5 py-3 text-sm font-bold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-warm">{t.continue}</button><LanguageSelector/></div></div></div></section>



 <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20 home-feature-dark"><div className="grid gap-5 md:grid-cols-3">{[[Landmark,'Places that hold memory','Heritage sites are part of the story, not endpoints on a list.'],[UtensilsCrossed,'Food as living knowledge','Regional foodways reveal climate, ingredients, ritual and everyday life.'],[Heart,'Traditions with people behind them','Discover the communities, makers and performers who keep practices alive.']].map(([Icon,title,text])=><article key={title} className="group rounded-[2rem] border border-maroon/10 bg-white p-7 shadow-card hover:-translate-y-1 hover:shadow-warm"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron/10 text-maroon transition group-hover:rotate-3"><Icon size={21}/></div><h3 className="mt-5 font-display text-2xl text-maroon">{title}</h3><p className="mt-3 text-sm leading-6 text-ink/55">{text}</p></article>)}</div></section>

 <section className="mx-auto max-w-7xl px-4 pb-6 md:px-8"><div className="rounded-[2rem] border border-maroon/10 p-7 shadow-card md:p-10 home-craft-dark"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-maroon/60">Meet the making</div><h2 className="mt-2 font-display text-4xl md:text-5xl">Traditional Crafts</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">Go behind the object to discover techniques, practitioners, places and responsible ways to engage.</p></div><Link to="/crafts" className="inline-flex items-center gap-2 rounded-full bg-maroon px-5 py-3 text-sm font-bold text-white">Explore crafts <ArrowRight size={15}/></Link></div></div></section>
 <HeritageAtRisk dark/>

 <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
  <div className="relative overflow-hidden rounded-[2rem] border border-maroon/10 bg-[#242424] p-7 text-cream shadow-warm md:p-10">
   <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl"/>
   <div className="relative grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
    <div>
     <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-gold"><Bot size={14}/> AI + Heritage</div>
     <h2 className="mt-4 font-display text-4xl md:text-5xl">Ask the map. Get a cultural answer.</h2>
     <p className="mt-4 max-w-2xl text-sm leading-7 text-cream/65">Use the Heritage Guide for personalized discovery, natural-language cultural search, heritage trip planning, comparisons, translation assistance and trail ideas. The answer always points back to the cultural atlas rather than replacing it.</p>
     <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[.12em]"><span className="rounded-full bg-teal-50 px-3 py-2 text-teal-700">Verified Source</span><span className="rounded-full bg-gold/20 px-3 py-2 text-gold">Community Source</span><span className="rounded-full bg-white/10 px-3 py-2 text-cream">AI Suggestion</span></div>
     <div className="mt-7 flex flex-wrap gap-3"><Link to="/ai-heritage" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-ink hover:-translate-y-0.5">Explore AI + Heritage <ArrowRight size={15}/></Link><button onClick={()=>window.dispatchEvent(new CustomEvent('open-heritage-guide',{detail:{prompt:'Show me traditional music traditions within 100 km of Mysuru.'}}))} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/5">Ask now <Bot size={15}/></button></div>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">{[[MapPinned,'Conversational map','Explore place, district and tradition through questions.'],[ShieldCheck,'Trust-aware answers','See what is verified and what is an AI planning suggestion.'],[Heart,'Community-first','No invented artisans, events, organizations or sensitive claims.'],[Sparkles,'Personalized journeys','Shape plans around time, interests, food, style and access needs.']].map(([Icon,title,text])=><div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center gap-2 text-gold"><Icon size={17}/><span className="text-sm font-bold text-cream">{title}</span></div><p className="mt-2 text-[11px] leading-5 text-cream/50">{text}</p></div>)}</div>
   </div>
  </div>
 </section>
 <MiniQuiz/>

 <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8"><div className="rounded-[2rem] bg-maroon p-8 text-cream shadow-warm md:p-10"><div className="max-w-3xl"><div className="text-xs font-bold uppercase tracking-[.2em] text-gold">The atlas is the starting point</div><h2 className="mt-3 font-display text-4xl md:text-5xl">Discover. Preserve. Pass It On.</h2><p className="mt-4 text-sm leading-7 text-cream/65">Use the map to move from a national view into the texture of a district, then into the traditions that make that place distinct.</p><div className="mt-7 flex flex-wrap gap-3"><Link to="/trails" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-ink hover:-translate-y-0.5">Explore heritage trails <ArrowRight size={15}/></Link><Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white hover:bg-white/5">About Indian Heritage</Link></div></div></div></section>
 </main>}
