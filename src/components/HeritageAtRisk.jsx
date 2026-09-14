import { useMemo, useState } from 'react'
import { ArrowRight, ExternalLink, HeartHandshake, MapPin, ShieldAlert, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CULTURE_TYPES, HERITAGE_RISK_ITEMS, RISK_COMMUNITIES, RISK_LEVELS, RISK_STATES } from '../data/heritageRisk'
import { slugify } from '../data/states'
import ImpactActions from './ImpactActions'

const statusTone = {
  Thriving: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  Declining: 'border-amber-200 bg-amber-50 text-amber-800',
  'At Risk': 'border-orange-200 bg-orange-50 text-orange-900',
  'Critically Fading': 'border-rose-200 bg-rose-50 text-rose-900',
  'Preservation Priority': 'border-gold/40 bg-gold/10 text-maroon',
}

function RiskImage({item}){
  const [failed,setFailed]=useState(false)
  return <div className="relative h-52 overflow-hidden rounded-[1.4rem] bg-[#D8E2E1]">
    {!failed && <img src={item.image} alt={`Representative cultural image for ${item.tradition}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={()=>setFailed(true)}/>} 
    {failed && <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_30%,#fff0d9,#d8a66e)] px-6 text-center"><div><div className="text-4xl">✦</div><div className="mt-2 font-display text-xl text-maroon">{item.tradition}</div><div className="mt-1 text-xs text-ink/50">Representative image unavailable</div></div></div>}
    <div className="absolute inset-x-3 top-3 flex items-center justify-between"><span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] shadow-sm backdrop-blur ${statusTone[item.risk]}`}>{item.risk}</span><span className="rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-maroon shadow-sm backdrop-blur">{item.type}</span></div>
  </div>
}

export default function HeritageAtRisk({dark=false}){
  const [state,setState]=useState('All')
  const [type,setType]=useState('All')
  const [risk,setRisk]=useState('All')
  const [community,setCommunity]=useState('All')
  const [expanded,setExpanded]=useState(null)

  const items=useMemo(()=>HERITAGE_RISK_ITEMS.filter(item=>
    (state==='All'||item.state===state)&&
    (type==='All'||item.type===type)&&
    (risk==='All'||item.risk===risk)&&
    (community==='All'||item.community===community)
  ),[state,type,risk,community])

  const selectClass='w-full rounded-2xl border border-maroon/10 bg-white/90 px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-maroon/30 focus:ring-4 focus:ring-saffron/10'

  return <section id="heritage-at-risk" className={`relative overflow-hidden border-y border-maroon/10 bg-[#F2F4EE] ${dark?'risk-dark':''}`}>
    <div className="pointer-events-none absolute inset-0 heritage-grid opacity-30"/>
    <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-saffron/15 blur-3xl"/>
    <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl"/>
    <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-maroon/15 bg-white/75 px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-maroon"><ShieldAlert size={13}/> Heritage at Risk</div>
          <h2 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-ink md:text-6xl">Traditions deserve a future, not just an archive.</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink/60">Some cultural practices depend on small circles of practitioners, specialist skills, oral transmission or local livelihoods. Explore the traditions below with care: learn their context, recognise the communities who sustain them, and understand how safeguarding can begin with attention.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-ink/55"><span className="rounded-full bg-white px-3 py-2">Community-centred</span><span className="rounded-full bg-white px-3 py-2">Source-aware</span><span className="rounded-full bg-white px-3 py-2">Living heritage</span></div>
        </div>
        <div className="rounded-[2rem] border border-maroon/10 bg-white/80 p-5 shadow-card backdrop-blur sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[.18em] text-maroon/65">Filter the archive</div><div className="mt-1 text-sm text-ink/50">{items.length} tradition{items.length===1?'':'s'} shown</div></div><div className="grid h-11 w-11 place-items-center rounded-2xl bg-saffron/10 text-maroon"><Sparkles size={18}/></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select value={state} onChange={e=>setState(e.target.value)} className={selectClass} aria-label="Filter by state"><option>All</option>{RISK_STATES.filter(x=>x!=='All').map(x=><option key={x}>{x}</option>)}</select>
            <select value={type} onChange={e=>setType(e.target.value)} className={selectClass} aria-label="Filter by culture type">{CULTURE_TYPES.map(x=><option key={x}>{x}</option>)}</select>
            <select value={risk} onChange={e=>setRisk(e.target.value)} className={selectClass} aria-label="Filter by risk level">{RISK_LEVELS.map(x=><option key={x}>{x}</option>)}</select>
            <select value={community} onChange={e=>setCommunity(e.target.value)} className={selectClass} aria-label="Filter by community">{RISK_COMMUNITIES.map(x=><option key={x}>{x.length>38?x.slice(0,38)+'…':x}</option>)}</select>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map(item=><article key={item.id} className="group rounded-[2rem] border border-maroon/10 bg-white/90 p-4 shadow-card transition duration-300 hover:-translate-y-2 hover:shadow-warm">
          <RiskImage item={item}/>
          <div className="px-1 pb-2 pt-5">
            <div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-2xl text-maroon">{item.tradition}</h3><div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-ink/45"><MapPin size={13}/> {item.state} • {item.district}</div></div></div>
            <div className="mt-3 text-xs font-semibold text-ink/55">Community / region</div><div className="mt-1 text-sm leading-6 text-ink/65">{item.community}</div>
            <p className="mt-3 text-sm leading-6 text-ink/60">{item.description}</p>
            <div className="mt-4 rounded-2xl border border-saffron/15 bg-saffron/5 p-4"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-maroon/70">Why it needs attention</div><div className="mt-2 text-sm leading-6 text-ink/65">{item.riskReason}</div></div>
            <div className="mt-4 flex flex-wrap gap-2"><Link to={`/state/${item.slug || slugify(item.state)}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-maroon px-4 py-2.5 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-[#1E2F61]">Explore Tradition <ArrowRight size={15}/></Link><button onClick={()=>setExpanded(expanded===item.id?null:item.id)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-maroon/15 bg-cream px-4 py-2.5 text-sm font-bold text-maroon hover:-translate-y-0.5 hover:bg-white"><HeartHandshake size={15}/> How You Can Help</button></div>
            {expanded===item.id&&<div className="mt-3 animate-pop rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><div className="font-bold">Start with respectful action</div><div className="mt-1">Learn from community-led sources, attend authentic performances or workshops where appropriate, support legitimate artisan livelihoods, credit practitioners, and avoid treating cultural knowledge as a free raw material.</div></div>}
            <ImpactActions item={{name:item.tradition,state:item.state,district:item.district,type:item.type}} compact />
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink/40 hover:text-maroon"><ExternalLink size={12}/> {item.source}</a>
          </div>
        </article>)}
      </div>

      {items.length===0&&<div className="mt-10 rounded-[2rem] border border-dashed border-maroon/20 bg-white/65 p-10 text-center"><div className="font-display text-2xl text-maroon">No traditions match those filters.</div><p className="mt-2 text-sm text-ink/50">Try widening the filters to continue exploring.</p></div>}

      <div className="mt-12 rounded-[2.2rem] bg-maroon px-6 py-10 text-center text-cream shadow-warm sm:px-10">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gold text-ink"><HeartHandshake size={21}/></div>
        <h3 className="mt-4 font-display text-4xl md:text-5xl">Discover. Preserve. Pass It On.</h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/65">Heritage stays alive when communities can practise it, teach it, earn from it and choose how it is shared. Explore thoughtfully and make support part of discovery.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/search" className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-ink hover:-translate-y-1">Explore India <ArrowRight size={16}/></Link><Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15">Our cultural approach</Link></div>
      </div>
    </div>
  </section>
}
