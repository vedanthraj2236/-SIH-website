import { Compass, Heart, Landmark, Sparkles, Users, Utensils } from 'lucide-react'

const pillars = [
  [Compass, 'Discover by place', 'Begin with the map and follow a region into its traditions, landscapes and cultural memory.'],
  [Users, 'People and practice', 'Focus on living communities, shared celebrations, craft knowledge and everyday expressions of identity.'],
  [Utensils, 'Everyday heritage', 'Treat cuisine, clothing and music as meaningful cultural practices rather than background decoration.'],
  [Landmark, 'Places that endure', 'Connect monuments and historic spaces with the stories and traditions that surround them.'],
]

export default function About(){
  return <main className="content-page">
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-4xl animate-fadeUp">
          <div className="text-xs font-bold uppercase tracking-[.22em] text-gold">About Indian Heritage</div>
          <h1 className="mt-3 font-display text-5xl md:text-7xl">A welcoming guide to India’s living heritage.</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-cream/65 md:text-lg">Indian Heritage is a visual guide to the many ways culture is lived across India — through language, dress, festivals, performance, food, craftsmanship, stories and places. Each profile is a starting point for curiosity, not a claim to represent every community within a region.</p>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{pillars.map(([Icon, title, body]) => <article key={title} className="group rounded-3xl border border-maroon/10 bg-white p-6 shadow-card hover:-translate-y-2 hover:shadow-warm"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-saffron/10 text-maroon transition group-hover:rotate-3 group-hover:scale-105"><Icon size={20}/></div><h2 className="mt-5 font-display text-2xl text-maroon">{title}</h2><p className="mt-2 text-sm leading-6 text-ink/55">{body}</p></article>)}</div>

      <div className="mt-16 grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-start">
        <div>
          <div className="text-xs font-bold uppercase tracking-[.2em] text-maroon/70">Our perspective</div>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">India’s cultural landscape is plural, local and continually evolving.</h2>
          <div className="mt-7 space-y-4">
            {[
              ['Celebrate regional variety', 'A tradition may differ across communities and districts. Profiles therefore aim to illuminate a region without implying that one practice represents everyone.'],
              ['Keep cultural details meaningful', 'Festivals, dress, dance, cuisine, music, crafts and monuments are presented as connected parts of regional life.'],
              ['Prefer clarity over exaggeration', 'Where a precise historical or cultural claim would require more context, the language stays measured instead of inventing certainty.'],
            ].map(([title, body]) => <div key={title} className="rounded-3xl border border-maroon/10 bg-white p-5 shadow-sm"><div className="flex items-start gap-3"><Sparkles className="mt-0.5 shrink-0 text-gold" size={18}/><div><h3 className="font-semibold text-maroon">{title}</h3><p className="mt-2 text-sm leading-6 text-ink/60">{body}</p></div></div></div>)}
          </div>
        </div>

        <div className="rounded-[2rem] border border-maroon/10 bg-saffron/10 p-7 md:p-8">
          <div className="text-xs font-bold uppercase tracking-[.2em] text-maroon/70">What you can explore</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {['Traditional dress','Festivals & celebrations','Dance & music','Cuisine & foodways','Arts & crafts','Folklore','Monuments & places'].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-maroon/10 bg-white/75 px-4 py-3 text-sm"><span className="grid h-8 w-8 place-items-center rounded-full bg-maroon text-xs font-bold text-gold">{String(index+1).padStart(2,'0')}</span><span className="font-semibold text-ink/75">{item}</span></div>)}
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-[2rem] bg-maroon p-8 text-cream md:p-10">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div><div className="text-xs font-bold uppercase tracking-[.2em] text-gold/80">An invitation</div><h2 className="mt-2 font-display text-4xl">Pause, look closer, and let the map lead you.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">The goal is not to reduce India’s diversity to a single narrative. It is to make the richness easier to approach — with enough context to encourage curiosity, respect and further learning.</p></div>
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gold text-ink"><Heart size={28}/></div>
        </div>
      </div>
    </section>
  </main>
}
