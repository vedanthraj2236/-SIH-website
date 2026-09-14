import { Check, Clock3, Flame, Lightbulb, RotateCcw, Trophy, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { stateData } from '../data/states'

const BASE_QUESTIONS = [
  { category: 'Dance', difficulty: 'Easy', question: 'Which state is strongly associated with Yakshagana?', options: ['Karnataka', 'Punjab', 'Gujarat', 'Assam'], answer: 'Karnataka', fact: 'Yakshagana is a traditional dance-drama strongly associated with coastal Karnataka.' },
  { category: 'Festivals', difficulty: 'Easy', question: 'Which festival is a major harvest-season celebration of Kerala?', options: ['Onam', 'Bihu', 'Lohri', 'Pongal'], answer: 'Onam', fact: 'Onam is a major festival of Kerala with a strong harvest-season and cultural identity.' },
  { category: 'Textiles', difficulty: 'Easy', question: 'Which textile embroidery tradition is strongly associated with Punjab?', options: ['Phulkari', 'Chikankari', 'Pattachitra', 'Kanjeevaram'], answer: 'Phulkari', fact: 'Phulkari is an embroidery tradition closely associated with Punjab.' },
  { category: 'Dance', difficulty: 'Easy', question: 'Garba is especially associated with which state?', options: ['Gujarat', 'Rajasthan', 'Kerala', 'West Bengal'], answer: 'Gujarat', fact: 'Garba is a prominent dance tradition of Gujarat, especially visible during Navratri.' },
  { category: 'Dance', difficulty: 'Easy', question: 'Which state is famous for Ghoomar?', options: ['Rajasthan', 'Assam', 'Maharashtra', 'Tamil Nadu'], answer: 'Rajasthan', fact: 'Ghoomar is a celebrated folk dance tradition of Rajasthan.' },
  { category: 'Music', difficulty: 'Medium', question: 'Sattriya is associated with which state?', options: ['Assam', 'Gujarat', 'Punjab', 'Maharashtra'], answer: 'Assam', fact: 'Sattriya is a major classical dance tradition of Assam.' },
  { category: 'Cuisine', difficulty: 'Medium', question: 'Which state profile includes dhokla among its cuisine highlights?', options: ['Gujarat', 'Kerala', 'Punjab', 'West Bengal'], answer: 'Gujarat', fact: 'Dhokla is a well-known Gujarati food tradition.' },
  { category: 'Dance', difficulty: 'Medium', question: 'Lavani is especially associated with which state?', options: ['Maharashtra', 'Rajasthan', 'Assam', 'Uttar Pradesh'], answer: 'Maharashtra', fact: 'Lavani is a celebrated performance tradition of Maharashtra.' },
  { category: 'Festivals', difficulty: 'Medium', question: 'Durga Puja in Kolkata is associated with which state?', options: ['West Bengal', 'Tamil Nadu', 'Karnataka', 'Punjab'], answer: 'West Bengal', fact: 'Durga Puja in Kolkata is a major cultural tradition and UNESCO-inscribed heritage practice.' },
  { category: 'Dance', difficulty: 'Hard', question: 'Which state profile includes Bharatanatyam among its dance traditions?', options: ['Tamil Nadu', 'Kerala', 'Maharashtra', 'Rajasthan'], answer: 'Tamil Nadu', fact: 'Bharatanatyam is a major classical dance tradition associated with Tamil Nadu.' },
  { category: 'Crafts', difficulty: 'Hard', question: 'Which state is strongly associated with Chikankari?', options: ['Uttar Pradesh', 'Punjab', 'Gujarat', 'Assam'], answer: 'Uttar Pradesh', fact: 'Chikankari is a renowned embroidery tradition associated with Lucknow and Uttar Pradesh.' },
  { category: 'Festivals', difficulty: 'Hard', question: 'Mysuru Dasara is a major festival tradition of which state?', options: ['Karnataka', 'Kerala', 'Rajasthan', 'West Bengal'], answer: 'Karnataka', fact: 'Mysuru Dasara is a major annual cultural celebration in Karnataka.' },
]

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function MiniQuiz() {
  const [difficulty, setDifficulty] = useState('All')
  const [category, setCategory] = useState('All')
  const [questionCount, setQuestionCount] = useState(8)
  const [quiz, setQuiz] = useState(() => shuffle(BASE_QUESTIONS).slice(0, 8))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(() => Number(localStorage.getItem('indian-heritage-best-streak') || 0))
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('indian-heritage-best-score') || 0))
  const [hints, setHints] = useState(2)
  const [hint, setHint] = useState('')
  const [timeLeft, setTimeLeft] = useState(20)
  const [done, setDone] = useState(false)
  const [startedAt, setStartedAt] = useState(Date.now())
  const q = quiz[index]

  const filtered = useMemo(() => BASE_QUESTIONS.filter((item) => (difficulty === 'All' || item.difficulty === difficulty) && (category === 'All' || item.category === category)), [difficulty, category])
  const categories = useMemo(() => ['All', ...new Set(BASE_QUESTIONS.map((item) => item.category))], [])
  const maxCount = Math.min(questionCount, Math.max(filtered.length, 1))

  useEffect(() => {
    if (done || selected) return undefined
    if (timeLeft <= 0) {
      setSelected('__TIMEOUT__')
      setStreak(0)
      return undefined
    }
    const timer = setInterval(() => setTimeLeft((value) => value - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, selected, done])

  function choose(option) {
    if (selected || done) return
    setSelected(option)
    if (option === q.answer) {
      const nextStreak = streak + 1
      setScore((s) => s + 1)
      setStreak(nextStreak)
      setBestStreak((current) => {
        const best = Math.max(current, nextStreak)
        localStorage.setItem('indian-heritage-best-streak', String(best))
        return best
      })
    } else setStreak(0)
  }

  function next() {
    if (index === quiz.length - 1) {
      const finalScore = score
      setBestScore((current) => {
        const best = Math.max(current, finalScore)
        localStorage.setItem('indian-heritage-best-score', String(best))
        return best
      })
      setDone(true)
    }
    else {
      setIndex((value) => value + 1)
      setSelected(null)
      setHint('')
      setTimeLeft(20)
    }
  }

  function useHint() {
    if (selected || hints <= 0 || hint) return
    const wrong = q.options.filter((option) => option !== q.answer)
    setHint(`One clue: ${shuffle(wrong).slice(0, 2).join(' and ')} ${wrong.length > 2 ? 'can be ruled out.' : 'are distractors.'}`)
    setHints((value) => value - 1)
  }

  function startNewQuiz() {
    const pool = filtered.length ? filtered : BASE_QUESTIONS
    const fresh = shuffle(pool).slice(0, Math.min(questionCount, pool.length))
    setQuiz(fresh)
    setIndex(0)
    setSelected(null)
    setScore(0)
    setStreak(0)
    setHints(2)
    setHint('')
    setTimeLeft(20)
    setDone(false)
    setStartedAt(Date.now())
  }

  const elapsed = Math.max(1, Math.round((Date.now() - startedAt) / 1000))
  const accuracy = quiz.length ? Math.round((score / quiz.length) * 100) : 0
  const readyStates = useMemo(() => Object.keys(stateData).length, [])

  return <section id="culture-quiz" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
    <div className="overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-br from-[#1E2F61] via-maroon to-[#176B67] text-cream shadow-warm">
      <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-gold"><Trophy size={14}/> Culture challenge</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Play smarter. Learn as you go.</h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/60">Choose a topic and difficulty, race the clock, use hints, build streaks and unlock a better score each time.</p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-3"><div className="text-lg font-bold">{BASE_QUESTIONS.length}</div><div className="text-[10px] uppercase tracking-[.14em] text-white/50">Question bank</div></div>
            <div className="rounded-2xl bg-white/10 p-3"><div className="text-lg font-bold">{bestStreak}</div><div className="text-[10px] uppercase tracking-[.14em] text-white/50">Best streak</div></div>
            <div className="rounded-2xl bg-white/10 p-3"><div className="text-lg font-bold">{readyStates}</div><div className="text-[10px] uppercase tracking-[.14em] text-white/50">Profiles</div></div>
            <div className="rounded-2xl bg-white/10 p-3"><div className="text-lg font-bold">20s</div><div className="text-[10px] uppercase tracking-[.14em] text-white/50">Per question</div></div>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-cream p-5 text-ink shadow-2xl md:p-7">
          {!done ? <>
            <div className="flex flex-wrap items-center gap-2 border-b border-maroon/10 pb-4">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full border border-maroon/10 bg-white px-3 py-2 text-xs font-bold text-maroon outline-none"><option value="All">All topics</option>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-full border border-maroon/10 bg-white px-3 py-2 text-xs font-bold text-maroon outline-none"><option>All</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
              <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="rounded-full border border-maroon/10 bg-white px-3 py-2 text-xs font-bold text-maroon outline-none"><option value={5}>5 questions</option><option value={8}>8 questions</option><option value={10}>10 questions</option></select>
              <button onClick={startNewQuiz} className="ml-auto rounded-full border border-maroon/10 px-3 py-2 text-xs font-bold text-maroon hover:bg-maroon/5"><RotateCcw size={13} className="mr-1 inline"/> New quiz</button>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-[.18em] text-maroon/60"><span>Question {index + 1} / {quiz.length}</span><span>Score {score} · Streak {streak} · Best {bestScore}</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-maroon/10"><div className="h-full rounded-full bg-saffron transition-all duration-500" style={{ width: `${((index + 1) / quiz.length) * 100}%` }}/></div>
            <div className="mt-4 flex items-center justify-between"><span className="rounded-full bg-maroon/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-maroon/60">{q.category} · {q.difficulty}</span><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${timeLeft <= 5 ? 'bg-red-50 text-red-700' : 'bg-saffron/10 text-maroon'}`}><Clock3 size={13}/>{timeLeft}s</span></div>
            <h3 className="mt-5 font-display text-2xl leading-tight">{q.question}</h3>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">{q.options.map((option) => { const correct = selected && option === q.answer; const wrong = selected === option && option !== q.answer; return <button key={option} onClick={() => choose(option)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 ${correct ? 'border-leaf bg-leaf/10 text-leaf' : wrong ? 'border-red-300 bg-red-50 text-red-700' : 'border-maroon/10 bg-white hover:border-maroon/30 hover:shadow-card'}`}>{option}{selected && (correct ? <Check size={16} className="float-right"/> : wrong ? <X size={16} className="float-right"/> : null)}</button> })}</div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button onClick={useHint} disabled={Boolean(selected || hint) || hints <= 0} className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-2 text-xs font-bold text-maroon disabled:opacity-40"><Lightbulb size={13}/> Hint · {hints}</button>
              {hint && <span className="rounded-2xl bg-gold/10 px-3 py-2 text-xs leading-5 text-ink/70">{hint}</span>}
            </div>
            {selected && <div className="mt-4 rounded-2xl bg-saffron/10 px-4 py-3 text-sm leading-5"><strong>{selected === '__TIMEOUT__' ? 'Time’s up.' : 'Did you know?'}</strong> {q.fact}</div>}
            <button disabled={!selected} onClick={next} className="mt-5 w-full rounded-2xl bg-maroon px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-35">{index === quiz.length - 1 ? 'See my result' : 'Next question'}</button>
          </> : <div className="py-7 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/25 text-maroon"><Trophy size={28}/></div><div className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-maroon/60">Your result</div><div className="mt-2 font-display text-6xl text-maroon">{score}/{quiz.length}</div><div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-bold"><span className="rounded-full bg-maroon/5 px-3 py-1.5">Accuracy {accuracy}%</span><span className="rounded-full bg-maroon/5 px-3 py-1.5"><Flame size={12} className="mr-1 inline"/>Best streak {Math.max(bestStreak, streak)}</span><span className="rounded-full bg-maroon/5 px-3 py-1.5">Best score {Math.max(bestScore, score)}/{quiz.length}</span><span className="rounded-full bg-maroon/5 px-3 py-1.5">{elapsed}s+ playtime</span></div><p className="mx-auto mt-4 max-w-sm text-sm text-ink/60">{accuracy === 100 ? 'Outstanding. You know your cultural map.' : accuracy >= 70 ? 'Excellent work. Explore a few more state profiles and sharpen the details.' : 'Good start. Use the profiles and try another topic to build your cultural recall.'}</p><button onClick={startNewQuiz} className="mt-6 inline-flex items-center gap-2 rounded-full border border-maroon/15 px-5 py-3 text-sm font-bold text-maroon hover:bg-maroon/5"><RotateCcw size={15}/> Play again</button></div>}
        </div>
      </div>
    </div>
  </section>
}
