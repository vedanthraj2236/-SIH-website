import {
  Bot, CalendarDays, CheckCircle2, Compass, Copy, Heart, MapPinned, RotateCcw,
  Save, Send, Share2, Sparkles, SlidersHorizontal, Trophy, WalletCards, X
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { regionalLanguages } from '../data/regionalLanguages'
import { stateData, slugify } from '../data/states'
import { getDistrictProfile } from '../data/districtHeritage'
import { TRADITIONS } from '../data/traditions'
import { useLanguage } from './LanguageContext'

const quickReplies = [
  'Plan 3 days in Karnataka',
  'What crafts can I experience near Mysuru?',
  'I have one day — what should I prioritize?',
  'Build a heritage trail for me',
]

const BOT_COPY = {
 en: { greeting: 'Namaste! I’m your AI Heritage Guide. Tell me a destination, number of days, interests, budget, food preference, travel style, accessibility needs or season, and I’ll shape a culture-led trip.', placeholder: 'Try: 3 days in Karnataka, crafts, vegetarian…', context: 'Context-aware local planner · no invented artisans or live events', verified: 'Verified information', suggestion: 'Planning suggestions' },
 kn: { greeting: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಹೆರಿಟೇಜ್ ಗೈಡ್. ಸ್ಥಳ, ದಿನಗಳು, ಆಸಕ್ತಿಗಳು, ಬಜೆಟ್, ಆಹಾರ, ಪ್ರಯಾಣ ಶೈಲಿ, ಪ್ರವೇಶಾರ್ಹತೆ ಅಥವಾ ಕಾಲವನ್ನು ತಿಳಿಸಿ; ನಾನು ಸಂಸ್ಕೃತಿ-ಕೇಂದ್ರಿತ ಯೋಜನೆಯನ್ನು ರೂಪಿಸುತ್ತೇನೆ.', placeholder:'ಉದಾ.: ಕರ್ನಾಟಕದಲ್ಲಿ 3 ದಿನ, ಕರಕುಶಲ, ಸಸ್ಯಾಹಾರಿ…', context:'ಸಂದರ್ಭ ಅರಿಯುವ ಸ್ಥಳೀಯ ಯೋಜಕ · ಕಲ್ಪಿತ ಕರಕುಶಲಗಾರರು ಅಥವಾ ಲೈವ್ ಕಾರ್ಯಕ್ರಮಗಳಿಲ್ಲ', verified:'ಪರಿಶೀಲಿತ ಮಾಹಿತಿ', suggestion:'ಪ್ರಯಾಣ ಸಲಹೆ' },
 hi: { greeting:'नमस्ते! मैं आपका AI हेरिटेज गाइड हूँ। स्थान, दिनों की संख्या, रुचियाँ, बजट, भोजन, यात्रा शैली, पहुँच की जरूरत या मौसम बताइए; मैं संस्कृति-केंद्रित योजना बनाऊँगा।', placeholder:'उदाहरण: कर्नाटक में 3 दिन, शिल्प, शाकाहारी…', context:'संदर्भ-आधारित स्थानीय योजनाकार · काल्पनिक कारीगर या लाइव आयोजन नहीं', verified:'सत्यापित जानकारी', suggestion:'यात्रा सुझाव' },
 ta: { greeting:'வணக்கம்! நான் உங்கள் AI பாரம்பரிய வழிகாட்டி. இடம், நாட்கள், ஆர்வங்கள், பட்ஜெட், உணவு விருப்பம், பயண பாணி, அணுகல்தன்மை அல்லது பருவத்தைச் சொல்லுங்கள்; பண்பாட்டு பயணத்தை உருவாக்குகிறேன்.', placeholder:'உதா.: கர்நாடகா 3 நாட்கள், கைவினை, சைவம்…', context:'சூழலைப் புரியும் உள்ளூர் திட்டமிடுபவர் · கற்பனை கைவினைஞர்கள் அல்லது நேரடி நிகழ்வுகள் இல்லை', verified:'சரிபார்க்கப்பட்ட தகவல்', suggestion:'பயண பரிந்துரை' },
 te: { greeting:'నమస్కారం! నేను మీ AI హెరిటేజ్ గైడ్. ప్రదేశం, రోజులు, ఆసక్తులు, బడ్జెట్, ఆహారం, ప్రయాణ శైలి, యాక్సెసిబిలిటీ లేదా కాలాన్ని చెప్పండి; సాంస్కృతిక ప్రయాణాన్ని రూపొందిస్తాను.', placeholder:'ఉదా.: కర్ణాటకలో 3 రోజులు, హస్తకళలు, వెజిటేరియన్…', context:'సందర్భాన్ని అర్థం చేసుకునే స్థానిక ప్లానర్ · కల్పిత కళాకారులు లేదా లైవ్ ఈవెంట్లు లేవు', verified:'ధృవీకరించిన సమాచారం', suggestion:'ప్రయాణ సూచన' },
 ml: { greeting:'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI ഹെറിറ്റേജ് ഗൈഡാണ്. സ്ഥലം, ദിവസങ്ങൾ, താൽപര്യങ്ങൾ, ബജറ്റ്, ഭക്ഷണം, യാത്രാ ശൈലി, ആക്സസിബിലിറ്റി അല്ലെങ്കിൽ കാലം പറയൂ; ഒരു സംസ്കാരകേന്ദ്രിത യാത്ര തയ്യാറാക്കാം.', placeholder:'ഉദാ.: കേരളത്തിൽ 3 ദിവസം, കരകൗശലം, വെജിറ്റേറിയൻ…', context:'സന്ദർഭബോധമുള്ള പ്രാദേശിക പ്ലാനർ · കെട്ടിച്ചമച്ച കരകൗശലക്കാരോ ലൈവ് ഇവന്റുകളോ ഇല്ല', verified:'പരിശോധിച്ച വിവരം', suggestion:'യാത്രാ നിർദ്ദേശം' },
 mr: { greeting:'नमस्कार! मी तुमचा AI हेरिटेज गाइड आहे. ठिकाण, दिवस, आवडी, बजेट, अन्न, प्रवासाची शैली, प्रवेशयोग्यता किंवा ऋतू सांगा; मी संस्कृती-केंद्रित योजना तयार करेन.', placeholder:'उदा.: कर्नाटक 3 दिवस, हस्तकला, शाकाहारी…', context:'संदर्भ-जाणणारा स्थानिक नियोजक · काल्पनिक कारागीर किंवा लाइव्ह कार्यक्रम नाहीत', verified:'पडताळलेली माहिती', suggestion:'प्रवास सूचना' },
 bn: { greeting:'নমস্কার! আমি আপনার AI হেরিটেজ গাইড। স্থান, কতদিন, আগ্রহ, বাজেট, খাবার, ভ্রমণধারা, অ্যাক্সেসিবিলিটি বা ঋতু বলুন; আমি সংস্কৃতি-কেন্দ্রিক ভ্রমণ পরিকল্পনা তৈরি করব।', placeholder:'উদাহরণ: কর্ণাটকে ৩ দিন, কারুশিল্প, নিরামিষ…', context:'প্রসঙ্গভিত্তিক স্থানীয় পরিকল্পনাকারী · বানানো কারিগর বা লাইভ ইভেন্ট নেই', verified:'যাচাইকৃত তথ্য', suggestion:'ভ্রমণ পরামর্শ' },
 gu: { greeting:'નમસ્તે! હું તમારો AI હેરિટેજ ગાઇડ છું. સ્થળ, દિવસો, રસ, બજેટ, ખોરાક, પ્રવાસ શૈલી, ઍક્સેસિબિલિટી અથવા ઋતુ કહો; હું સંસ્કૃતિ-કેન્દ્રિત યોજના બનાવીશ.', placeholder:'ઉદાહરણ: કર્ણાટકમાં 3 દિવસ, હસ્તકલા, શાકાહારી…', context:'સંદર્ભ-જાણકાર સ્થાનિક પ્લાનર · કલ્પિત કારીગરો અથવા લાઇવ ઇવેન્ટ્સ નહીં', verified:'ચકાસેલી માહિતી', suggestion:'પ્રવાસ સૂચન' },
 pa: { greeting:'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਹੇਰਿਟੇਜ ਗਾਈਡ ਹਾਂ। ਥਾਂ, ਦਿਨਾਂ ਦੀ ਗਿਣਤੀ, ਦਿਲਚਸਪੀਆਂ, ਬਜਟ, ਖਾਣਾ, ਯਾਤਰਾ ਸ਼ੈਲੀ, ਪਹੁੰਚਯੋਗਤਾ ਜਾਂ ਮੌਸਮ ਦੱਸੋ; ਮੈਂ ਸੱਭਿਆਚਾਰ-ਕੇਂਦਰਿਤ ਯੋਜਨਾ ਬਣਾਵਾਂਗਾ।', placeholder:'ਉਦਾਹਰਨ: ਕਰਨਾਟਕ 3 ਦਿਨ, ਹਸਤਕਲਾ, ਸ਼ਾਕਾਹਾਰੀ…', context:'ਸੰਦਰਭ-ਅਧਾਰਿਤ ਸਥਾਨਕ ਯੋਜਨਾਕਾਰ · ਕਲਪਿਤ ਕਾਰੀਗਰ ਜਾਂ ਲਾਈਵ ਸਮਾਗਮ ਨਹੀਂ', verified:'ਤਸਦੀਕਸ਼ੁਦਾ ਜਾਣਕਾਰੀ', suggestion:'ਯਾਤਰਾ ਸੁਝਾਅ' },
 or: { greeting:'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ AI ହେରିଟେଜ୍ ଗାଇଡ୍। ସ୍ଥାନ, କେତେ ଦିନ, ଆଗ୍ରହ, ବଜେଟ୍, ଖାଦ୍ୟ, ଯାତ୍ରା ଶୈଳୀ, ପ୍ରବେଶଯୋଗ୍ୟତା କିମ୍ବା ଋତୁ କହନ୍ତୁ; ମୁଁ ସାଂସ୍କୃତିକ ଯାତ୍ରା ଯୋଜନା କରିବି।', placeholder:'ଉଦାହରଣ: କର୍ଣ୍ଣାଟକ 3 ଦିନ, ହସ୍ତଶିଳ୍ପ, ଶାକାହାରୀ…', context:'ପରିପ୍ରେକ୍ଷ୍ୟ-ଆଧାରିତ ସ୍ଥାନୀୟ ଯୋଜକ · କଳ୍ପିତ କାରିଗର କିମ୍ବା ଲାଇଭ୍ ଇଭେଣ୍ଟ୍ ନାହିଁ', verified:'ଯାଞ୍ଚିତ ସୂଚନା', suggestion:'ଯାତ୍ରା ପରାମର୍ଶ' },
 as: { greeting:'নমস্কাৰ! মই আপোনাৰ AI হেৰিটেজ গাইড। ঠাই, দিন, আগ্ৰহ, বাজেট, খাদ্য, ভ্ৰমণৰ ধৰণ, সুবিধা বা ঋতু কওক; মই সংস্কৃতি-কেন্দ্ৰিক ভ্ৰমণ পৰিকল্পনা কৰিম।', placeholder:'উদাহৰণ: কৰ্ণাটকত ৩ দিন, হস্তশিল্প, নিৰামিষ…', context:'পৰিপ্ৰেক্ষিত-বুজা স্থানীয় পৰিকল্পনাকাৰী · কল্পিত কাৰিকৰ বা লাইভ অনুষ্ঠান নাই', verified:'যাচাইকৃত তথ্য', suggestion:'ভ্ৰমণ পৰামৰ্শ' },
}

const lower = (value) => String(value || '').toLowerCase().trim()

const STATE_ALIASES = {
  'uttar pradesh': 'uttar-pradesh', 'up': 'uttar-pradesh',
  'west bengal': 'west-bengal', 'west bengal': 'west-bengal',
  'tamil nadu': 'tamil-nadu', 'tamilnadu': 'tamil-nadu',
}

function findState(text) {
  const t = lower(text)
  return Object.values(stateData).find((state) => {
    const name = lower(state.state)
    const slug = slugify(state.state)
    return t.includes(name) || t.includes(slug) || Object.entries(STATE_ALIASES).some(([alias, mapped]) => mapped === slug && t.includes(alias))
  })
}

function joinList(items = [], count = 4) {
  const values = items.filter(Boolean).slice(0, count)
  if (!values.length) return 'not yet listed'
  if (values.length === 1) return values[0]
  return `${values.slice(0, -1).join(', ')} and ${values.at(-1)}`
}

function extractDays(text) {
  const match = lower(text).match(/(?:for\s*)?(\d+)\s*(?:day|days)/)
  return Math.max(1, Math.min(7, Number(match?.[1] || 3)))
}

function extractBudget(text) {
  const t = lower(text)
  if (/(\bcheap\b|budget|low[- ]cost|backpacker)/.test(t)) return 'Budget'
  if (/(luxury|premium|upscale)/.test(t)) return 'Premium'
  if (/(moderate|mid[- ]range|comfortable)/.test(t)) return 'Comfortable'
  const number = t.match(/(?:₹|rs\.?|inr\s*)([\d,]+)/)
  if (number) return `Around ₹${number[1]}`
  return 'Not specified'
}

function extractPreferences(text) {
  const t = lower(text)
  return {
    interests: ['dance','music','food','textiles','crafts','architecture','festivals','folklore','heritage'].filter((x) => t.includes(x)).map((x) => x[0].toUpperCase() + x.slice(1)),
    food: /vegetarian|veg\b/.test(t) ? 'Vegetarian' : /non[- ]?veg|meat|seafood|fish/.test(t) ? 'Non-vegetarian / seafood' : 'Open to local foodways',
    style: /family/.test(t) ? 'Family-friendly' : /slow|relaxed|leisure/.test(t) ? 'Slow / relaxed' : /immersive|local|community/.test(t) ? 'Immersive / community-focused' : /photograph/.test(t) ? 'Photography-friendly' : 'Cultural explorer',
    accessibility: /wheelchair|mobility|accessible|step[- ]free/.test(t) ? 'Accessibility needs noted — confirm site-level access before travel' : 'Not specified',
    season: (t.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/) || [])[1] || (/dasara|dussehra/.test(t) ? 'Dasara period' : 'Flexible season'),
  }
}

const placeGuidance = {
  'Mysuru Palace': {
    significance: 'A major palace complex and an important setting for Mysuru’s ceremonial and festival heritage.',
    time: '1.5–2.5 hours', bestTime: 'Morning or late afternoon for a more comfortable visit.', etiquette: 'Follow photography, footwear and security rules in designated areas.', booking: 'Regular entry is generally ticketed; verify current timings and special-event access before visiting.', verified: true,
  },
  'Mysuru Dasara': {
    significance: 'A major cultural celebration in Mysuru combining procession, music, dance, illumination and ceremonial traditions.',
    time: 'Half day to a full day depending on the programme', bestTime: 'During the official Dasara festival period.', etiquette: 'Treat ceremonial spaces and processions respectfully; follow crowd and security guidance.', booking: 'Special seating and ticketed programmes can require advance arrangements; check official festival information.', verified: true,
  },
  'Yakshagana': {
    significance: 'A coastal Karnataka dance-drama tradition combining movement, music, dialogue, costume and storytelling.',
    time: '2–4 hours for a performance or introductory experience', bestTime: 'Evening performances; schedules vary by season and troupe.', etiquette: 'Ask before photographing performers backstage and respect performance spaces.', booking: 'Performance schedules are venue- and troupe-specific; advance verification is recommended.', verified: true,
  },
  'Hampi': {
    significance: 'A historic landscape of monumental architecture and archaeological remains associated with the Vijayanagara period.',
    time: 'Half day to 2 days', bestTime: 'Cooler morning and late-afternoon periods.', etiquette: 'Stay on marked paths, do not climb protected structures, and dress respectfully at active religious sites.', booking: 'Some monuments and museums are ticketed; verify current entry rules.', verified: true,
  },
  'Udupi cuisine': {
    significance: 'A well-known regional food tradition associated with Udupi and the wider coastal Karnataka food culture.',
    time: '1–2 meals', bestTime: 'Any season; choose established local eateries and seasonal dishes.', etiquette: 'Respect dining customs and dietary practices of the venue.', booking: 'Usually not needed for ordinary meals; popular specialty venues may have queues.', verified: true,
  },
}

function makeItem(name, place, state, district, extra = {}) {
  const guide = placeGuidance[name] || {}
  return { name, place, state, district, ...guide, ...extra }
}

function karnatakaPlan(days, prefs) {
  const core = [
    { title: 'Mysuru', intro: 'Palace heritage, city traditions and local foodways.', stops: [makeItem('Mysuru Palace', 'Mysuru Palace', 'Karnataka', 'Mysuru'), makeItem('Mysuru Dasara', 'Mysuru cultural core', 'Karnataka', 'Mysuru', { significance: 'Explore the festival heritage through documented history and, when in season, official programmes.', time: '1–3 hours outside peak festival days', bestTime: 'Festival season for live programmes; otherwise daytime for heritage context.', booking: 'Check official programme details if your visit coincides with Dasara.', verified: true }), makeItem('Mysuru cuisine', 'Mysuru', 'Karnataka', 'Mysuru', { significance: 'Explore local sweets and regional dishes as part of the city’s food heritage.', time: '1–2 hours', bestTime: 'Meal time; choose established local venues.', etiquette: 'Respect venue-specific dining customs.', booking: 'Usually not required.', verified: true })] },
    { title: 'Coastal Karnataka', intro: 'Performance, foodways and coastal craft traditions.', stops: [makeItem('Yakshagana', 'Udupi / Dakshina Kannada', 'Karnataka', 'Udupi / Dakshina Kannada'), makeItem('Udupi cuisine', 'Udupi', 'Karnataka', 'Udupi'), makeItem('Coastal craft traditions', 'Coastal Karnataka', 'Karnataka', 'Udupi / Dakshina Kannada', { significance: 'Explore regional making and material culture through local museums, cultural institutions or verified workshops.', time: '1–2 hours', bestTime: 'Daytime for workshops; evening for performances where scheduled.', etiquette: 'Ask permission before entering workspaces or photographing practitioners.', booking: 'Workshop availability is venue-specific; confirm before travel.', verified: false })] },
    { title: 'Hampi Region', intro: 'Monumental landscapes and living heritage around a historic cultural centre.', stops: [makeItem('Hampi', 'Hampi', 'Karnataka', 'Vijayanagara region'), makeItem('Traditional arts/community experiences', 'Hampi region', 'Karnataka', 'Vijayanagara region', { significance: 'Use verified local cultural centres and museums to connect the archaeological landscape with living regional practice.', time: '1–2 hours', bestTime: 'Morning or late afternoon.', etiquette: 'Respect protected monuments and active shrines.', booking: 'Only through verified venue or guide channels.', verified: false })] },
  ]
  return Array.from({ length: days }, (_, index) => core[index] || core[core.length - 1]).map((day, index) => ({ ...day, day: index + 1 }))
}

function genericPlan(state, days) {
  const festivals = state.festivals.map((item) => item.name)
  const dance = state.danceForms
  const food = state.cuisine
  const crafts = state.artsCrafts
  const monuments = state.monuments
  const picks = [
    { title: state.capital, intro: `Begin with the cultural core of ${state.state}.`, stops: [makeItem(monuments[0] || `${state.capital} heritage`, state.capital, state.state, state.capital, { significance: `Start with a documented heritage place in ${state.state}'s cultural landscape.`, time: '1.5–3 hours', bestTime: 'Morning or late afternoon.', etiquette: 'Follow site rules and respect active religious spaces.', booking: 'Check the official site for current ticketing or timing.', verified: true }), makeItem(festivals[0] || 'Regional festival traditions', state.capital, state.state, state.capital, { significance: 'Use the festival tradition as a lens for understanding local music, food, ritual and community life.', time: '1–3 hours', bestTime: 'Around the official festival calendar.', etiquette: 'Follow local guidance; do not intrude on private rituals.', booking: 'Special programmes may require advance planning.', verified: true })] },
    { title: 'Living traditions', intro: `Explore performance, food and making traditions associated with ${state.state}.`, stops: [makeItem(dance[0] || 'Regional performance tradition', state.state, state.state, 'Regional', { significance: 'A documented cultural practice from the state profile.', time: '1–3 hours', bestTime: 'When scheduled locally.', etiquette: 'Ask before photographing artists or entering practice spaces.', booking: 'Confirm venue or troupe schedules.', verified: true }), makeItem(food[0] || 'Regional cuisine', state.state, state.state, 'Regional', { significance: 'Use local foodways to understand ingredients, techniques and everyday heritage.', time: '1–2 hours', bestTime: 'Meal time.', etiquette: 'Respect venue-specific dining customs.', booking: 'Usually not needed.', verified: true })] },
    { title: 'Craft & heritage', intro: 'Close with material culture and a deeper heritage experience.', stops: [makeItem(crafts[0] || 'Traditional craft', state.state, state.state, 'Regional', { significance: 'A documented craft tradition from the curated state profile.', time: '1–2 hours', bestTime: 'Daytime.', etiquette: 'Buy responsibly and avoid touching works in progress without permission.', booking: 'Workshops should be confirmed in advance.', verified: true }), makeItem(monuments[1] || 'Heritage site', state.state, state.state, 'Regional', { significance: 'Explore a second documented heritage place.', time: '1–2.5 hours', bestTime: 'Morning or late afternoon.', etiquette: 'Follow protection and photography rules.', booking: 'Verify current entry rules.', verified: true })] },
  ]
  return Array.from({ length: days }, (_, index) => ({ ...picks[Math.min(index, picks.length - 1)], day: index + 1 }))
}

function buildPlannerAnswer(input) {
  const state = findState(input)
  const days = extractDays(input)
  const prefs = extractPreferences(input)
  const budget = extractBudget(input)
  if (!state) return null
  const itinerary = slugify(state.state) === 'karnataka' ? karnatakaPlan(days, prefs) : genericPlan(state, days)
  return { state, days, prefs, budget, itinerary }
}

function formatPlannerSummary(plan) {
  const interests = plan.prefs.interests.length ? plan.prefs.interests.join(', ') : 'general cultural discovery'
  return `I’ve shaped a ${plan.days}-day cultural plan for ${plan.state.state} around ${interests}. Travel style: ${plan.prefs.style}. Food: ${plan.prefs.food}. Budget: ${plan.budget}. ${plan.prefs.accessibility !== 'Not specified' ? plan.prefs.accessibility + '.' : ''}`
}

function sourceMeta(kind='verified') {
  if (kind === 'community') return { type:'community', label:'Community Source' }
  if (kind === 'ai') return { type:'ai', label:'AI Suggestion' }
  return { type:'verified', label:'Verified Source' }
}

function relatedTraditionsFor(text) {
  const t = lower(text)
  const keys = t.split(/\s+/).filter((w) => w.length > 4)
  const match = TRADITIONS.find((item) => keys.some((word) => lower(item.name).includes(word)))
  if (!match) return []
  return TRADITIONS.filter((item) => item.id !== match.id && (item.type === match.type || item.state === match.state)).slice(0, 3)
}

function answerFor(input) {
  const text = lower(input)
  if (!text) return { text: 'Tell me a place, tradition, duration, interest, season, budget or travel preference. You can ask naturally, for example: “Show me traditional music traditions within 100 km of Mysuru.”', actions: [], source: sourceMeta('ai') }

  const plan = buildPlannerAnswer(input)
  if (plan) return { type: 'itinerary', text: formatPlannerSummary(plan), plan, source: sourceMeta('ai') }

  if (['hi','hello','hey','namaste'].includes(text)) return { text: 'Namaste! I’m your AI Heritage Guide. I can explore the atlas with you, explain curated cultural facts, connect related traditions, suggest trails, compare traditions, and shape travel ideas. I will clearly separate verified information from planning suggestions.', source: sourceMeta('ai'), actions: [{ label: 'Build My Heritage Itinerary', command: 'prompt:Plan 3 days in Karnataka' }, { label: 'Open AI + Heritage', to: '/ai-heritage', icon: Sparkles }] }

  if (text.includes('100 km') || text.includes('within 100km') || text.includes('within 100 km')) {
    if (text.includes('mysuru')) {
      const profile = getDistrictProfile('karnataka', 'Mysuru')
      const music = stateData.karnataka?.music?.slice(0,3) || []
      return { text: `Within the curated atlas data around Mysuru, the strongest documented cultural layer currently centres on the Mysuru district itself. Its profile highlights ${joinList(profile?.highlights || [], 4)}. For a music-focused visit, the Karnataka profile lists ${joinList(music, 3)}. The atlas does not claim live venues or current schedules without verification.`, source: sourceMeta('verified'), actions: [{ label: 'Explore Mysuru on the atlas', to: '/state/karnataka', icon: MapPinned }, { label: 'Build a music-focused trip', command: 'prompt:Plan 1 day in Karnataka focused on music, Mysuru, relaxed pace' }] }
    }
  }

  if ((text.includes('compare') || text.includes('difference between')) && (text.includes('phulkari') || text.includes('banarasi'))) {
    const a = TRADITIONS.find((x) => lower(x.name).includes('phulkari'))
    const b = TRADITIONS.find((x) => lower(x.name).includes('banarasi'))
    return { text: `Phulkari and Banarasi weaving are both important textile traditions, but the curated profiles describe different techniques, materials and regional contexts. Phulkari is profiled for Punjab and hand embroidery traditions; Banarasi silk weaving is profiled for Varanasi in Uttar Pradesh. Open both profiles to compare their place, practice and preservation context.`, source: sourceMeta('verified'), actions: [{ label: 'Open Phulkari', to: `/tradition/${a.id}`, icon: Compass }, { label: 'Open Banarasi weaving', to: `/tradition/${b.id}`, icon: Compass }] }
  }

  if (text.includes('explain') && text.includes('yakshagana')) return { text: 'Yakshagana is a coastal Karnataka dance-drama tradition combining movement, music, dialogue, elaborate costume and storytelling. For a beginner, think of it as theatre, music and dance working together in one performance tradition. The atlas distinguishes this curated description from any current-event or venue suggestion.', source: sourceMeta('verified'), actions: [{ label: 'Open Yakshagana profile', to: '/tradition/karnataka-yakshagana', icon: Compass }, { label: 'Explore Karnataka', to: '/state/karnataka', icon: MapPinned }] }

  if (text.includes('learn') && text.includes('yakshagana')) return { text: 'Yakshagana is documented in the atlas for coastal Karnataka, especially the Udupi and Dakshina Kannada cultural region. I will not invent a school, teacher or troupe; for a real learning opportunity, check current listings from established cultural institutions or verified performing groups in the region.', source: sourceMeta('verified'), actions: [{ label: 'Open Yakshagana profile', to: '/tradition/karnataka-yakshagana', icon: Compass }, { label: 'Explore Karnataka', to: '/state/karnataka', icon: MapPinned }] }

  if (text.includes('related') || text.includes('similar tradition')) {
    const related = relatedTraditionsFor(text)
    if (related.length) return { text: `Here are related traditions from the curated atlas: ${related.map((x) => x.name).join(', ')}. These connections are discovery suggestions based on shared state or cultural type, not claims of identical practice.`, source: sourceMeta('ai'), actions: related.map((x) => ({ label: `Open ${x.name}`, to: `/tradition/${x.id}`, icon: Compass })) }
  }

  if (text.includes('at risk') || text.includes('endangered') || text.includes('fading')) {
    const requestedState = findState(input)
    const matches = requestedState ? TRADITIONS.filter((item) => lower(item.state) === lower(requestedState.state) && /at risk|declining|fading|preservation/i.test(item.status)) : TRADITIONS.filter((item) => /at risk|declining|fading|preservation/i.test(item.status)).slice(0, 6)
    const names = matches.map((item) => `${item.name} (${item.status})`).join(', ')
    return { text: requestedState && matches.length ? `For ${requestedState.state}, the curated atlas currently flags: ${names}. These labels are preservation-oriented editorial classifications in this product, not a universal national ranking. Open the risk layer to inspect the context behind each profile.` : `The curated Heritage at Risk layer currently includes: ${names}. These are cautious preservation-oriented classifications in this product, not a universal national risk ranking.`, source: sourceMeta('verified'), actions: [{ label: 'Explore Heritage at Risk', to: '/heritage-at-risk', icon: Heart }] }
  }

  if (text.includes('hampi') && (text.includes('heritage trail') || text.includes('trail'))) return { text: 'Around Hampi, prioritize the historic monumental landscape first, then add a verified local cultural centre or museum experience. I will keep heritage facts separate from planning suggestions and won’t invent a trail operator.', source: sourceMeta('verified'), actions: [{ label: 'Open Karnataka atlas', to: '/#atlas', icon: MapPinned }, { label: 'Plan Hampi', command: 'prompt:Plan 1 day in Karnataka focused on Hampi heritage and architecture' }, { label: 'Browse Heritage Trails', to: '/trails', icon: RouteIcon }] }

  if (text.includes('coastal karnataka') && (text.includes('food') || text.includes('cuisine'))) return { text: 'For coastal Karnataka, start with the curated Udupi/coastal foodway layer. The Karnataka profile highlights Udupi cuisine and regional foodways; for a deeper experience, combine a meal with a verified cultural or culinary venue rather than relying on invented recommendations.', source: sourceMeta('verified'), actions: [{ label: 'Explore Karnataka', to: '/state/karnataka', icon: MapPinned }, { label: 'Plan a coastal trip', command: 'prompt:Plan 2 days in Karnataka, coastal food and culture, relaxed pace' }] }

  if (text.includes('only one day') || text.includes('one day')) {
    const state = findState(input)
    if (state) {
      return { type:'itinerary', text:`For one day in ${state.state}, I would prioritize one documented heritage place, one living cultural tradition and one regional food experience. I’ve built a one-day plan below; treat venue timing and availability as current checks rather than static facts.`, plan: buildPlannerAnswer(`${input} 1 day`) || buildPlannerAnswer(`1 day in ${state.state}`), source: sourceMeta('ai') }
    }
  }

  const traditionMatch = TRADITIONS.find((item) => text.includes(lower(item.name)) || lower(item.name).split(' ').some((word) => word.length > 4 && text.includes(word)))
  if (traditionMatch) {
    return { text: `${traditionMatch.name} is profiled in the atlas for ${traditionMatch.state}, ${traditionMatch.district}. ${traditionMatch.summary} The current profile labels its status as ${traditionMatch.status}. For live workshops, people or events, the guide avoids inventing details and points you back to verified sources.`, source: sourceMeta('verified'), actions: [{ label: 'Open tradition profile', to: `/tradition/${traditionMatch.id}`, icon: Compass }] }
  }

  const state = findState(text)
  if (state) {
    const key = slugify(state.state)
    const language = regionalLanguages[key]
    if (text.includes('language') || text.includes('speak')) return { text: `${state.state} lists ${joinList(state.languages, 4)}. Its regional-language view is ${language?.languageName ?? state.languages?.[0] ?? 'available soon'}.`, source: sourceMeta('verified'), actions: [{ label: `Open ${state.state}`, to: `/state/${key}`, icon: MapPinned }] }
    if (text.includes('festival')) return { text: `${state.state} festivals include ${joinList(state.festivals.map((item) => item.name), 4)}. For live dates, verify the current official festival programme before travelling.`, source: sourceMeta('verified'), actions: [{ label: 'See profile', to: `/state/${key}`, icon: Compass }] }
    if (text.includes('dance') || text.includes('music')) return { text: `${state.state} dance traditions include ${joinList(state.danceForms, 3)}; musical traditions include ${joinList(state.music, 3)}.`, source: sourceMeta('verified'), actions: [{ label: 'See dance & music', to: `/state/${key}`, icon: Compass }] }
    if (text.includes('food') || text.includes('cuisine') || text.includes('dish')) return { text: `For ${state.state}, the curated profile highlights ${joinList(state.cuisine, 5)}.`, source: sourceMeta('verified'), actions: [{ label: 'Explore cuisine', to: `/state/${key}`, icon: Compass }] }
    if (text.includes('craft') || text.includes('artisan') || text.includes('art')) return { text: `${state.state} arts and crafts include ${joinList(state.artsCrafts, 5)}. For current workshops or artisan visits, I will only recommend verified venues or organisations you provide; I will not invent practitioners.`, source: sourceMeta('verified'), actions: [{ label: 'See arts & crafts', to: `/state/${key}`, icon: Compass }] }
    if (text.includes('monument') || text.includes('heritage place')) return { text: `Notable monuments listed for ${state.state} include ${joinList(state.monuments, 4)}.`, source: sourceMeta('verified'), actions: [{ label: 'See monuments', to: `/state/${key}`, icon: Compass }] }
    return { text: `${state.state} — capital: ${state.capital}. Languages: ${joinList(state.languages, 4)}. Festivals: ${joinList(state.festivals.map((item) => item.name), 3)}. Dance: ${joinList(state.danceForms, 2)}. Cuisine: ${joinList(state.cuisine, 3)}.`, source: sourceMeta('verified'), actions: [{ label: `Open ${state.state}`, to: `/state/${key}`, icon: MapPinned }] }
  }

  const nearby = text.includes('mysuru') || text.includes('udupi') || text.includes('hampi')
  if (nearby) {
    const matched = text.includes('mysuru') ? 'Mysuru' : text.includes('udupi') ? 'Udupi' : 'Hampi'
    const profile = matched === 'Mysuru' ? getDistrictProfile('karnataka', 'Mysuru') : matched === 'Udupi' ? getDistrictProfile('karnataka', 'Udupi') : null
    if (profile) return { text: `${matched} is a curated district hub. Highlights include ${joinList(profile.highlights, 4)}. Traditions listed include ${joinList(profile.traditions, 4)}.`, source: sourceMeta('verified'), actions: [{ label: 'Explore Karnataka', to: '/state/karnataka', icon: MapPinned }] }
  }

  return { text: 'I can help you explore the atlas conversationally. Try “Show me traditional music traditions within 100 km of Mysuru”, “Which Karnataka traditions are at risk?”, “Explain Yakshagana for a beginner”, “Compare Phulkari and Banarasi weaving”, or “Build a 2-day craft-focused heritage trip.”', source: sourceMeta('ai'), actions: [{ label:'Explore AI + Heritage', to:'/ai-heritage', icon:Sparkles }] }
}

function ActionButton({ action, onAction, close }) {
  const Icon = action.icon || Compass
  if (action.command) return <button onClick={() => { onAction(action.command); close?.() }} className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-3 py-1.5 text-xs font-bold text-white hover:-translate-y-0.5 hover:shadow-md"><Icon size={12}/>{action.label}</button>
  return <Link to={action.to} onClick={close} className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-3 py-1.5 text-xs font-bold text-white hover:-translate-y-0.5 hover:shadow-md"><Icon size={12}/>{action.label}</Link>
}

function ItineraryCard({ plan, onSave, onShare, onMap, onCustomize }) {
  const { t } = useLanguage()
  return <div className="mt-3 overflow-hidden rounded-3xl border border-maroon/10 bg-white shadow-card">
    <div className="border-b border-maroon/10 bg-[#FFFDF7] px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-[10px] font-bold uppercase tracking-[.18em] text-maroon/55">AI-generated planning layer</div><div className="mt-1 font-display text-2xl text-maroon">{plan.days}-day {plan.state.state} cultural plan</div></div><span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700"><CheckCircle2 size={12}/> {t.verified}</span></div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-ink/55"><span className="rounded-full bg-cream px-2.5 py-1">{plan.prefs.style}</span><span className="rounded-full bg-cream px-2.5 py-1">{plan.prefs.food}</span><span className="rounded-full bg-cream px-2.5 py-1">{plan.budget}</span><span className="rounded-full bg-cream px-2.5 py-1">{plan.prefs.season}</span></div>
    </div>
    <div className="space-y-3 p-3">{plan.itinerary.map((day) => <div key={day.day} className="rounded-2xl bg-cream p-3"><div className="flex items-start gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-maroon text-xs font-bold text-gold">{day.day}</div><div className="min-w-0"><div className="text-[10px] font-bold uppercase tracking-[.16em] text-maroon/55">Day {day.day}</div><div className="font-display text-xl text-maroon">{day.title}</div><p className="mt-1 text-xs leading-5 text-ink/55">{day.intro}</p></div></div><div className="mt-3 space-y-2">{day.stops.map((stop) => <div key={`${day.day}-${stop.name}`} className="rounded-2xl border border-maroon/10 bg-white p-3"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-bold text-ink">{stop.name}</div><div className="mt-0.5 text-[11px] text-ink/45">{stop.place} · {stop.district}</div></div><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${stop.verified ? 'bg-teal-50 text-teal-700' : 'bg-gold/20 text-maroon'}`}>{stop.verified ? t.verified : t.suggestion}</span></div><div className="mt-2 grid gap-1.5 text-[11px] leading-5 text-ink/60"><div><b>{t.learn}:</b> {stop.significance}</div><div><b>Time:</b> {stop.time}</div><div><b>Best time:</b> {stop.bestTime}</div><div><b>Etiquette:</b> {stop.etiquette}</div><div><b>Booking:</b> {stop.booking}</div></div></div>)}</div></div>)}</div>
    <div className="flex flex-wrap gap-2 border-t border-maroon/10 bg-[#FFFDF7] p-3"><button onClick={onCustomize} className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-3 py-2 text-xs font-bold text-white"><SlidersHorizontal size={13}/> {t.customize}</button><button onClick={onMap} className="inline-flex items-center gap-1.5 rounded-full border border-maroon/15 px-3 py-2 text-xs font-bold text-maroon"><MapPinned size={13}/> {t.viewMap}</button><button onClick={onCustomize} className="inline-flex items-center gap-1.5 rounded-full border border-maroon/15 px-3 py-2 text-xs font-bold text-maroon"><SlidersHorizontal size={13}/> {t.customize}</button><button onClick={onSave} className="inline-flex items-center gap-1.5 rounded-full border border-maroon/15 px-3 py-2 text-xs font-bold text-maroon"><Save size={13}/> {t.save}</button><button onClick={onShare} className="inline-flex items-center gap-1.5 rounded-full border border-maroon/15 px-3 py-2 text-xs font-bold text-maroon"><Share2 size={13}/> {t.share}</button></div>
  </div>
}

export default function CultureBot() {
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [lastPlan, setLastPlan] = useState(null)
  const bot = BOT_COPY[language] || BOT_COPY.en
  const [messages, setMessages] = useState([{ role: 'bot', text: bot.greeting }])
  useEffect(() => { setMessages((current) => current.length === 1 && current[0].role === 'bot' ? [{ role: 'bot', text: bot.greeting }] : current) }, [language])
  useEffect(() => { const handler = (event) => { setOpen(true); const prompt = event.detail?.prompt; if (prompt) { setInput(prompt); setTimeout(() => send(prompt), 90) } }; window.addEventListener('open-heritage-guide', handler); return () => window.removeEventListener('open-heritage-guide', handler) }, [])
  const suggestions = useMemo(() => quickReplies.filter((q) => !messages.some((m) => m.text === q)), [messages])

  function addBot(answer) {
    if (answer.type === 'itinerary') setLastPlan(answer.plan)
    setMessages((current) => [...current, { role: 'bot', text: answer.text, actions: answer.actions, plan: answer.plan, source: answer.source }])
  }

  function send(text = input) {
    const value = text.trim()
    if (!value) return
    const answer = answerFor(value)
    setMessages((current) => [...current, { role: 'user', text: value }])
    setInput('')
    setTimeout(() => addBot(answer), 140)
  }

  function handleActionCommand(command) {
    if (command.startsWith('prompt:')) {
      const prompt = command.slice(7)
      setInput(prompt)
      setTimeout(() => send(prompt), 80)
    }
  }

  function resetChat() {
    setLastPlan(null)
    setMessages([{ role: 'bot', text: bot.greeting }])
  }

  function saveTrip(plan = lastPlan) {
    if (!plan) return
    localStorage.setItem('indian-heritage-saved-trip', JSON.stringify(plan))
    setMessages((current) => [...current, { role: 'bot', text: `${t.save}: this heritage itinerary is saved on this device.` }])
  }

  async function shareTrip(plan = lastPlan) {
    if (!plan) return
    const summary = `${plan.days}-day ${plan.state.state} cultural plan — ${plan.itinerary.map((d) => `Day ${d.day}: ${d.title}`).join(' · ')}`
    try {
      if (navigator.share) await navigator.share({ title: 'Indian Heritage itinerary', text: summary })
      else await navigator.clipboard.writeText(summary)
      setMessages((current) => [...current, { role: 'bot', text: navigator.share ? 'Your itinerary is ready to share.' : 'Your itinerary summary was copied to the clipboard.' }])
    } catch { /* user cancelled share */ }
  }

  function customizeTrip() {
    const state = lastPlan?.state?.state || 'Karnataka'
    setInput(`Customize my ${lastPlan?.days || 3}-day trip in ${state}: add more crafts, adjust the pace, and keep the plan culturally focused.`)
  }

  return <div className="fixed bottom-5 right-5 z-[70] sm:bottom-7 sm:right-7">
    {open && <div className="mb-3 flex w-[min(94vw,480px)] origin-bottom-right flex-col overflow-hidden rounded-[1.5rem] border border-maroon/15 bg-cream shadow-2xl animate-pop">
      <div className="flex items-center justify-between bg-maroon px-4 py-3 text-white"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gold text-ink"><Bot size={18}/></span><div><div className="text-sm font-bold">AI Heritage Guide</div><div className="text-[10px] uppercase tracking-[.18em] text-white/55">Cultural concierge · contextual planner</div></div></div><div className="flex items-center gap-1"><button onClick={resetChat} aria-label="Reset chat" className="rounded-full p-1.5 hover:bg-white/10"><RotateCcw size={15}/></button><button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1.5 hover:bg-white/10"><X size={17}/></button></div></div>
      <div className="border-b border-maroon/10 bg-white/70 px-4 py-2 text-[10px] leading-4 text-ink/55"><b>{bot.verified}</b> comes from the curated atlas. <b>{bot.suggestion}</b> are generated from those facts and should be checked against current official venue/event information.</div>
      <div className="max-h-[62vh] space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message, index) => <div key={`${message.text}-${index}`} className={message.role === 'user' ? 'ml-10 rounded-2xl rounded-tr-md bg-gold/25 px-3 py-2 text-sm' : 'mr-2 rounded-2xl rounded-tl-md bg-white px-3 py-2 text-sm leading-5 shadow-sm'}><div>{message.text}</div>{message.source && <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-maroon/70"><span className={`h-1.5 w-1.5 rounded-full ${message.source.type==='verified'?'bg-green-600':message.source.type==='community'?'bg-gold':'bg-maroon'}`}/>{message.source.label}</div>}{message.plan && <ItineraryCard plan={message.plan} onSave={() => saveTrip(message.plan)} onShare={() => shareTrip(message.plan)} onMap={() => navigate('/#atlas')} onCustomize={customizeTrip}/>} {message.actions?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{message.actions.map((action) => <ActionButton key={action.label} action={action} onAction={handleActionCommand} close={() => setOpen(false)}/>)}</div>}</div>)}
        {suggestions.length > 0 && <div className="flex flex-wrap gap-2">{suggestions.slice(0, 4).map((q) => <button key={q} onClick={() => send(q)} className="rounded-full border border-maroon/10 bg-white px-3 py-1.5 text-xs font-semibold text-maroon hover:-translate-y-0.5 hover:shadow-card">{q}</button>)}</div>}
      </div>
      <div className="border-t border-maroon/10 p-3"><div className="flex gap-2 rounded-full border border-maroon/10 bg-white px-3 py-2"><input lang={language} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder={bot.placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none"/><button onClick={() => send()} aria-label="Send message" className="grid h-8 w-8 place-items-center rounded-full bg-maroon text-white hover:scale-105"><Send size={14}/></button></div><div className="mt-2 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[.12em] text-ink/35"><div>{t.atlas} · {bot.context}</div></div></div>
    </div>}
    <button onClick={() => setOpen((value) => !value)} className="group relative ml-auto grid h-16 w-16 place-items-center rounded-full bg-maroon text-gold shadow-2xl shadow-maroon/25 animate-bob hover:scale-105" aria-label={open ? 'Close Indian Heritage guide' : 'Open Indian Heritage guide'}><span className="absolute inset-0 rounded-full border border-gold/40 animate-pulse-ring"/><Bot size={27}/><Sparkles size={12} className="absolute right-3 top-3 transition group-hover:rotate-12"/></button>
  </div>
}
