import { BookOpen, ExternalLink, HeartHandshake, MapPin, PlayCircle, ShoppingBag } from 'lucide-react'

const OFFICIAL_HANDICRAFTS = 'https://indian.handicrafts.gov.in/en'
const MINISTRY_CULTURE = 'https://www.indiaculture.gov.in/'

function searchUrl(query, domain='') {
  const q = domain ? `${query} site:${domain}` : query
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`
}

function actionConfig(item, action) {
  const name = item.name || item.tradition || 'this tradition'
  const place = [item.district, item.state].filter(Boolean).join(', ')
  const craftLike = /craft|weav|textile|handloom|printing|embroidery|instrument|puppet/i.test(`${item.type} ${name}`)
  const cultural = `${name} ${place}`.trim()
  const configs = {
    LEARN: {
      icon: BookOpen, label: 'Learn', tone: 'bg-white text-maroon border-maroon/10',
      href: searchUrl(`${cultural} cultural heritage history origin meaning official`),
      source: 'General discovery • verify against cited cultural sources',
    },
    WATCH: {
      icon: PlayCircle, label: 'Watch', tone: 'bg-white text-maroon border-maroon/10',
      href: searchUrl(`${cultural} documentary demonstration interview performance`),
      source: 'General discovery • check the creator and context before sharing',
    },
    VISIT: {
      icon: MapPin, label: 'Visit', tone: 'bg-white text-maroon border-maroon/10',
      href: searchUrl(`${cultural} museum cultural centre performance workshop heritage`),
      source: 'General discovery • confirm current access, timing and community protocols',
    },
    BUY: {
      icon: ShoppingBag, label: 'Buy', tone: 'bg-saffron text-ink border-saffron/20',
      href: craftLike ? OFFICIAL_HANDICRAFTS : searchUrl(`${cultural} authentic responsible products artisan cooperative`),
      source: craftLike ? 'Verified government craft portal • Development Commissioner (Handicrafts), Ministry of Textiles' : 'General recommendation • verify seller provenance before purchasing',
    },
    SUPPORT: {
      icon: HeartHandshake, label: 'Support', tone: 'bg-maroon text-white border-maroon',
      href: MINISTRY_CULTURE,
      source: 'Verified government source • Ministry of Culture, Government of India',
    },
  }
  return configs[action]
}

export default function ImpactActions({ item, compact=false, title='Turn discovery into action', className='' }) {
  const actions = ['LEARN','WATCH','VISIT','BUY','SUPPORT']
  const safeItem = item || {}
  return <section className={`${compact ? 'mt-4' : 'mt-8'} ${className}`} aria-label={`${title} for ${safeItem.name || safeItem.tradition || 'heritage'}`}>
    {!compact && <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-[10px] font-bold uppercase tracking-[.2em] text-maroon/60">Real-world impact</div><h3 className="mt-1 font-display text-3xl text-maroon">{title}</h3></div><div className="text-xs text-ink/45">Community-first • responsible participation</div></div>}
    <div className={`${compact ? 'grid grid-cols-5 gap-1.5' : 'grid gap-3 sm:grid-cols-2 lg:grid-cols-5'}`}>
      {actions.map(action=>{
        const c = actionConfig(safeItem, action); const Icon=c.icon
        return <a key={action} href={c.href} target="_blank" rel="noopener noreferrer" className={`${compact ? 'px-2 py-2' : 'px-4 py-4'} group rounded-2xl border ${c.tone} transition hover:-translate-y-1 hover:shadow-warm`}>
          <div className="flex items-center justify-between gap-2"><span className={`${compact ? 'text-[9px]' : 'text-[10px]'} font-bold uppercase tracking-[.15em]`}>{c.label}</span><Icon size={compact ? 13 : 17} className="opacity-75 transition group-hover:scale-110"/></div>
          {!compact && <><div className="mt-2 text-sm font-semibold text-ink/70">{action==='LEARN'?'History & context':action==='WATCH'?'Documentaries & demonstrations':action==='VISIT'?'Places & experiences':action==='BUY'?'Responsible purchasing':'Preservation & community support'}</div><div className="mt-2 flex items-center gap-1 text-[10px] leading-4 text-ink/40"><ExternalLink size={10}/> {c.source}</div></>}
        </a>
      })}
    </div>
    {!compact && <p className="mt-3 text-xs leading-5 text-ink/45">Indian Heritage does not endorse unverified vendors or claim that a link represents a community. Purchasing and visit suggestions are starting points; confirm provenance, consent, accessibility and current conditions before acting.</p>}
  </section>
}
