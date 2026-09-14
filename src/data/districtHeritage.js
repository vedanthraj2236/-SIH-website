export const DISTRICT_HERITAGE = {
  karnataka: {
    'mysuru': { region: 'Mysuru region', highlights: ['Mysuru Dasara', 'Mysuru painting traditions', 'Mysuru silk'], traditions: ['Mysuru Dasara', 'Mysuru painting', 'Mysuru silk'], sites: ['Mysuru Palace', 'Chamundi Hill'] },
    'udupi': { region: 'Coastal Karnataka', highlights: ['Yakshagana', 'Temple cuisine', 'Coastal foodways'], traditions: ['Yakshagana', 'Udupi cuisine', 'Coastal temple traditions'], sites: ['Sri Krishna Temple, Udupi', 'Malpe coast'] },
    'dakshina-kannada': { region: 'Tulunadu', highlights: ['Yakshagana', 'Bhoota Kola traditions', 'Coastal cuisine'], traditions: ['Yakshagana', 'Bhoota Kola', 'Coastal foodways'], sites: ['Mangaladevi Temple', 'Kadri Manjunath Temple'] },
    'vijayapura': { region: 'North Karnataka', highlights: ['Deccan architecture', 'Sufi heritage', 'Handloom traditions'], traditions: ['Deccan architectural heritage', 'Handloom traditions'], sites: ['Gol Gumbaz', 'Ibrahim Rauza'] }
  },
  kerala: {
    'thrissur': { region: 'Central Kerala', highlights: ['Thrissur Pooram', 'Kathakali', 'Temple arts'], traditions: ['Thrissur Pooram', 'Kathakali', 'Chenda traditions'], sites: ['Vadakkunnathan Temple', 'Shakthan Thampuran Palace'] },
    'kannur': { region: 'North Kerala / Malabar', highlights: ['Theyyam', 'Handloom traditions', 'Malabar foodways'], traditions: ['Theyyam', 'Kannur handloom traditions'], sites: ['St. Angelo Fort', 'Muzhappilangad Beach'] },
    'alappuzha': { region: 'Kuttanad & backwaters', highlights: ['Snake boat traditions', 'Coconut craft', 'Backwater foodways'], traditions: ['Vallam Kali', 'Coir craft'], sites: ['Alappuzha backwaters'] }
  },
  'tamil-nadu': {
    'chennai': { region: 'Coromandel Coast', highlights: ['Carnatic music', 'Bharatanatyam', 'Urban temple heritage'], traditions: ['Carnatic music', 'Bharatanatyam', 'Kanchipuram silk traditions'], sites: ['Kapaleeshwarar Temple', 'Fort St. George'] },
    'madurai': { region: 'Southern Tamil Nadu', highlights: ['Temple festivals', 'Tamil devotional music', 'Traditional foodways'], traditions: ['Temple festival traditions', 'Carnatic and devotional music'], sites: ['Meenakshi Amman Temple', 'Thirumalai Nayakkar Palace'] },
    'thanjavur': { region: 'Kaveri delta', highlights: ['Tanjore painting', 'Bharatanatyam heritage', 'Temple architecture'], traditions: ['Tanjore painting', 'Bharatanatyam', 'Bronze casting traditions'], sites: ['Brihadisvara Temple'] }
  },
  maharashtra: {
    'pune': { region: 'Western Maharashtra', highlights: ['Lavani', 'Powada', 'Traditional theatre'], traditions: ['Lavani', 'Powada', 'Tamasha'], sites: ['Shaniwar Wada', 'Aga Khan Palace'] },
    'kolhapur': { region: 'Southern Maharashtra', highlights: ['Kolhapuri crafts', 'Folk performance', 'Cuisine'], traditions: ['Kolhapuri craft traditions', 'Lavani and folk performance'], sites: ['Mahalakshmi Temple, Kolhapur'] },
    'mumbai': { region: 'Konkan coast', highlights: ['Koli community traditions', 'Marathi theatre', 'Coastal foodways'], traditions: ['Koli song and dance traditions', 'Marathi theatre'], sites: ['Chhatrapati Shivaji Maharaj Terminus', 'Elephanta Caves'] }
  },
  punjab: {
    'amritsar': { region: 'Majha', highlights: ['Gurdwara traditions', 'Phulkari', 'Bhangra and Giddha'], traditions: ['Phulkari', 'Bhangra', 'Giddha'], sites: ['Golden Temple', 'Jallianwala Bagh'] },
    'patiala': { region: 'Malwa', highlights: ['Patiala gharana', 'Phulkari', 'Punjabi folk performance'], traditions: ['Patiala gharana', 'Phulkari', 'Giddha'], sites: ['Qila Mubarak'] }
  },
  rajasthan: {
    'jaipur': { region: 'Dhundi / eastern Rajasthan', highlights: ['Ghoomar', 'Block printing', 'Kathputli traditions'], traditions: ['Ghoomar', 'Bagru and Sanganer printing traditions', 'Kathputli'], sites: ['Amer Fort', 'City Palace'] },
    'jodhpur': { region: 'Marwar', highlights: ['Folk music', 'Blue pottery traditions', 'Desert foodways'], traditions: ['Manganiyar folk music', 'Marwari folk traditions'], sites: ['Mehrangarh Fort'] },
    'udaipur': { region: 'Mewar', highlights: ['Miniature painting', 'Ghoomar', 'Mewar architecture'], traditions: ['Mewar miniature painting', 'Ghoomar'], sites: ['City Palace', 'Jag Mandir'] }
  },
  'west-bengal': {
    'kolkata': { region: 'Bengal delta metropolis', highlights: ['Durga Puja', 'Baul music', 'Bengali literature'], traditions: ['Durga Puja', 'Baul music', 'Kalighat painting'], sites: ['Victoria Memorial', 'Howrah Bridge'] },
    'bankura': { region: 'Rarh Bengal', highlights: ['Terracotta craft', 'Folk performance', 'Dokra traditions'], traditions: ['Bankura terracotta', 'Folk craft traditions'], sites: ['Bishnupur temples'] },
    'birbhum': { region: 'Rarh Bengal', highlights: ['Baul traditions', 'Kantha embroidery', 'Folk festivals'], traditions: ['Baul music', 'Kantha embroidery'], sites: ['Santiniketan cultural landscape'] }
  },
  gujarat: {
    'ahmedabad': { region: 'Central Gujarat', highlights: ['Garba', 'Patola heritage', 'Pol architecture'], traditions: ['Garba', 'Textile traditions of Gujarat'], sites: ['Sabarmati Ashram', 'Historic city of Ahmedabad'] },
    'kachchh': { region: 'Kutch', highlights: ['Embroidery', 'Ajrakh printing', 'Folk music'], traditions: ['Kutch embroidery', 'Ajrakh block printing', 'Kutch folk music'], sites: ['Dholavira', 'Bhuj heritage precincts'] },
    'jamnagar': { region: 'Saurashtra', highlights: ['Bandhani', 'Beadwork', 'Garba'], traditions: ['Bandhani', 'Beadwork traditions'], sites: ['Lakhota Palace'] }
  },
  'uttar-pradesh': {
    'lucknow': { region: 'Awadh', highlights: ['Chikankari', 'Kathak', 'Awadhi cuisine'], traditions: ['Chikankari', 'Kathak', 'Awadhi foodways'], sites: ['Bara Imambara', 'Rumi Darwaza'] },
    'varanasi': { region: 'Kashi / eastern Uttar Pradesh', highlights: ['Banarasi weaving', 'Hindustani music', 'Ganga traditions'], traditions: ['Banarasi silk weaving', 'Hindustani classical music', 'Ganga ritual traditions'], sites: ['Ghats of Varanasi', 'Kashi Vishwanath Temple'] },
    'agra': { region: 'Braj / western Uttar Pradesh', highlights: ['Mughal architecture', 'Petha food tradition', 'Braj cultural heritage'], traditions: ['Braj cultural traditions', 'Traditional confectionery'], sites: ['Taj Mahal', 'Agra Fort'] }
  },
  assam: {
    'sivasagar': { region: 'Upper Assam', highlights: ['Ahom heritage', 'Bihu traditions', 'Muga silk'], traditions: ['Bihu', 'Muga silk traditions'], sites: ['Rang Ghar', 'Talatal Ghar'] },
    'majuli': { region: 'River island in the Brahmaputra', highlights: ['Sattriya culture', 'Mask-making', 'Vaishnavite monastery traditions'], traditions: ['Sattriya', 'Majuli mask-making', 'Neo-Vaishnavite cultural traditions'], sites: ['Satras of Majuli'] },
    'kamrup-metropolitan': { region: 'Lower Assam', highlights: ['Bihu', 'Assamese weaving', 'Kamakhya pilgrimage traditions'], traditions: ['Bihu', 'Assamese weaving traditions'], sites: ['Kamakhya Temple'] }
  }
}

export function getDistrictProfile(stateSlug, districtName) {
  const key = String(districtName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const state = DISTRICT_HERITAGE[stateSlug] || {}
  return state[key] || null
}
