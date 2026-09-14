import { useEffect, useMemo, useState } from 'react'
import { ComposableMap, Geography, Geographies, ZoomableGroup } from 'react-simple-maps'
import { ArrowLeft, ArrowRight, Compass, ExternalLink, MapPin, Sparkles } from 'lucide-react'
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

function StateBubble({ state, onOpen }) {
  if (!state) return null
  return <div className="atlas-bubble atlas-bubble-right animate-pop">
    <div className="text-[10px] font-bold uppercase tracking-[.22em] text-maroon/55">State discovery</div>
    <div className="mt-1 font-display text-3xl text-maroon">{state.name}</div>
    <div className="mt-2 text-sm text-ink/60">{state.count} documented traditions · {state.theme}</div>
    <div className="mt-4 flex items-center gap-2">
      <button onClick={onOpen} className="inline-flex items-center gap-2 rounded-full bg-maroon px-4 py-2 text-xs font-bold text-white hover:-translate-y-0.5">Open state <ArrowRight size={14}/></button>
      {stateVisuals[state.slug] && <img src={stateVisuals[state.slug].image} onError={e=>{e.currentTarget.src=stateVisuals[state.slug].fallback}} alt={`Cultural scene associated with ${state.name}`} className="h-12 w-16 rounded-xl object-cover"/>}
    </div>
  </div>
}

