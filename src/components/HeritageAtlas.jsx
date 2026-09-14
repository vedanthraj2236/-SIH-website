import { useEffect, useMemo, useRef, useState } from 'react'
import { ComposableMap, Geography, Geographies } from 'react-simple-maps'
import IndiaMap from '@svg-maps/india'
import { ArrowLeft, ArrowRight, Compass, ExternalLink, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { regionBySlug, slugify, stateData } from '../data/states'
import { stateVisuals } from '../data/stateVisuals'
import { DISTRICT_HERITAGE, getDistrictProfile } from '../data/districtHeritage'
import { traditionById, TRADITIONS } from '../data/traditions'
import { STATE_MAPS, LAYER_META } from '../data/atlasMeta'

const INDIA_TOPO = 'https://raw.githubusercontent.com/AbhinavSwami28/india-official-geojson/main/india-states.topojson'
const stateTopo = slug => `https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/topojson/states/${slug}.json`
const stateName = geo => geo?.properties?.ST_NM || geo?.properties?.st_nm || geo?.properties?.STATE || geo?.properties?.name || ''
const districtName = geo => geo?.properties?.district || geo?.properties?.DISTRICT || geo?.properties?.DTNAME || geo?.properties?.name || ''
const SOUTH_DISTRICT_STATES = new Set(['andhra-pradesh','telangana','karnataka','kerala','tamil-nadu'])

const INDIA_LOCATIONS = IndiaMap.locations.map(location => ({
  ...location,
  slug: slugify(location.name),
}))

export default function HeritageAtlas({ standalone = false }) {
  const navigate = useNavigate()
  const [level, setLevel] = useState('india')
  const [selectedState, setSelectedState] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [layer, setLayer] = useState('Explore')
  const [mapNotice, setMapNotice] = useState('')
  const [hoverPoint, setHoverPoint] = useState(null)
  const mapFrameRef = useRef(null)

  const readyStates = useMemo(() => Object.keys(stateData), [])
  const stateHighlights = useMemo(() => {
    return readyStates.map(slug => {
      const data = stateData[slug]
      const visual = stateVisuals[slug]
      const districtCount = Object.keys(DISTRICT_HERITAGE[slug] || {}).length
      return { slug, name:data.state, count: data.festivals.length + data.danceForms.length + data.cuisine.length + data.artsCrafts.length + data.monuments.length, theme:visual?.theme || 'Living heritage', districtCount }
    })
  }, [readyStates])

  const districtSummary = selectedState ? Object.keys(DISTRICT_HERITAGE[selectedState.slug] || {}) : []
  const profile = selectedState && selectedDistrict ? getDistrictProfile(selectedState.slug, selectedDistrict) : null

  function openState(slug, nameOverride) {
    const name = nameOverride || regionBySlug[slug] || stateData[slug]?.state || slug
    setSelectedState({ slug, name, count: stateHighlights.find(s=>s.slug===slug)?.count || 0, theme:stateVisuals[slug]?.theme || 'Living heritage' })
    setSelectedDistrict(null)
    setHovered(null)
    setMapNotice('')
    setHoverPoint(null)
    setLevel('state')
  }
  function openDistrict(name) {
    setSelectedDistrict(name)
    setLevel('district')
    setMapNotice('')
    setHoverPoint(null)
  }
  function resetToIndia() {
    setLevel('india'); setSelectedState(null); setSelectedDistrict(null); setHovered(null); setMapNotice(''); setHoverPoint(null)
  }

  const districtEnabled = !!selectedState && SOUTH_DISTRICT_STATES.has(selectedState.slug)
  const geoUrl = level === 'district' ? stateTopo(selectedState?.slug || 'karnataka') : null
  const mapMeta = selectedState && districtEnabled ? STATE_MAPS[selectedState.slug] || { center:[78.5,22.5], scale:2700 } : { center:[78.7,22.6], scale:1160 }

  const visibleTraditions = useMemo(() => {
    if (!selectedState) return []
    return TRADITIONS.filter(t => slugify(t.state) === selectedState.slug || t.state === selectedState.name || t.state.includes(selectedState.name))
  }, [selectedState])

  const filters = ['Explore','Culture','Traditions at Risk','Heritage Trails','Artisans','Festivals']
  const layerTraditions = layer === 'Traditions at Risk' ? TRADITIONS.filter(t => ['At Risk','Declining','Critically Fading','Preservation Priority'].includes(t.status)) : visibleTraditions

  const activeLayerMeta = LAYER_META[layer] || { icon:'◉', description:`Explore ${layer.toLowerCase()} through the cultural atlas.` }

  useEffect(() => {
    const handler = (event) => { const next = event.detail?.category; if(next){ setLayer(next); setHovered(null); } };
    window.addEventListener('heritage-culture-filter', handler);
    return () => window.removeEventListener('heritage-culture-filter', handler);
  }, [])

  return <section id="atlas" className="relative overflow-hidden bg-cream">
    <div className="atlas-backdrop" />
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      {!standalone && <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-maroon/65"><Sparkles size={14}/> Digital cultural atlas</div>
          <h2 className="mt-3 font-display text-5xl leading-none text-ink md:text-7xl">Begin with <span className="text-maroon">India.</span><br/>Follow the story deeper.</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink/55">Explore the country as a living cultural atlas: India → State → District → Tradition. Each layer reveals another part of place, practice and memory.</p>
        </div>
        <div className="flex flex-wrap gap-2 rounded-3xl border border-maroon/10 bg-white/70 p-2 shadow-card backdrop-blur-xl">
          {filters.map(item => <button key={item} onClick={()=>{setLayer(item); if(item==='Traditions at Risk') document.getElementById('heritage-risk')?.scrollIntoView({behavior:'smooth'}); if(item==='Heritage Trails') navigate('/trails')}} className={`rounded-full px-4 py-2.5 text-xs font-bold ${layer===item?'bg-maroon text-white shadow-md':'text-ink/55 hover:bg-maroon/5 hover:text-maroon'}`}>{LAYER_META[item].icon} {item}</button>)}
        </div>
      </div>}
      {standalone && <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-gold"><Sparkles size={13}/> India Cultural Atlas</div>
        <div className="flex flex-wrap gap-1.5">{filters.map(item => <button key={item} onClick={()=>{setLayer(item); if(item==='Traditions at Risk') document.getElementById('heritage-risk')?.scrollIntoView({behavior:'smooth'}); if(item==='Heritage Trails') navigate('/trails')}} className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${layer===item?'bg-[#31488F] text-white':'border border-white/10 bg-white/5 text-cream/60 hover:bg-white/10 hover:text-gold'}`}>{LAYER_META[item].icon} {item}</button>)}</div>
      </div>}

      <div className={`mt-2 grid gap-5 ${standalone && level === 'india' ? 'lg:grid-cols-1' : 'lg:grid-cols-[1.65fr_.8fr]'}`}>
        <div ref={mapFrameRef} className="relative min-h-[640px] overflow-hidden rounded-[2rem] border border-maroon/10 bg-[#EEF4F3] shadow-warm">
          <div className="atlas-lines pointer-events-none absolute inset-0"/>
          <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-maroon/10 bg-white/88 px-3 py-2 text-xs font-semibold shadow-md backdrop-blur">
            <span className="text-maroon">India</span>{selectedState&&<><ArrowRight size={12}/><span>{selectedState.name}</span></>}{selectedDistrict&&<><ArrowRight size={12}/><span>{selectedDistrict}</span></>}
          </div>
          <div className="absolute bottom-4 left-4 z-20 rounded-2xl border border-maroon/10 bg-white/88 p-3 text-xs text-ink/55 shadow-md backdrop-blur">
            <div className="font-bold text-ink">{layer}</div><div className="mt-1">{activeLayerMeta.description}</div>
          </div>
          {(level === 'india' || (level === 'state' && !districtEnabled)) ? (
            <svg
              viewBox={IndiaMap.viewBox}
              role="img"
              aria-label="Interactive map of India"
              className="atlas-map h-[640px] w-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
              onMouseLeave={() => { setHovered(null); setHoverPoint(null) }}
            >
              <defs>
                <linearGradient id="warmStateLocal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#e7b86d"/><stop offset=".48" stopColor="#d88954"/><stop offset="1" stopColor="#a33b32"/>
                </linearGradient>
                <linearGradient id="warmHoverLocal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f4d28e"/><stop offset=".5" stopColor="#d8674f"/><stop offset="1" stopColor="#263A73"/>
                </linearGradient>
                <filter id="atlasShadowLocal" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#263A73" floodOpacity=".17"/></filter>
              </defs>
              <g transform="translate(0,0)">
                {INDIA_LOCATIONS.map(location => {
                  const raw = location.name
                  const slug = location.slug
                  const isHovered = hovered === raw
                  const isSelected = level === 'state' && selectedState?.slug === slug
                  const isCurated = !!stateData[slug] || SOUTH_DISTRICT_STATES.has(slug)
                  const opacity = level === 'india' ? (isCurated ? 1 : .66) : (isSelected ? 1 : .16)
                  const handleClick = () => {
                    if (level === 'india') {
                      if (stateData[slug] || SOUTH_DISTRICT_STATES.has(slug)) openState(slug, stateData[slug]?.state || regionBySlug[slug] || raw)
                      else { setHovered(raw); setMapNotice(`${raw} is mapped, but its curated cultural profile is coming soon.`) }
                    } else if (level === 'state') {
                      setHovered(raw)
                      setMapNotice("District exploration is currently focused on South India. Open this state's cultural profile from the panel instead.")
                    }
                  }
                  return <path
                    key={location.id}
                    d={location.path}
                    tabIndex={-1}
                    focusable="false"
                    aria-label={raw}
                    onMouseEnter={event => {
                      setHovered(raw)
                      setMapNotice('')
                      const rect = mapFrameRef.current?.getBoundingClientRect()
                      if (rect) setHoverPoint({x:event.clientX-rect.left,y:event.clientY-rect.top})
                    }}
                    onMouseMove={event => {
                      const rect = mapFrameRef.current?.getBoundingClientRect()
                      if (rect) setHoverPoint({x:event.clientX-rect.left,y:event.clientY-rect.top})
                    }}
                    onClick={handleClick}
                    style={{
                      fill: isSelected || isHovered ? 'url(#warmHoverLocal)' : 'url(#warmStateLocal)',
                      stroke: '#FFFDF7',
                      strokeWidth: isHovered || isSelected ? 1.8 : 0.9,
                      filter: 'url(#atlasShadowLocal)',
                      cursor: 'pointer',
                      opacity,
                      outline: 'none',
                      vectorEffect: 'non-scaling-stroke',
                    }}
                  />
                })}
              </g>
            </svg>
          ) : (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ rotate:[-83,0,0], scale:mapMeta.scale, center:mapMeta.center }}
              className="atlas-map h-[640px] w-full"
              width={960}
              height={640}
            >
              <defs>
                <linearGradient id="warmStateDistrict" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e7b86d"/><stop offset=".48" stopColor="#d88954"/><stop offset="1" stopColor="#a33b32"/></linearGradient>
                <linearGradient id="warmHoverDistrict" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4d28e"/><stop offset=".5" stopColor="#d8674f"/><stop offset="1" stopColor="#263A73"/></linearGradient>
                <filter id="atlasShadowDistrict" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#263A73" floodOpacity=".17"/></filter>
              </defs>
              <Geographies geography={geoUrl}>
                {({geographies}) => geographies.map(geo => {
                  const raw = districtName(geo)
                  const isHovered = hovered === raw
                  const isActive = selectedDistrict === raw
                  const handleClick = () => { if (raw) openDistrict(raw) }
                  return <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(event)=>{setHovered(raw); const rect=mapFrameRef.current?.getBoundingClientRect(); if(rect) setHoverPoint({x:event.clientX-rect.left,y:event.clientY-rect.top})}}
                    onMouseMove={(event)=>{const rect=mapFrameRef.current?.getBoundingClientRect(); if(rect) setHoverPoint({x:event.clientX-rect.left,y:event.clientY-rect.top})}}
                    onMouseLeave={()=>{setHovered(null); setHoverPoint(null)}}
                    onClick={handleClick}
                    style={{default:{fill:isActive?'url(#warmHoverDistrict)':isHovered?'url(#warmHoverDistrict)':'url(#warmStateDistrict)',stroke:'#FFFDF7',strokeWidth:1.1,outline:'none',filter:'url(#atlasShadowDistrict)',cursor:'pointer'},hover:{fill:'url(#warmHoverDistrict)',stroke:'#1E2F61',strokeWidth:2,outline:'none',filter:'url(#atlasShadowDistrict)',cursor:'pointer'},pressed:{fill:'url(#warmHoverDistrict)',stroke:'#17264F',strokeWidth:2.2,outline:'none'}}}
                    aria-label={raw || 'District'}
                  />
                })}
              </Geographies>
            </ComposableMap>
          )}

          {hovered && hoverPoint && <div className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full animate-pop" style={{left:hoverPoint.x, top:Math.max(76, hoverPoint.y-12)}}><div className="rounded-2xl border border-maroon/10 bg-white/96 px-4 py-2.5 text-center shadow-xl backdrop-blur"><div className="text-[9px] font-bold uppercase tracking-[.24em] text-maroon/55">{level==='india' ? 'State' : 'District'}</div><div className="mt-0.5 font-display text-xl text-maroon">{hovered}</div>{level==='india' && <div className="text-[10px] text-ink/50">Click to explore</div>}</div></div>}
          {mapNotice && <div className="absolute bottom-4 left-1/2 z-20 w-[min(92%,34rem)] -translate-x-1/2 rounded-2xl border border-gold/30 bg-[#263A73]/95 px-4 py-3 text-center text-xs font-semibold text-cream shadow-xl backdrop-blur">{mapNotice}</div>}
          {level!=='india' && <button onClick={resetToIndia} className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-maroon shadow-lg hover:-translate-y-0.5"><ArrowLeft size={14}/> Back to India</button>}
        </div>

        <aside className={`${standalone && level === 'india' ? 'hidden' : ''} relative overflow-hidden rounded-[2rem] border border-maroon/10 bg-white shadow-card`}> 
          <div className="border-b border-maroon/10 bg-[#FFFDF7] px-6 py-6">
            <div className="text-xs font-bold uppercase tracking-[.2em] text-maroon/65">{level==='india'?'Map discovery':level==='state'?'State layer':'District layer'}</div>
            {level==='india' && <><h3 className="mt-2 font-display text-3xl text-ink">Choose a place to go deeper.</h3><p className="mt-2 text-sm leading-6 text-ink/55">Hover for highlights. Click a state to reveal district-level exploration.</p></>}
            {level!=='india' && <><h3 className="mt-2 font-display text-3xl text-ink">{selectedDistrict || selectedState?.name}</h3><p className="mt-2 text-sm leading-6 text-ink/55">{selectedDistrict ? (profile?.region || `${selectedState.name} cultural landscape`) : 'Districts become the next layer of discovery.'}</p></>}
          </div>

          {level==='india' && <div className="p-5">
            <div className="grid grid-cols-2 gap-3">
              {stateHighlights.slice(0,6).map(s=><button key={s.slug} onClick={()=>openState(s.slug,s.name)} className="group rounded-2xl border border-maroon/10 bg-cream px-4 py-4 text-left hover:-translate-y-1 hover:shadow-card"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-maroon/50">{s.districtCount} district hubs</div><div className="mt-1 font-display text-xl text-maroon">{s.name}</div><div className="mt-1 text-xs text-ink/50">{s.count} documented cultural items</div></button>)}
            </div>
            <div className="mt-5 rounded-2xl bg-maroon p-5 text-cream"><div className="flex items-center gap-2 font-bold"><Compass size={17} className="text-gold"/> Atlas rule</div><p className="mt-2 text-sm leading-6 text-cream/65">Every click should answer one question: “What does this place mean to the people who live here?”</p></div>
          </div>}

          {level==='state' && <div className="p-5">
            {districtEnabled ? <div className="grid gap-2">
              {Array.from(new Set([...districtSummary.map(k=>k.replace(/-/g,' ')), ...(stateData[selectedState.slug] ? ['Capital / cultural core'] : [])])).map(name=><button key={name} onClick={()=>openDistrict(name.split(' ').map((x,i)=>i?x[0]?.toUpperCase()+x.slice(1):x[0]?.toUpperCase()+x.slice(1)).join(' '))} className="group flex items-center justify-between rounded-2xl border border-maroon/10 bg-cream/70 px-4 py-3 text-left hover:-translate-y-0.5 hover:bg-white hover:shadow-card"><span className="font-semibold capitalize">{name}</span><ArrowRight size={15} className="text-maroon/35 transition group-hover:translate-x-1 group-hover:text-maroon"/></button>)}
              <div className="mt-2 rounded-2xl border border-dashed border-maroon/15 p-4 text-xs text-ink/50">South India is the current district-level focus. Curated cultural dossiers are expanded district by district.</div>
            </div> : <div className="rounded-2xl border border-maroon/10 bg-cream p-5">
              <div className="text-[10px] font-bold uppercase tracking-[.18em] text-maroon/55">State profile</div>
              <div className="mt-2 font-display text-3xl text-maroon">{selectedState.name}</div>
              <p className="mt-3 text-sm leading-6 text-ink/55">Explore this state at the cultural-profile level. District-by-district map exploration is currently focused on South India: Andhra Pradesh, Telangana, Karnataka, Kerala and Tamil Nadu.</p>
              <button onClick={()=>navigate(`/state/${selectedState.slug}`)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-maroon px-4 py-2.5 text-xs font-bold text-white">Open state profile <ArrowRight size={14}/></button>
            </div>}
            <div className="mt-5 rounded-2xl border border-maroon/10 bg-white p-4"><div className="flex flex-wrap gap-2">{['Food','Dance','Music','Textiles','Crafts','Festivals','Architecture','Folklore','Heritage Sites','Communities'].map(x=><span key={x} className="rounded-full bg-saffron/10 px-3 py-1.5 text-xs font-semibold text-maroon">{x}</span>)}</div></div>
          </div>}

          {level==='district' && <div className="p-5">
            {profile ? <>
              <div className="grid grid-cols-2 gap-3">
                {profile.highlights.map(item=><div key={item} className="rounded-2xl border border-maroon/10 bg-cream p-3"><div className="text-xs font-semibold text-maroon">{item}</div></div>)}
              </div>
              <div className="mt-5"><div className="text-xs font-bold uppercase tracking-[.18em] text-maroon/65">Traditions here</div><div className="mt-3 grid gap-2">{profile.traditions.map(name=>{ const match=Object.values(traditionById).find(t=>t.name.toLowerCase()===name.toLowerCase() || name.toLowerCase().includes(t.name.toLowerCase().split(' ')[0])); return <button key={name} onClick={()=>match && navigate(`/tradition/${match.id}`)} className="flex items-center justify-between rounded-2xl border border-maroon/10 bg-white px-4 py-3 text-left shadow-card hover:-translate-y-0.5"><span className="font-semibold">{name}</span>{match&&<ArrowRight size={14} className="text-maroon/40"/>}</button>})}</div></div>
              <div className="mt-5 rounded-2xl bg-maroon p-5 text-cream"><div className="font-display text-2xl text-gold">Discover Nearby Heritage</div><p className="mt-2 text-sm leading-6 text-cream/65">Open a map search for {selectedDistrict}, {selectedState.name} and explore museums, heritage sites and cultural places nearby.</p><button onClick={()=>window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedDistrict}, ${selectedState.name}, India`)}`,'_blank','noopener,noreferrer')} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-bold text-ink hover:-translate-y-0.5">Open nearby map <ExternalLink size={14}/></button></div>
            </> : <div className="rounded-2xl border border-maroon/10 bg-cream p-5"><div className="font-display text-2xl text-maroon">District profile expanding</div><p className="mt-2 text-sm leading-6 text-ink/55">The geographic layer is live. This district is not yet part of the curated cultural dossier, so Indian Heritage keeps the interaction safe and transparent instead of inventing local details.</p><button onClick={()=>navigate(`/state/${selectedState.slug}`)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-maroon px-4 py-2.5 text-xs font-bold text-white">Explore state profile <ArrowRight size={14}/></button></div>}

            <div className="mt-5 border-t border-maroon/10 pt-5"><div className="text-xs font-bold uppercase tracking-[.18em] text-maroon/65">Culture layer</div><div className="mt-3 flex flex-wrap gap-2">{['Food','Dance','Music','Textiles','Crafts','Festivals','Architecture','Folklore','Heritage Sites','Communities'].map(x=><span key={x} className="rounded-full border border-maroon/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink/55">{x}</span>)}</div></div>
          </div>}
        </aside>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[['12','curated tradition profiles'],['10','featured state layers'],['30+','South India district hubs'],['10','cultural lenses']].map(([value,label])=><div key={label} className="rounded-2xl border border-maroon/10 bg-white/70 p-4"><div className="font-display text-3xl text-maroon">{value}</div><div className="mt-1 text-xs text-ink/50">{label}</div></div>)}
      </div>
    </div>
  </section>
}
