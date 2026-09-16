const commons = (filename) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}`

export const stateVisuals = {
  assam: { emoji: '🪕', theme: 'Bihu & Muga silk', image: commons('Bihu of Assam.jpg'), fallback: '/images/states/assam.svg', credit: 'Wikimedia Commons' },
  gujarat: { emoji: '💃', theme: 'Garba & mirror work', image: commons('Gujarati garba.jpg'), fallback: '/images/states/gujarat.svg', credit: 'Wikimedia Commons' },
  karnataka: { emoji: '🎭', theme: 'Yakshagana & Mysuru', image: commons('2016 Yakshagana dance Karnataka, a Hindu classical dance.jpg'), fallback: '/images/states/karnataka.svg', credit: 'Wikimedia Commons' },
  kerala: { emoji: '🎨', theme: 'Kathakali & Onam', image: commons('Kathakali (Kerala).jpg'), fallback: '/images/states/kerala.svg', credit: 'Wikimedia Commons' },
  maharashtra: { emoji: '🥁', theme: 'Lavani & Paithani', image: commons('Lavani Dance Maharashtra.jpg'), fallback: '/images/states/maharashtra.svg', credit: 'Wikimedia Commons' },
  punjab: { emoji: '🥁', theme: 'Bhangra & Phulkari', image: commons('Bhangra Dance punjab.jpg'), fallback: '/images/states/punjab.svg', credit: 'Wikimedia Commons' },
  rajasthan: { emoji: '🪕', theme: 'Ghoomar & textiles', image: commons('GHOOMAR.jpg'), fallback: '/images/states/rajasthan.svg', credit: 'Wikimedia Commons' },
  'tamil-nadu': { emoji: '🪷', theme: 'Bharatanatyam & temples', image: commons('A girl performing a Bharatanatyam dance at a Pongal Festival in Namakkal, Tamil Nadu, India.jpg'), fallback: '/images/states/tamil-nadu.svg', credit: 'Wikimedia Commons' },
  'uttar-pradesh': { emoji: '🪔', theme: 'Kathak & Awadhi craft', image: 'https://livingwithlili.weebly.com/uploads/1/0/9/7/109778451/362769664.jpg', fallback: '/images/states/uttar-pradesh.svg', credit: 'Web image — replace with a licensed asset for production' },
  'west-bengal': { emoji: '🪘', theme: 'Durga Puja & Kantha', image: commons('Durga Puja in West Bengal.jpg'), fallback: '/images/states/west-bengal.svg', credit: 'Wikimedia Commons' },
}
