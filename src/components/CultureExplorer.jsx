import { useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, Compass, Heart, MapPinned, Sparkles, UtensilsCrossed } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { stateData } from '../data/states'
import { DISTRICT_HERITAGE } from '../data/districtHeritage'
import { TRADITIONS } from '../data/traditions'
import { stateVisuals } from '../data/stateVisuals'

const CATEGORIES = [
  ['🍛','Food','Cuisine, ingredients, foodways and festive dishes'],
  ['💃','Dance','Dance, performance and embodied storytelling'],
  ['🎵','Music','Folk, classical and regional sound traditions'],
  ['🧵','Textiles','Weaving, embroidery, printing and dress'],
  ['🎨','Crafts','Making traditions, materials and artisan skills'],
  ['🛕','Architecture','Sacred, civic, palace and historic landscapes'],
  ['🎉','Festivals','Festivals, ritual calendars and public celebration'],
  ['📖','Folklore','Stories, oral memory and community knowledge'],
  ['🪶','Tribes & Communities','Community-led traditions and living knowledge'],
  ['🎭','Theatre','Drama, puppetry, dance-theatre and performance'],
  ['🗣️','Languages','Languages, scripts and regional expressions'],
  ['🌿','Traditional Knowledge','Ecology, materials, food and local expertise'],
  ['🪔','Rituals','Ceremonial practices and community traditions'],
  ['🏛️','Heritage Sites','Places, monuments and cultural landscapes'],
]

const CATEGORY_TYPE = {
  Dance:['Dance & Theatre','Regional Performing Arts'],
  Music:['Folk Music','Music'],
  Textiles:['Textiles','Traditional Weaving'],
  Crafts:['Traditional Crafts'],
  Theatre:['Dance & Theatre','Regional Performing Arts'],
  Folklore:['Oral Storytelling'],
  'Tribes & Communities':['Tribes & Communities'],
  Languages:['Languages'],
  'Traditional Knowledge':['Traditional Knowledge'],
  Rituals:['Rituals','Regional Performing Arts'],
}

