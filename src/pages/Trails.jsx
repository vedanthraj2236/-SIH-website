import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Bookmark, Check, Compass, ExternalLink, Filter, MapPin, Plus, Share2, Sparkles, Timer, Route as RouteIcon, HeartHandshake, Landmark } from 'lucide-react'
import { TRAIL_CATEGORIES, TRAILS } from '../data/trails'
import TrailRouteMap from '../components/TrailRouteMap'
import { stateVisuals } from '../data/stateVisuals'
import ImpactActions from '../components/ImpactActions'
import { useLanguage } from '../components/LanguageContext'

const helpAction = (label, query) => {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
  return <button onClick={()=>window.open(url,'_blank','noopener,noreferrer')} className="inline-flex items-center gap-1.5 rounded-full border border-maroon/10 bg-white px-3 py-2 text-[11px] font-bold text-ink/65 hover:-translate-y-0.5 hover:border-maroon/25 hover:text-maroon"><span>{label}</span><ExternalLink size={12}/></button>
}

function StopActions({ stop }) {
  return <div className="mt-4 flex flex-wrap gap-2">
    {helpAction('Learn', `${stop.name} ${stop.district} cultural heritage official`)}
    {helpAction('Watch', `${stop.name} ${stop.theme || 'tradition'} performance`)}
    {helpAction('Visit', `${stop.name} ${stop.district} heritage`)}
    {helpAction('Buy', `${stop.name} ${stop.buying} handloom artisan cooperative`)}
    {helpAction('Support', `${stop.name} ${stop.buying} cultural preservation community`)}
  </div>
}

