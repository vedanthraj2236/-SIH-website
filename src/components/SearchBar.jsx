import { useMemo, useState } from 'react'
import { Search, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { INDIA_REGIONS, slugify } from '../data/states'

export default function SearchBar({ compact = false }) {
  const [query,setQuery] = useState('')
  const [open,setOpen] = useState(false)
  const navigate = useNavigate()
  const matches = useMemo(() => query.trim() ? INDIA_REGIONS.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0,7) : [], [query])
  const go = (name) => { setQuery(name); setOpen(false); navigate(`/state/${slugify(name)}`) }
  return <div className="relative w-full max-w-xl">
    <div className={`glass flex items-center gap-3 rounded-full border border-maroon/15 px-4 shadow-card ${compact ? 'h-11' : 'h-14'}`}>
      <Search size={18} className="text-maroon/70" />
      <input value={query} onFocus={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setOpen(true)}} onKeyDown={e=>{if(e.key==='Enter'&&matches[0])go(matches[0])}} placeholder="Search a state or union territory…" className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40" aria-label="Search states and union territories" />
    </div>
    {open && query && <>
      <button className="fixed inset-0 z-20 cursor-default" aria-label="Close search suggestions" onClick={()=>setOpen(false)} />
      <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-maroon/10 bg-cream shadow-warm">
        {matches.length ? matches.map(name => <button key={name} onClick={()=>go(name)} className="group flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-saffron/10"><span>{name}</span><ArrowUpRight size={15} className="opacity-0 transition group-hover:opacity-100 text-maroon" /></button>) : <div className="px-4 py-4 text-sm text-ink/55">No regions match “{query}”.</div>}
      </div>
    </>}
  </div>
}