function slug(v=''){ return v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') }

function makeDistrictItems(stateSlug, category){
  const result=[]
  const districts = DISTRICT_HERITAGE[stateSlug] || {}
  Object.entries(districts).forEach(([district, profile])=>{
    const hits=[]
    if(category==='Food' && profile.highlights.some(x=>/food|cuisine/i.test(x))) hits.push(...profile.highlights.filter(x=>/food|cuisine/i.test(x)))
    if(category==='Architecture' && profile.highlights.some(x=>/architect|heritage/i.test(x))) hits.push(...profile.highlights.filter(x=>/architect|heritage/i.test(x)))
    if(category==='Festivals' && profile.highlights.some(x=>/festival|bihu|dasara|pooram/i.test(x))) hits.push(...profile.highlights.filter(x=>/festival|bihu|dasara|pooram/i.test(x)))
    if(category==='Heritage Sites') hits.push(...profile.sites)
    if(category==='Traditional Knowledge' && profile.highlights.some(x=>/food|weav|cuisine|craft|knowledge/i.test(x))) hits.push(...profile.highlights)
    if(category==='Rituals' && profile.highlights.some(x=>/ritual|temple|pilgrimage/i.test(x))) hits.push(...profile.highlights.filter(x=>/ritual|temple|pilgrimage/i.test(x)))
    if(category==='Tribes & Communities') hits.push(profile.region)
    if(category==='Languages') hits.push(profile.region)
    if(category==='Dance') hits.push(...profile.traditions.filter(x=>/dance|yakshagana|kathakali|bharatanatyam|ghoomar|giddha|bhangra|lavani|sattriya/i.test(x)))
    if(category==='Music') hits.push(...profile.traditions.filter(x=>/music|baul|carnatic|hindustani|ghar[a-z]+/i.test(x)))
    if(category==='Textiles') hits.push(...profile.highlights.filter(x=>/weav|silk|handloom|textile|embroidery|phulkari|bandhani|kantha|muga/i.test(x)))
    if(category==='Crafts') hits.push(...profile.highlights.filter(x=>/craft|printing|painting|weav|embroidery|textile|terracotta|mask|coir/i.test(x)))
    if(category==='Theatre') hits.push(...profile.traditions.filter(x=>/yakshagana|kathakali|tamasha|theatre|puppet|kathputli/i.test(x)))
    if(category==='Folklore') hits.push(...profile.traditions.filter(x=>/folk|baul|story|performance/i.test(x)))
    if(hits.length) result.push({stateSlug, district, label:hits[0], highlights:[...new Set(hits)], profile})
  })
  return result
}

export default function CultureExplorer(){
  const navigate=useNavigate()
  const [category,setCategory]=useState('Food')
  const [region,setRegion]=useState('South India')
  const [stateSlug,setStateSlug]=useState('karnataka')
  const [district,setDistrict]=useState('')
  const [selected,setSelected]=useState(null)
  const [mode,setMode]=useState('explore')

  const regions = ['All India','North India','South India','East India','West India','North-East India']
  const states = useMemo(()=>Object.keys(stateData).map(slug=>({slug,name:stateData[slug].state, image:stateVisuals[slug]})),[])
  const filteredStates = useMemo(()=>states.filter(s=> region==='All India' ? true : region==='South India' ? ['karnataka','kerala','tamil-nadu'].includes(s.slug) : region==='North India' ? ['punjab','uttar-pradesh','rajasthan'].includes(s.slug) : region==='West India' ? ['maharashtra','gujarat'].includes(s.slug) : region==='East India' ? ['west-bengal'].includes(s.slug) : ['assam'].includes(s.slug)),[states,region])
  const catTypes=CATEGORY_TYPE[category] || []
  const traditions = useMemo(()=>{
    let data = TRADITIONS.filter(item => {
      const stateOk = !stateSlug || slug(item.state)===stateSlug
      const typeOk = category==='Food' || category==='Architecture' || category==='Festivals' || category==='Heritage Sites' || category==='Tribes & Communities' || category==='Languages' || category==='Traditional Knowledge' || category==='Rituals' ? true : catTypes.some(t=>item.type===t)
      const genericOk = category==='Food' ? /food|cuisine|culinary/i.test(item.summary||'') : category==='Heritage Sites' ? /heritage|site|monument/i.test(item.summary||'') : true
      return stateOk && typeOk && genericOk
    })
    const districtItems = stateSlug ? makeDistrictItems(stateSlug,category) : []
    return {data,districtItems}
  },[category,stateSlug,catTypes])
  const availableDistricts = traditions.districtItems
  const currentDistrict = district || availableDistricts[0]?.district || ''
  const selectedDistrict = availableDistricts.find(x=>x.district===currentDistrict)
  const stateName = stateData[stateSlug]?.state || 'India'

  function chooseCategory(next){ setCategory(next); setSelected(null); setDistrict(''); setMode('explore'); window.dispatchEvent(new CustomEvent('heritage-culture-filter',{detail:{category:next}})); setTimeout(()=>document.getElementById('culture-explorer-panel')?.scrollIntoView({behavior:'smooth',block:'center'}),50) }

  return <section className="border-y border-maroon/10 bg-[#fffaf2]">
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[.22em] text-maroon/65">Cultural discovery</div>
        <h2 className="mt-2 font-display text-5xl leading-none text-ink md:text-6xl">Explore India by Culture</h2>
        <p className="mt-4 text-base leading-7 text-ink/55">Start with a cultural interest, then travel deeper through geography: <b>India → State → District → Tradition.</b></p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {CATEGORIES.map(([emoji,title,body])=><button key={title} onClick={()=>chooseCategory(title)} className={`group min-h-32 rounded-[1.6rem] border p-4 text-left transition hover:-translate-y-1 hover:shadow-warm ${category===title?'border-maroon bg-maroon text-white shadow-lg':'border-maroon/10 bg-white text-ink'}`}>
          <div className="text-3xl transition group-hover:scale-110">{emoji}</div><div className="mt-3 text-sm font-bold">{title}</div><div className={`mt-1 text-[11px] leading-4 ${category===title?'text-white/70':'text-ink/45'}`}>{body}</div>
        </button>)}
      </div>

      <div id="culture-explorer-panel" className="mt-8 grid gap-5 lg:grid-cols-[.82fr_1.18fr]">
        <aside className="rounded-[2rem] border border-maroon/10 bg-white p-5 shadow-card md:p-6">
          <div className="flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-maroon/55">Your cultural route</div><h3 className="mt-2 font-display text-3xl text-maroon">What do you want to explore?</h3></div><Compass className="text-gold" size={30}/></div>
          <div className="mt-5 grid gap-3">
            <label className="text-xs font-bold text-ink/50">Region<select value={region} onChange={e=>{setRegion(e.target.value); const first=states.find(s=>e.target.value==='All India'||(e.target.value==='South India'&&['karnataka','kerala','tamil-nadu'].includes(s.slug))||(e.target.value==='North India'&&['punjab','uttar-pradesh','rajasthan'].includes(s.slug))||(e.target.value==='West India'&&['maharashtra','gujarat'].includes(s.slug))||(e.target.value==='East India'&&s.slug==='west-bengal')||(e.target.value==='North-East India'&&s.slug==='assam')); if(first)setStateSlug(first.slug); setDistrict('')}} className="mt-2 w-full rounded-2xl border border-maroon/10 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none"><option>{regions[0]}</option>{regions.slice(1).map(x=><option key={x}>{x}</option>)}</select></label>
            <label className="text-xs font-bold text-ink/50">State<select value={stateSlug} onChange={e=>{setStateSlug(e.target.value);setDistrict('');setSelected(null)}} className="mt-2 w-full rounded-2xl border border-maroon/10 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none">{filteredStates.map(s=><option key={s.slug} value={s.slug}>{s.name}</option>)}</select></label>
            <label className="text-xs font-bold text-ink/50">District<select value={currentDistrict} onChange={e=>setDistrict(e.target.value)} className="mt-2 w-full rounded-2xl border border-maroon/10 bg-cream px-4 py-3 text-sm font-semibold text-ink outline-none"><option value="">Choose a district</option>{availableDistricts.map(x=><option key={x.district} value={x.district}>{x.district}</option>)}</select></label>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Explore something new','Near me','Most at risk','Trending heritage trails','Festivals happening soon'].map((x,i)=><button key={x} onClick={()=>{setMode(i===2?'risk':i===3?'trails':i===1?'near':'explore')}} className="rounded-full border border-maroon/10 bg-cream px-3 py-2 text-[11px] font-bold text-maroon hover:bg-maroon hover:text-white">{x}</button>)}
          </div>
        </aside>

        <div className="rounded-[2rem] border border-maroon/10 bg-[#242424] p-5 text-cream shadow-warm md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="text-[10px] font-bold uppercase tracking-[.22em] text-gold">{category} lens</div><h3 className="mt-2 font-display text-4xl">{category} · {stateName}</h3><div className="mt-2 text-sm text-cream/55">{currentDistrict ? `${stateName} → ${currentDistrict}` : `${stateName} → discover a district`}</div></div><div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-cream/70">India → State → District → Tradition</div></div>

          {mode==='risk' ? <div className="mt-6 rounded-2xl bg-white/5 p-5"><div className="flex items-center gap-2 text-gold"><Heart size={17}/> At-risk discovery</div><p className="mt-2 text-sm leading-6 text-cream/60">Surface the curated traditions in this state that carry a preservation-priority or risk label.</p><div className="mt-4 flex flex-wrap gap-2">{TRADITIONS.filter(t=>slug(t.state)===stateSlug&&['At Risk','Declining','Critically Fading','Preservation Priority'].includes(t.status)).map(t=><button key={t.id} onClick={()=>navigate(`/tradition/${t.id}`)} className="rounded-xl bg-white/8 px-3 py-2 text-left text-xs hover:bg-white/15"><div className="font-bold text-cream">{t.name}</div><div className="text-[10px] text-gold">{t.status}</div></button>)}</div></div> : mode==='trails' ? <div className="mt-6 rounded-2xl bg-white/5 p-5"><div className="flex items-center gap-2 text-gold"><MapPinned size={17}/> Trending heritage trails</div><p className="mt-2 text-sm leading-6 text-cream/60">Take this cultural lens into curated geographic journeys.</p><button onClick={()=>navigate('/trails')} className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-bold text-ink">View Heritage Trails <ArrowRight size={14}/></button></div> : mode==='near' ? <div className="mt-6 rounded-2xl bg-white/5 p-5"><div className="flex items-center gap-2 text-gold"><MapPinned size={17}/> Near me</div><p className="mt-2 text-sm leading-6 text-cream/60">Use the atlas to begin from your current district or a place you choose. Location access remains optional.</p><button onClick={()=>document.getElementById('atlas')?.scrollIntoView({behavior:'smooth'})} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-bold text-cream">Explore the map <ArrowRight size={14}/></button></div> : <>
            {selected ? <div className="mt-6 rounded-2xl bg-white/5 p-5"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">Selected tradition</div><div className="mt-2 font-display text-3xl text-cream">{selected.name}</div><div className="mt-2 text-sm text-cream/55">{selected.state} · {selected.district} · {selected.community}</div><p className="mt-3 text-sm leading-6 text-cream/65">{selected.summary}</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>navigate(`/tradition/${selected.id}`)} className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-bold text-ink">Open tradition <ArrowRight size={14}/></button><button onClick={()=>document.getElementById('atlas')?.scrollIntoView({behavior:'smooth'})} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-bold text-white">Explore on map <MapPinned size={14}/></button></div></div> : <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {availableDistricts.map(d=><button key={d.district} onClick={()=>setDistrict(d.district)} className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${currentDistrict===d.district?'border-gold bg-gold/10':'border-white/10 bg-white/5 hover:bg-white/8'}`}><div className="text-[10px] uppercase tracking-[.16em] text-gold/80">District</div><div className="mt-1 font-bold text-cream">{d.district}</div><div className="mt-1 text-[11px] text-cream/45">{d.label}</div></button>)}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">Tradition layer</div><div className="mt-2 font-display text-2xl text-cream">{selectedDistrict?.label || `${category} traditions in ${stateName}`}</div><div className="mt-2 text-sm text-cream/55">{selectedDistrict?.profile?.region || 'Choose a district to reveal local cultural highlights.'}</div><div className="mt-4 flex flex-wrap gap-2">{(selectedDistrict?.highlights || traditions.data.slice(0,6).map(x=>x.name)).map((name,i)=><span key={`${name}-${i}`} className="rounded-full bg-white/8 px-3 py-1.5 text-[11px] font-semibold text-cream/70">{name}</span>)}</div><div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>document.getElementById('atlas')?.scrollIntoView({behavior:'smooth'})} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-xs font-bold text-cream">Explore the map <MapPinned size={14}/></button><button onClick={()=>navigate('/trails')} className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-bold text-ink">Heritage Trails <ArrowRight size={14}/></button></div></div>
            </>}</>}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-ink/40"><ArrowDown size={14}/> Choose a culture. Then follow it into place, people and practice.</div>
    </div>
  </section>
}
