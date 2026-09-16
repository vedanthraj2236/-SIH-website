import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { regionBySlug, slugify } from '../data/states'
import { stateVisuals } from '../data/stateVisuals'

const GEO_URL = 'https://raw.githubusercontent.com/AbhinavSwami28/india-official-geojson/main/india-states.topojson'
const resolveName = (geo) => geo?.properties?.ST_NM || geo?.properties?.STATE || geo?.properties?.name || geo?.properties?.NAME_1 || ''

export default function IndiaMap() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(null)
  const [imageErrors, setImageErrors] = useState({})
  const [zoom, setZoom] = useState(1)
  const patternVisuals = useMemo(() => Object.entries(stateVisuals), [])

  function imageFor(slug) {
    const visual = stateVisuals[slug]
    if (!visual) return null
    return visual.image && !imageErrors[slug] ? visual.image : visual.fallback
  }

  const changeZoom = (delta) => setZoom((value) => Math.min(2.7, Math.max(1, Number((value + delta).toFixed(2)))))

  return <div className="relative min-h-[74vh] w-full overflow-hidden rounded-[2.5rem] bg-transparent md:min-h-[82vh]">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-[15%] top-[18%] h-56 w-56 rounded-full bg-saffron/20 blur-3xl map-glow"/>
      <div className="absolute right-[16%] top-[12%] h-64 w-64 rounded-full bg-gold/20 blur-3xl map-glow"/>
      <div className="absolute left-1/2 top-1/2 h-[70%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/65 blur-3xl"/>
      <div className="absolute inset-0 map-paper opacity-45"/>
    </div>

    <div className="absolute right-4 top-4 z-20 flex overflow-hidden rounded-2xl border border-maroon/10 bg-white/85 shadow-lg backdrop-blur-md">
      <button type="button" onClick={()=>changeZoom(.25)} className="grid h-11 w-11 place-items-center text-xl font-semibold text-maroon hover:bg-maroon hover:text-white" aria-label="Zoom in">+</button>
      <button type="button" onClick={()=>changeZoom(-.25)} className="grid h-11 w-11 place-items-center border-l border-maroon/10 text-xl font-semibold text-maroon hover:bg-maroon hover:text-white" aria-label="Zoom out">−</button>
    </div>

    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ rotate: [-83, 0, 0], scale: 1160, center: [0, 22.8] }}
      className="relative z-[1] h-[74vh] min-h-[560px] max-h-[940px] w-full md:h-[82vh]"
    >
      <defs>
        <filter id="soft-map-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="11" stdDeviation="9" floodColor="#263A73" floodOpacity=".18"/></filter>
        {patternVisuals.map(([slug, visual]) => <pattern key={slug} id={`state-photo-${slug}`} patternUnits="objectBoundingBox" width="1" height="1">
          <image href={imageFor(slug)} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" onError={() => setImageErrors((errors) => ({ ...errors, [slug]: true }))}/>
          <rect x="0" y="0" width="100%" height="100%" fill="#fff" opacity=".08"/>
        </pattern>)}
        <linearGradient id="map-fallback" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E9C98A"/><stop offset=".55" stopColor="#D9A45A"/><stop offset="1" stopColor="#176B67"/></linearGradient>
      </defs>
      <ZoomableGroup center={[78.7, 22.6]} zoom={zoom} minZoom={1} maxZoom={2.7} wheelZoom={true} onMove={({ zoom: nextZoom }) => setZoom(nextZoom)}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) => geographies.map((geo) => {
            const raw = resolveName(geo)
            const slug = slugify(raw)
            const label = regionBySlug[slug] || raw
            const visual = stateVisuals[slug]
            const ready = Boolean(visual)
            const photoPattern = visual?.image && !imageErrors[slug] ? `url(#state-photo-${slug})` : (visual ? `url(#state-photo-${slug})` : 'url(#map-fallback)')
            const isHovered = hovered?.slug === slug
            return <Geography key={geo.rsmKey} geography={geo}
              onMouseEnter={() => setHovered({ name: label, slug })}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered({ name: label, slug })}
              onBlur={() => setHovered(null)}
              onClick={() => label && navigate(`/state/${slug}`)}
              style={{
                default:{fill:photoPattern,stroke:'#FFFDF7',strokeWidth:1.1,outline:'none',vectorEffect:'non-scaling-stroke',opacity:ready?1:.48,filter:'url(#soft-map-shadow)'},
                hover:{fill:photoPattern,stroke:'#263A73',strokeWidth:2.4,outline:'none',cursor:'pointer',filter:'url(#soft-map-shadow)',opacity:1},
                pressed:{fill:photoPattern,stroke:'#17264F',strokeWidth:2.6,outline:'none',filter:'url(#soft-map-shadow)'}
              }}
              className={isHovered?'map-region-hover':''}
              tabIndex={0}
              aria-label={label || 'Indian region'} />
          })}
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>

    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 px-4 sm:px-8">
      {hovered ? <div className="mx-auto flex max-w-4xl items-end justify-between gap-4">
        <div className="rounded-[1.5rem] border border-white/70 bg-white/90 px-4 py-3 shadow-2xl backdrop-blur-md animate-pop sm:px-5">
          <div className="text-[10px] font-bold uppercase tracking-[.24em] text-maroon/55">Region</div>
          <div className="mt-1 font-display text-2xl text-maroon sm:text-3xl">{hovered.name}</div>
          <div className="mt-1 text-xs text-ink/55">{stateVisuals[hovered.slug]?.theme || 'Explore traditions, stories and heritage.'}</div>
        </div>
        {stateVisuals[hovered.slug]&&<img src={imageFor(hovered.slug)} alt={`Cultural scene from ${hovered.name}`} className="hidden h-24 w-32 rounded-2xl border border-white/70 object-cover shadow-2xl sm:block" onError={()=>setImageErrors((errors)=>({...errors,[hovered.slug]:true}))}/>}</div>
      : <div className="mx-auto flex max-w-3xl justify-center"><span className="rounded-full border border-maroon/10 bg-white/85 px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-maroon shadow-lg backdrop-blur-md">Hover a region • scroll to zoom • click to explore</span></div>}
    </div>
  </div>
}
