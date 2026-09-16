import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { slugify } from '../data/states'
import { stateVisuals } from '../data/stateVisuals'

export default function StateCard({ name, data }) {
  const visual = stateVisuals[slugify(name)]
  return <Link to={`/state/${slugify(name)}`} className="group relative overflow-hidden rounded-3xl border border-maroon/10 bg-white/90 shadow-card transition duration-300 hover:-translate-y-2 hover:shadow-warm">
    <div className="relative h-44 overflow-hidden bg-saffron/10">
      {visual ? <img src={visual.image} alt={`Traditional ${name} cultural scene showing ${visual.theme}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" onError={(e) => { e.currentTarget.src = visual.fallback }} /> : <div className="grid h-full place-items-center text-4xl">🇮🇳</div>}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4 pt-12"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-white/80"><MapPin size={13}/> Bharat</div><h3 className="mt-1 font-display text-2xl text-white">{name}</h3></div>
      <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-cream/90 text-maroon shadow-lg transition group-hover:rotate-6 group-hover:bg-maroon group-hover:text-white"><ArrowUpRight size={18}/></span>
    </div>
    <div className="p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-ink/70">{data ? data.capital : 'Content coming soon'}</p><p className="mt-1 text-xs text-ink/45">{visual?.theme || 'Cultural profile'}</p></div><Sparkles size={16} className="text-gold"/></div>{data && <div className="mt-4 flex flex-wrap gap-2">{data.danceForms.slice(0, 2).map((x) => <span key={x} className="rounded-full bg-saffron/10 px-3 py-1 text-xs text-maroon">{x}</span>)}{data.festivals[0]?.name && <span className="rounded-full bg-leaf/10 px-3 py-1 text-xs text-leaf">{data.festivals[0].name}</span>}</div>}</div>
  </Link>
}