export default function Trails(){
  const { t } = useLanguage()
  const [category, setCategory] = useState('All')
  const [region, setRegion] = useState('All')
  const [selectedId, setSelectedId] = useState(TRAILS[0].id)
  const [activeStop, setActiveStop] = useState(0)
  const [saved, setSaved] = useState(()=>JSON.parse(localStorage.getItem('indian-heritage-saved-trails')||'[]'))
  const [customizing, setCustomizing] = useState(false)
  const [customStops, setCustomStops] = useState([])

  const regions = useMemo(()=>['All', ...Array.from(new Set(TRAILS.map(t=>t.region)))],[])
  const filtered = useMemo(()=>TRAILS.filter(t=>(category==='All'||t.category===category)&&(region==='All'||t.region===region)),[category,region])
  const selected = filtered.find(t=>t.id===selectedId) || filtered[0] || TRAILS[0]
  const allSelectedStops = useMemo(()=>selected ? [...selected.stops,...customStops] : [],[selected,customStops])
  const stop = allSelectedStops[activeStop] || allSelectedStops[0]

  useEffect(()=>{ if(selected){ setSelectedId(selected.id); setActiveStop(0); setCustomStops([]) } },[category,region])
  useEffect(()=>{ localStorage.setItem('indian-heritage-saved-trails',JSON.stringify(saved)) },[saved])

  function toggleSave(){ setSaved(prev=>prev.includes(selected.id)?prev.filter(id=>id!==selected.id):[...prev,selected.id]) }
  async function shareTrail(){
    const payload={title:selected.name,text:`${selected.name} · ${selected.theme} · ${selected.stops.length} stops`,url:window.location.href}
    if(navigator.share) await navigator.share(payload).catch(()=>{})
    else await navigator.clipboard?.writeText(`${selected.name}\n${selected.theme}\n${window.location.href}`)
  }
  function addStop(){
    const extra = TRAILS.flatMap(t=>t.stops).find(s=>!selected.stops.some(x=>x.id===s.id) && s.district===selected.stops[selected.stops.length-1]?.district)
    if(extra) setCustomStops(prev=>prev.some(s=>s.id===extra.id)?prev:[...prev, {...extra, id:`custom-${extra.id}`, name:`Optional · ${extra.name}` }])
    else setCustomStops(prev=>[...prev,{id:`custom-${Date.now()}`,name:'Custom heritage stop',district:selected.region,coords:selected.stops[selected.stops.length-1]?.coords || [78.7,22.6],story:'A space reserved for a place your group wants to add after local research.',time:'Flexible',bestTime:'Check locally',etiquette:'Confirm access, photography and community protocols before visiting.',buying:'Use verified local or cooperative channels.',theme:'Custom'}])
  }

  return <main className="content-page mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-14">
    <section className="relative overflow-hidden rounded-[2.5rem] bg-maroon p-7 text-cream shadow-warm md:p-10">
      <div className="absolute inset-0 heritage-grid opacity-10"/>
      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-gold"><Compass size={15}/> {t.trails}</div>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[.96] md:text-7xl">Follow culture across places.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-cream/68">Curated journeys connect physical locations with the traditions, people, craft practices, foods and stories that make a place distinctive.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={()=>document.getElementById('trail-workspace')?.scrollIntoView({behavior:'smooth'})} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-ink hover:-translate-y-0.5">{t.start} <ArrowRight size={15}/></button>
            <button onClick={()=>setCategory('All')} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"><Filter size={15}/> Browse all themes</button>
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
          <div className="text-[10px] font-bold uppercase tracking-[.2em] text-gold">Trail philosophy</div>
          <div className="mt-3 font-display text-2xl">A route is a cultural story.</div>
          <p className="mt-2 text-sm leading-6 text-cream/58">Travel more slowly, listen to local knowledge, and let responsible purchasing and community-led experiences become part of the journey.</p>
        </div>
      </div>
    </section>

    <section className="mt-8 rounded-[2rem] border border-maroon/10 bg-white p-5 shadow-card md:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div><div className="text-xs font-bold uppercase tracking-[.2em] text-maroon/65">Choose your trail</div><div className="mt-1 font-display text-3xl text-ink">Theme, region, then route.</div></div>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-2xl border border-maroon/10 bg-cream px-4 py-3 text-sm"><Filter size={15} className="text-maroon"/><select value={category} onChange={e=>setCategory(e.target.value)} className="w-full bg-transparent font-semibold outline-none"><option value="All">All trail categories</option>{TRAIL_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label>
          <label className="flex items-center gap-2 rounded-2xl border border-maroon/10 bg-cream px-4 py-3 text-sm"><MapPin size={15} className="text-maroon"/><select value={region} onChange={e=>setRegion(e.target.value)} className="w-full bg-transparent font-semibold outline-none">{regions.map(r=><option key={r}>{r}</option>)}</select></label>
        </div>
      </div>
      <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
        {filtered.map(t=><button key={t.id} onClick={()=>{setSelectedId(t.id);setActiveStop(0);setCustomStops([])}} className={`min-w-[220px] rounded-3xl border p-4 text-left transition ${selected.id===t.id?'border-maroon bg-maroon text-white shadow-warm':'border-maroon/10 bg-cream hover:-translate-y-1 hover:bg-white hover:shadow-card'}`}>
          <div className={`text-[10px] font-bold uppercase tracking-[.18em] ${selected.id===t.id?'text-gold':'text-maroon/55'}`}>{t.category}</div>
          <div className={`mt-2 font-display text-2xl ${selected.id===t.id?'text-white':'text-maroon'}`}>{t.name}</div>
          <div className={`mt-1 text-xs ${selected.id===t.id?'text-white/58':'text-ink/50'}`}>{t.region} · {t.stops.length} stops</div>
        </button>)}
      </div>
    </section>

    <section id="trail-workspace" className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
      <div className="space-y-6">
        <article className="overflow-hidden rounded-[2rem] border border-maroon/10 bg-white shadow-card">
          <div className="relative h-56 overflow-hidden bg-cream">
            <img src={stateVisuals[selected.region.toLowerCase().replace(' ','-')]?.image || selected.heroImage} onError={e=>{e.currentTarget.src=selected.heroImage}} alt={`Cultural visual for ${selected.name}`} className="h-full w-full object-cover opacity-80"/>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent"/>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white"><div><div className="text-[10px] font-bold uppercase tracking-[.2em] text-gold">{selected.category}</div><h2 className="mt-1 font-display text-4xl leading-none">{selected.name}</h2></div><span className="rounded-full bg-white/15 px-3 py-2 text-xs font-bold backdrop-blur">{selected.stops.length} stops</span></div>
          </div>
          <div className="p-6">
            <p className="text-sm leading-7 text-ink/60">{selected.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-cream p-3"><div className="text-[10px] uppercase tracking-[.16em] text-maroon/55">Duration</div><div className="mt-1 font-semibold">{selected.duration}</div></div>
              <div className="rounded-2xl bg-cream p-3"><div className="text-[10px] uppercase tracking-[.16em] text-maroon/55">Distance</div><div className="mt-1 font-semibold">{selected.distance}</div></div>
              <div className="rounded-2xl bg-cream p-3"><div className="text-[10px] uppercase tracking-[.16em] text-maroon/55">Best season</div><div className="mt-1 font-semibold">{selected.season}</div></div>
              <div className="rounded-2xl bg-cream p-3"><div className="text-[10px] uppercase tracking-[.16em] text-maroon/55">Theme</div><div className="mt-1 font-semibold">{selected.theme}</div></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={toggleSave} className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold ${saved.includes(selected.id)?'bg-gold text-ink':'bg-maroon text-white'}`}>{saved.includes(selected.id)?<Check size={14}/>:<Bookmark size={14}/>} {saved.includes(selected.id)?'Saved':'Save Trail'}</button>
              <button onClick={shareTrail} className="inline-flex items-center gap-2 rounded-full border border-maroon/10 px-4 py-2.5 text-xs font-bold text-ink/65 hover:bg-maroon/5 hover:text-maroon"><Share2 size={14}/> Share Trail</button>
              <button onClick={()=>setCustomizing(v=>!v)} className="inline-flex items-center gap-2 rounded-full border border-maroon/10 px-4 py-2.5 text-xs font-bold text-ink/65 hover:bg-maroon/5 hover:text-maroon"><Sparkles size={14}/> Customize Trail</button>
              <button onClick={addStop} className="inline-flex items-center gap-2 rounded-full border border-maroon/10 px-4 py-2.5 text-xs font-bold text-ink/65 hover:bg-maroon/5 hover:text-maroon"><Plus size={14}/> Add Stop</button>
            </div>
            {customizing&&<div className="mt-4 rounded-2xl border border-gold/30 bg-[#FFF3D8] p-4 text-sm leading-6 text-ink/65 animate-pop"><div className="font-semibold text-maroon">Customize this journey</div><p className="mt-1">Use <b>Add Stop</b> to append an optional stop, or switch themes and regions above to change the route family. The app does not invent live events or operators.</p></div>}
          </div>
        </article>

        <TrailRouteMap trail={{...selected,stops:allSelectedStops}} activeStop={activeStop} onSelectStop={setActiveStop}/>
      </div>

      <div className="rounded-[2rem] border border-maroon/10 bg-white p-5 shadow-card md:p-7">
        <div className="flex items-end justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-maroon/65">Trail timeline</div><h3 className="mt-2 font-display text-3xl text-maroon">Places + cultural stories</h3></div><button onClick={()=>document.getElementById('trail-map')?.scrollIntoView({behavior:'smooth'})} className="hidden rounded-full border border-maroon/10 px-3 py-2 text-xs font-bold text-maroon sm:inline-flex"><RouteIcon size={14}/> View route</button></div>
        <div className="relative mt-6">
          <div className="absolute bottom-6 left-[14px] top-4 w-px bg-maroon/10"/>
          <div className="space-y-3">
            {allSelectedStops.map((s,index)=><button key={s.id} onClick={()=>setActiveStop(index)} className={`relative flex w-full gap-3 rounded-2xl p-3 text-left transition ${activeStop===index?'bg-maroon text-white shadow-md':'hover:bg-cream'}`}>
              <span className={`relative z-10 mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${activeStop===index?'bg-gold text-ink':'bg-cream text-maroon'}`}>{index+1}</span>
              <span className="min-w-0 flex-1"><span className={`block font-display text-xl ${activeStop===index?'text-white':'text-maroon'}`}>{s.name}</span><span className={`mt-0.5 block text-xs ${activeStop===index?'text-white/58':'text-ink/45'}`}>{s.district} · {s.time}</span></span>
              <ArrowRight size={15} className={`mt-2 ${activeStop===index?'text-white/65':'text-maroon/30'}`}/>
            </button>)}
          </div>
        </div>

        {stop&&<article className="mt-6 rounded-3xl border border-maroon/10 bg-cream p-5 animate-pop">
          <div className="flex items-start justify-between gap-4"><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-maroon/55">Stop {activeStop+1}</div><h4 className="mt-1 font-display text-3xl text-maroon">{stop.name}</h4><div className="mt-1 text-xs font-semibold text-ink/45">{stop.district} · {stop.time}</div></div><MapPin className="text-maroon" size={19}/></div>
          <p className="story-dropcap mt-4 text-sm leading-7 text-ink/65">{stop.story}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2"><div className="rounded-2xl bg-white p-3"><div className="flex items-center gap-2 text-xs font-bold text-maroon"><Timer size={14}/> Best time</div><p className="mt-1 text-xs leading-5 text-ink/55">{stop.bestTime}</p></div><div className="rounded-2xl bg-white p-3"><div className="flex items-center gap-2 text-xs font-bold text-maroon"><HeartHandshake size={14}/> Cultural etiquette</div><p className="mt-1 text-xs leading-5 text-ink/55">{stop.etiquette}</p></div></div>
          <StopActions stop={stop}/>
          <ImpactActions item={{name:stop.name,state:selected.region,district:stop.district,type:stop.theme}} compact />
        </article>}
      </div>
    </section>

    <section className="mt-8 grid gap-5 md:grid-cols-2">
      <article className="rounded-[2rem] border border-maroon/10 bg-white p-6 shadow-card"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-maroon/65"><Sparkles size={14}/> Featured traditions</div><div className="mt-4 flex flex-wrap gap-2">{selected.featuredTraditions.map(t=><span key={t} className="rounded-full bg-saffron/10 px-3 py-2 text-xs font-semibold text-maroon">{t}</span>)}</div><p className="mt-4 text-sm leading-6 text-ink/55">A trail works best when the tradition is connected to place, people and context—not treated as a checklist.</p></article>
      <article className="rounded-[2rem] border border-maroon/10 bg-white p-6 shadow-card"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-maroon/65"><Landmark size={14}/> Museums & cultural centres</div><p className="mt-3 text-sm leading-7 text-ink/55">{selected.museums}</p><div className="mt-4 text-xs font-semibold text-maroon">{selected.artisanExperience}</div></article>
    </section>

    <section className="mt-8 rounded-[2rem] bg-[#DDEBE9] p-7 md:p-10"><div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-maroon/65">Responsible tourism</div><h3 className="mt-2 font-display text-4xl text-maroon">Travel with context. Purchase with provenance.</h3><p className="mt-3 max-w-2xl text-sm leading-7 text-ink/60">Support local livelihoods through transparent purchasing, community-led experiences and respectful behaviour at sacred and working spaces. The trail does not endorse unverified vendors.</p></div><div className="flex flex-wrap gap-2 md:max-w-xs md:justify-end">{helpAction('Find official craft sources', `${selected.region} official handicrafts handloom cooperative`)}{helpAction('Find cultural venues', `${selected.region} cultural centre museum official`)}</div></div></section>
  </main>
}
