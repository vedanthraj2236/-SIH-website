const commons = (filename) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}`

export const HERITAGE_RISK_ITEMS = [
  {
    id: 'navalgund-durries',
    tradition: 'Navalgund Durries',
    state: 'Karnataka', district: 'Navalgund', community: 'Local weaving families; Muslim Sheikh women have historically carried the practice',
    type: 'Traditional Weaving', risk: 'At Risk',
    description: 'Handwoven floor coverings known for geometric designs and the punja weaving technique, made on vertical pit-looms using cotton or wool.',
    riskReason: 'The craft depends on specialised hand skills and a small artisan base, making intergenerational transmission and sustainable demand important for continuity.',
    image: commons('Navalgund Durries.jpg'), fallback: '/images/states/karnataka.svg',
    source: 'Office of Development Commissioner (Handicrafts) — Navalgund Durries; identified in government endangered-craft material.',
    sourceUrl: 'https://handicrafts.nic.in/crafts/All_Crafts/Craft_Categories/Textile/Carpet_Rugs_and_Durries/Navalgund_Durries_of_Karnataka/NavalgundDurriesWebPage.html',
    slug: 'karnataka'
  },
  {
    id: 'sanjhi',
    tradition: 'Sanjhi Paper Cutting',
    state: 'Uttar Pradesh', district: 'Mathura', community: 'Craft practitioners in Mathura–Vrindavan',
    type: 'Traditional Crafts', risk: 'At Risk',
    description: 'Intricate paper-cutting used for devotional and decorative compositions, shaped through hand-cut stencils and fine pattern work.',
    riskReason: 'The government’s endangered-craft list identifies Sanjhi as a craft requiring continued documentation, skilled practice and livelihood support.',
    image: commons('Sanjhi craft Mathura.jpg'), fallback: '/images/states/uttar-pradesh.svg',
    source: 'Development Commissioner (Handicrafts) — List of Identified as Endangered Craft.',
    sourceUrl: 'https://www.handicrafts.nic.in/pdf/List_Of_Identified_As_Endangered_Craft.pdf',
    slug: 'uttar-pradesh'
  },
  {
    id: 'mend-ki-chapai',
    tradition: 'Mend Ki Chapai',
    state: 'Rajasthan', district: 'Sanganer', community: 'Traditional block-printing artisans',
    type: 'Traditional Weaving', risk: 'At Risk',
    description: 'A textile block-printing practice documented by the Government of India within Rajasthan’s heritage craft traditions.',
    riskReason: 'The craft is included in the government’s list of identified endangered crafts, signalling the need for continued transmission and artisan support.',
    image: commons('Sanganer block printing.jpg'), fallback: '/images/states/rajasthan.svg',
    source: 'Development Commissioner (Handicrafts) — List of Identified as Endangered Craft.',
    sourceUrl: 'https://www.handicrafts.nic.in/pdf/List_Of_Identified_As_Endangered_Craft.pdf',
    slug: 'rajasthan'
  },
  {
    id: 'suri-bowl',
    tradition: 'Suri Bowl / Sherpai',
    state: 'West Bengal', district: 'Birbhum', community: 'Metal-craft artisans',
    type: 'Traditional Crafts', risk: 'At Risk',
    description: 'A documented metal craft associated with Birbhum, representing the variety of specialised craft knowledge held by local artisan communities.',
    riskReason: 'It appears on the national list of identified endangered crafts, making continued practice and documentation important.',
    image: commons('Dhokra craft West Bengal.jpg'), fallback: '/images/states/west-bengal.svg',
    source: 'Development Commissioner (Handicrafts) — List of Identified as Endangered Craft.',
    sourceUrl: 'https://www.handicrafts.nic.in/pdf/List_Of_Identified_As_Endangered_Craft.pdf',
    slug: 'west-bengal'
  },
  {
    id: 'chamba-rumal',
    tradition: 'Chamba Rumal',
    state: 'Himachal Pradesh', district: 'Chamba', community: 'Embroidery practitioners of the Chamba region',
    type: 'Traditional Crafts', risk: 'At Risk',
    description: 'A distinctive embroidery tradition known for fine imagery worked so it can be viewed on both sides of the cloth.',
    riskReason: 'Chamba Rumal is included in the government’s identified endangered-craft list, highlighting the importance of craft transmission and artisan livelihoods.',
    image: commons('Chamba Rumal.jpg'), fallback: '/images/states/rajasthan.svg',
    source: 'Development Commissioner (Handicrafts) — List of Identified as Endangered Craft.',
    sourceUrl: 'https://www.handicrafts.nic.in/pdf/List_Of_Identified_As_Endangered_Craft.pdf',
    slug: null
  },
  {
    id: 'oral-storytelling',
    tradition: 'Oral Storytelling Traditions',
    state: 'Rajasthan', district: 'Multiple districts', community: 'Folk performers, hereditary storytellers and local knowledge-bearers',
    type: 'Oral Storytelling', risk: 'Declining',
    description: 'Stories, songs, epics and spoken narratives carry memory, values and local knowledge from one generation to another.',
    riskReason: 'Government documentation efforts explicitly identify endangered folk languages and oral traditions; the chain of transmission can weaken when performance contexts and intergenerational practice decline.',
    image: commons('Rajasthan folk musician.jpg'), fallback: '/images/states/rajasthan.svg',
    source: 'Press Information Bureau — Preservation and Documentation of Endangered Folk Languages and Oral Traditions; UNESCO oral traditions domain.',
    sourceUrl: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2159088&lang=2&reg=48',
    slug: 'rajasthan'
  },
  {
    id: 'folk-music',
    tradition: 'Folk Music Traditions',
    state: 'Punjab', district: 'Gurdaspur region', community: 'Folk musicians and community performers',
    type: 'Folk Music', risk: 'Declining',
    description: 'Community music traditions connect celebration, work, memory and social life through locally rooted repertoires and performance practice.',
    riskReason: 'National cultural institutions continue documentation and youth-transmission work for folk and tribal music, reflecting the need to keep living performance traditions connected to communities.',
    image: commons('Punjabi folk music.jpg'), fallback: '/images/states/punjab.svg',
    source: 'Sangeet Natak Akademi — Folk and Tribal; Ministry of Culture safeguarding programmes.',
    sourceUrl: 'https://sangeetnatak.gov.in/sections/folk-and-tribal',
    slug: 'punjab'
  },
  {
    id: 'traditional-instruments',
    tradition: 'Traditional Instrument Knowledge',
    state: 'Rajasthan', district: 'Jaisalmer region', community: 'Folk instrumentalists and hereditary music families',
    type: 'Traditional Instruments', risk: 'Declining',
    description: 'Traditional instruments preserve distinctive timbres, playing techniques and musical repertoires tied to local performance communities.',
    riskReason: 'Instrument knowledge is closely linked to performer lineages; safeguarding depends on documentation, continued performance and opportunities for younger practitioners.',
    image: commons('Rajasthani folk musician.jpg'), fallback: '/images/states/rajasthan.svg',
    source: 'Sangeet Natak Akademi — Folk and Tribal; UNESCO safeguarding framework for living traditions.',
    sourceUrl: 'https://sangeetnatak.gov.in/sections/folk-and-tribal',
    slug: 'rajasthan'
  },
  {
    id: 'ritual-traditions',
    tradition: 'Ritual Theatre & Community Traditions',
    state: 'Kerala', district: 'Central Kerala', community: 'Temple and village performance communities',
    type: 'Rituals & Community Traditions', risk: 'Preservation Priority',
    description: 'Ritual performance traditions combine music, theatre, costume, storytelling and community participation in living cultural contexts.',
    riskReason: 'UNESCO and India’s cultural institutions treat safeguarding as an active process because transmission depends on communities, practitioners and opportunities for performance.',
    image: commons('Mudiyettu Kerala.jpg'), fallback: '/images/states/kerala.svg',
    source: 'UNESCO India ICH list; Sangeet Natak Akademi ICH safeguarding framework.',
    sourceUrl: 'https://ich.unesco.org/en/state/india-IN?cp=IN&topic=en-state',
    slug: 'kerala'
  }
]

export const RISK_LEVELS = ['All', 'Thriving', 'Declining', 'At Risk', 'Critically Fading', 'Preservation Priority']
export const CULTURE_TYPES = ['All', ...Array.from(new Set(HERITAGE_RISK_ITEMS.map((item) => item.type)))]
export const RISK_STATES = ['All', ...Array.from(new Set(HERITAGE_RISK_ITEMS.map((item) => item.state)))].sort()
export const RISK_COMMUNITIES = ['All', ...Array.from(new Set(HERITAGE_RISK_ITEMS.map((item) => item.community)))].sort()
