# Indian Heritage

A premium, responsive React cultural atlas for exploring India's living heritage.

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173/`.

## Project structure

- `src/components/` shared map, search, comparison, quiz and culture-assistant UI
- `src/pages/` Home, StateDetail, Search, Compare, Quiz, About and NotFound routes
- `src/data/states/` static JSON profiles
- `src/data/regionalLanguages.js` regional-script labels shown alongside English on profile pages
- `public/images/` local visual fallbacks

## Map interaction

- Hover a region to reveal its English state/UT name and cultural theme.
- Scroll over the map to zoom.
- Use the + / − controls for precise zooming.
- Click a region to open its profile.
- The state detail page intentionally ends after the cultural profile content; there is no Previous/Next state navigation.

## Cultural imagery

The map uses cultural photography where available, with local SVG fallbacks when remote imagery is unavailable. For public deployment, keep attribution/license information for every photograph and replace any temporary asset with a team-verified licensed image.

## Regional language mode
Each featured state profile now includes an English / regional-language toggle. The toggle localizes the profile heading, section tabs, metadata labels, dress narrative, festival names and descriptions, folklore narrative, and supporting cultural descriptions. Dance, music, cuisine, craft, and monument proper names remain in standard/common spellings where that is clearer for visitors.

## Enhanced interaction features

The Culture Quiz now supports topic and difficulty filters, selectable quiz length, randomized question order, a per-question countdown, hints, streaks, persistent best streak/best score in the browser, instant explanations, and a result summary.

The Darshan Guide chatbot is still fully client-side and now understands state-specific questions about languages, festivals, dance/music, cuisine, dress, arts/crafts and monuments, offers state recommendations, handles common help/greeting queries, and provides direct navigation buttons into the relevant page.

## Heritage at Risk

The homepage now includes a filterable, source-aware **Heritage at Risk** section and a dedicated `/heritage-at-risk` page. Cards cover traditional weaving, folk music, oral storytelling, traditional crafts, traditional instruments, ritual/community traditions and related safeguarding contexts.

The risk labels are editorial communication labels, not a single official Government of India ranking. Where a craft is explicitly named in the Development Commissioner (Handicrafts) list of identified endangered crafts, the card says so. Broader categories are described as declining or preservation-priority only when supported by cultural safeguarding sources.

### Added atlas routes
- `/trails` — curated heritage trails
- `/tradition/:traditionId` — dedicated tradition profile
- The home page map now works as India → State → District → Tradition discovery.

## AI Heritage Guide

The floating guide is a context-aware, client-side cultural travel planner. It parses destination, duration, interests, food preference, travel style, budget, accessibility cues and season/festival timing from natural-language requests, then generates a structured itinerary from the curated local data.

The guide labels itinerary content as either **Verified profile fact** or **Planning suggestion**. It does not claim live event availability, invent artisan names, or fabricate organizations. Current venue timings, event schedules and special booking requirements should be checked against official sources before travel.

Trip saving uses browser local storage and Share Trip uses the browser's native share API when available, otherwise it copies a concise itinerary summary to the clipboard.

## Heritage Trails
The `/trails` route is a map-led cultural journey builder. It includes thematic trail categories, filters, route maps, stop timelines, responsible purchasing guidance, Save/Share/Customize/Add Stop actions, and local-storage persistence for saved trails. Trail details intentionally distinguish curated cultural information from live travel information that should be checked with official or local sources.

## Traditional Craft Discovery

A dedicated `/crafts` discovery page and `/craft/:craftId` profile route now put craft practitioners, places, technique and cultural knowledge before commerce. Featured profiles include structured sections for what the craft is, where it is practiced, who practices it, history/origins, materials and process, Learn, Watch, Visit, Buy Responsibly and Support, with map/trail/save/similar-tradition actions.


## Multilingual discovery
The site now includes a first-run language onboarding flow and a prominent “Explore in Your Language” homepage feature covering English, Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia and Assamese. The selected language persists in localStorage. Reviewed regional-language state copy is used where available; proper names and traditional terms are intentionally preserved when a translation could reduce accuracy.


## AI + Heritage layer

The project includes a client-side AI Heritage Guide/planning layer in `src/components/CultureBot.jsx` and `src/pages/AIHeritage.jsx`. It supports conversational cultural discovery, itinerary planning, risk/tradition lookup, related-tradition connections, map-oriented prompts, and trust labels. This build uses the curated local atlas as its knowledge source; it does not call an external LLM API, so recommendations are bounded by the available local data and are labeled as AI suggestions where appropriate.

## Explore India by Culture
The homepage now includes a prominent culture-first discovery layer with categories such as Food, Dance, Music, Textiles, Crafts, Architecture, Festivals, Folklore, Tribes & Communities, Theatre, Languages, Traditional Knowledge, Rituals, and Heritage Sites. Selecting a category opens an interactive India → State → District → Tradition exploration panel and can sync the active cultural lens back to the atlas map.
