export const AI_PRINCIPLE = 'AI helps you discover heritage — communities and experts help preserve it.'

export const AI_CAPABILITIES = [
  { id:'recommend', icon:'Sparkles', title:'Personalized discovery', body:'Match places, traditions and trails to interests, time, food preferences, pace and accessibility needs.' },
  { id:'search', icon:'Search', title:'Natural-language cultural search', body:'Ask the atlas questions in everyday language instead of searching by exact keywords.' },
  { id:'itinerary', icon:'Route', title:'Heritage itinerary planning', body:'Turn a destination, duration and interests into a culture-led plan with clear suggestion labels.' },
  { id:'compare', icon:'GitCompare', title:'Cultural comparison', body:'Compare traditions, places, materials and cultural contexts without flattening their differences.' },
  { id:'translate', icon:'Languages', title:'Translation assistance', body:'Explore supported languages while preserving important cultural names and traditional terms.' },
  { id:'connect', icon:'Network', title:'Related traditions', body:'Connect crafts, foodways, music, festivals, landscapes and heritage places that share a cultural context.' },
  { id:'trails', icon:'MapPinned', title:'Trail suggestions', body:'Use the atlas to move from a tradition to a relevant heritage trail or geographic route.' },
  { id:'map', icon:'Map', title:'Conversational map exploration', body:'Ask for traditions by place, district or radius and jump back into the atlas for geographic context.' },
]

export const AI_GUARDRAILS = [
  'Verified cultural facts are kept separate from AI-generated planning suggestions.',
  'The guide does not invent artisans, organisations, venues, events or historical claims.',
  'Community and indigenous knowledge is treated with context and care rather than as content to extract.',
  'Sacred, ceremonial or sensitive practices are presented with respectful context and without encouraging intrusion.',
  'External links should be checked for current availability, legitimacy, provenance and community protocols.',
]

export const SOURCE_TYPES = {
  verified: { label:'Verified Source', tone:'green', description:'Grounded in curated cultural records used by the atlas.' },
  community: { label:'Community Source', tone:'gold', description:'Presented as community or practitioner context where documented.' },
  ai: { label:'AI Suggestion', tone:'maroon', description:'A planning or discovery suggestion generated from the curated atlas; verify current details.' },
}

export const AI_EXAMPLE_PROMPTS = [
  'Show me traditional music traditions within 100 km of Mysuru.',
  'Which Karnataka traditions are at risk?',
  'Explain the cultural significance of Yakshagana for a beginner.',
  'Build a 2-day craft-focused heritage trip.',
  'Compare Phulkari and Banarasi weaving traditions.',
  'Show me related traditions to Ajrakh printing.',
]