export default function HeritageAtlas() {
  const navigate = useNavigate()
  const [level, setLevel] = useState('india')
  const [selectedState, setSelectedState] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [layer, setLayer] = useState('Explore')
  const [mapZoom, setMapZoom] = useState(1)

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
    setLevel('state')
    setMapZoom(1)
  }
  function openDistrict(name) {
    setSelectedDistrict(name)
    setLevel('district')
  }
  function resetToIndia() {
    setLevel('india'); setSelectedState(null); setSelectedDistrict(null); setHovered(null); setMapZoom(1)
  }

  const geoUrl = level === 'india' ? INDIA_TOPO : stateTopo(selectedState?.slug || 'karnataka')
  const mapMeta = selectedState ? STATE_MAPS[selectedState.slug] || { center:[78.5,22.5], scale:2700 } : { center:[78.7,22.6], scale:1160 }

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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-maroon/65"><Sparkles size={14}/> Digital cultural atlas</div>
          <h2 className="mt-3 font-display text-5xl leading-none text-ink md:text-7xl">Begin with <span className="text-maroon">India.</span><br/>Follow the story deeper.</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink/55">Explore the country as a living cultural atlas: India → State → District → Tradition. Every zoom reveals another layer of place, practice and memory.</p>
        </div>
        <div className="flex flex-wrap gap-2 rounded-3xl border border-maroon/10 bg-white/70 p-2 shadow-card backdrop-blur-xl">
          {filters.map(item => <button key={item} onClick={()=>{setLayer(item); if(item==='Traditions at Risk') document.getElementById('heritage-risk')?.scrollIntoView({behavior:'smooth'}); if(item==='Heritage Trails') navigate('/trails')}} className={`rounded-full px-4 py-2.5 text-xs font-bold ${layer===item?'bg-maroon text-white shadow-md':'text-ink/55 hover:bg-maroon/5 hover:text-maroon'}`}>{LAYER_META[item].icon} {item}</button>)}
        </div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.65fr_.8fr]">
        <div className="relative min-h-[640px] overflow-hidden rounded-[2rem] border border-maroon/10 bg-[#EEF4F3] shadow-warm">
          <div className="atlas-lines pointer-events-none absolute inset-0"/>
          <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-maroon/10 bg-white/88 px-3 py-2 text-xs font-semibold shadow-md backdrop-blur">
            <span className="text-maroon">India</span>{selectedState&&<><ArrowRight size={12}/><span>{selectedState.name}</span></>}{selectedDistrict&&<><ArrowRight size={12}/><span>{selectedDistrict}</span></>}
          </div>
          <div className="absolute right-4 top-4 z-20 flex overflow-hidden rounded-2xl border border-maroon/10 bg-white/90 shadow-lg backdrop-blur">
            <button onClick={()=>setMapZoom(z=>Math.min(2.8, z+.25))} className="grid h-10 w-10 place-items-center text-lg font-bold text-maroon hover:bg-maroon hover:text-white">+</button>
            <button onClick={()=>setMapZoom(z=>Math.max(1, z-.25))} className="grid h-10 w-10 place-items-center border-l border-maroon/10 text-lg font-bold text-maroon hover:bg-maroon hover:text-white">−</button>
          </div>
          <div className="absolute bottom-4 left-4 z-20 rounded-2xl border border-maroon/10 bg-white/88 p-3 text-xs text-ink/55 shadow-md backdrop-blur">
            <div className="font-bold text-ink">{layer}</div><div className="mt-1">{activeLayerMeta.description}</div>
          </div>
          <ComposableMap projection="geoMercator" projectionConfig={{rotate:[-83,0,0], scale:mapMeta.scale, center:mapMeta.center}} className={`atlas-map h-[640px] w-full ${level!=='india'?'atlas-zoom-in':''}`}>
            <defs>
              <linearGradient id="warmState" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e7b86d"/><stop offset=".48" stopColor="#d88954"/><stop offset="1" stopColor="#a33b32"/></linearGradient>
              <linearGradient id="warmHover" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4d28e"/><stop offset=".5" stopColor="#d8674f"/><stop offset="1" stopColor="#263A73"/></linearGradient>
              <filter id="atlasShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#263A73" floodOpacity=".17"/></filter>
            </defs>
            <ZoomableGroup center={level==='india'?[78.7,22.6]:mapMeta.center} zoom={mapZoom} minZoom={1} maxZoom={2.8} wheelZoom onMove={({zoom})=>setMapZoom(zoom)}>
              <Geographies geography={geoUrl}>
                {({geographies}) => geographies.map(geo => {
                  const raw = level==='india' ? stateName(geo) : districtName(geo)
                  const slug = slugify(raw)
                  const isHovered = hovered === raw
                  const isActive = level==='state' && selectedDistrict === raw
                  return <Geography key={geo.rsmKey} geography={geo} tabIndex={0}
                    onMouseEnter={()=>setHovered(raw)} onMouseLeave={()=>setHovered(null)}
                    onFocus={()=>setHovered(raw)} onBlur={()=>setHovered(null)}
                    onClick={()=>level==='india' ? (stateData[slug] ? openState(slug, raw) : navigate(`/state/${slug}`)) : openDistrict(raw)}
                    style={{default:{fill: isActive?'url(#warmHover)':isHovered?'url(#warmHover)':'url(#warmState)',stroke:'#FFFDF7',strokeWidth:1.2,outline:'none',filter:'url(#atlasShadow)',cursor:'pointer',opacity:level==='india' && !stateData[slug] ? .42 : 1},hover:{fill:'url(#warmHover)',stroke:'#1E2F61',strokeWidth:2.2,outline:'none',filter:'url(#atlasShadow)',cursor:'pointer'},pressed:{fill:'url(#warmHover)',stroke:'#17264F',strokeWidth:2.4,outline:'none'}}}
                    aria-label={raw || 'Map region'}
                  />
                })}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {hovered && level==='india' && <StateBubble state={stateHighlights.find(s=>s.name===hovered)} onOpen={()=>openState(slugify(hovered), hovered)}/>}
          {hovered && level==='state' && <div className="atlas-bubble atlas-bubble-right animate-pop"><div className="text-[10px] font-bold uppercase tracking-[.22em] text-maroon/55">District</div><div className="mt-1 font-display text-2xl text-maroon">{hovered}</div><div className="mt-2 text-sm text-ink/60">Click to reveal local traditions, food, performance, crafts and heritage sites.</div></div>}
          {level!=='india' && <button onClick={resetToIndia} className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-maroon shadow-lg hover:-translate-y-0.5"><ArrowLeft size={14}/> Back to India</button>}
        </div>

        <aside className="relative overflow-hidden rounded-[2rem] border border-maroon/10 bg-white shadow-card">
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
            <div className="grid gap-2">
              {Array.from(new Set([...districtSummary.map(k=>k.replace(/-/g,' ')), ...(stateData[selectedState.slug] ? ['Capital / cultural core'] : [])])).map(name=><button key={name} onClick={()=>openDistrict(name.split(' ').map((x,i)=>i?x[0]?.toUpperCase()+x.slice(1):x[0]?.toUpperCase()+x.slice(1)).join(' '))} className="group flex items-center justify-between rounded-2xl border border-maroon/10 bg-cream/70 px-4 py-3 text-left hover:-translate-y-0.5 hover:bg-white hover:shadow-card"><span className="font-semibold capitalize">{name}</span><ArrowRight size={15} className="text-maroon/35 transition group-hover:translate-x-1 group-hover:text-maroon"/></button>)}
              <div className="mt-2 rounded-2xl border border-dashed border-maroon/15 p-4 text-xs text-ink/50">The district map contains the full administrative layer. Curated cultural dossiers are being expanded district by district.</div>
            </div>
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
        {[['12','curated tradition profiles'],['10','featured state layers'],['30+','district cultural hubs'],['10','cultural lenses']].map(([value,label])=><div key={label} className="rounded-2xl border border-maroon/10 bg-white/70 p-4"><div className="font-display text-3xl text-maroon">{value}</div><div className="mt-1 text-xs text-ink/50">{label}</div></div>)}
      </div>
    </div>
  </section>
}
