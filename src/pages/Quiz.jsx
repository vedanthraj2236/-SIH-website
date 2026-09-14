import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Compass } from 'lucide-react'
import MiniQuiz from '../components/MiniQuiz'

export default function Quiz(){
 return <main className="content-page">
  <section className="relative overflow-hidden bg-maroon text-cream">
   <div className="absolute inset-0 heritage-grid opacity-15"/>
   <div className="absolute -left-20 top-8 h-72 w-72 rounded-full bg-saffron/25 blur-3xl"/>
   <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl"/>
   <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
    <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:-translate-x-1"><ArrowLeft size={15}/> Back to Indian Heritage</Link>
    <div className="mt-7 max-w-3xl animate-fadeUp"><div className="text-xs font-bold uppercase tracking-[.22em] text-gold">Culture quiz</div><h1 className="mt-2 font-display text-5xl md:text-7xl">How well do you know India’s traditions?</h1><p className="mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">Test your knowledge of festivals, dance, textiles and regional culture. Learn something new with every answer.</p></div>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {[['Play','Answer a handful of quick questions'],['Learn','Read a short cultural note after each answer'],['Explore','Jump into a state profile when you are curious']].map(([title,body],i)=><div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5"><div className="text-xs font-bold uppercase tracking-[.18em] text-gold">0{i+1}</div><h2 className="mt-2 font-display text-2xl">{title}</h2><p className="mt-2 text-sm text-white/55">{body}</p></div>)}
    </div>
   </div>
  </section>
  <MiniQuiz/>
  <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8"><div className="grid gap-5 md:grid-cols-2"><Link to="/search" className="group rounded-3xl border border-maroon/10 bg-white p-6 shadow-card hover:-translate-y-1 hover:shadow-warm"><Compass className="text-maroon" size={20}/><h2 className="mt-4 font-display text-3xl">Explore a state next</h2><p className="mt-2 text-sm leading-6 text-ink/55">Turn a quiz answer into a deeper cultural journey.</p></Link><Link to="/about" className="group rounded-3xl border border-maroon/10 bg-white p-6 shadow-card hover:-translate-y-1 hover:shadow-warm"><BookOpen className="text-maroon" size={20}/><h2 className="mt-4 font-display text-3xl">About Indian Heritage</h2><p className="mt-2 text-sm leading-6 text-ink/55">Read the cultural perspective behind the atlas.</p></Link></div></section>
 </main>
}
