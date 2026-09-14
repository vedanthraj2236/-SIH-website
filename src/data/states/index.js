export const INDIA_REGIONS = [
  'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'
]
export const DATA_REGIONS = ['Assam','Gujarat','Karnataka','Kerala','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Uttar Pradesh','West Bengal']

export const slugify = (name) => name.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
export const regionBySlug = Object.fromEntries(INDIA_REGIONS.map(name => [slugify(name), name]))

const dataFiles = import.meta.glob('./*.json', { eager: true, import: 'default' })
export const stateData = Object.fromEntries(Object.entries(dataFiles).map(([path, value]) => [slugify(value.state), value]))
