import { ComposableMap, Geography, Marker, Line, ZoomableGroup } from 'react-simple-maps'
import { useMemo, useState } from 'react'

const INDIA_TOPO = 'https://raw.githubusercontent.com/AbhinavSwami28/india-official-geojson/main/india-states.topojson'

export default function TrailRouteMap({ trail, activeStop, onSelectStop }) {
  const [zoom, setZoom] = useState(1)
  const points = useMemo(() => trail.stops.map((stop, index) => ({ ...stop, index })), [trail])
  return <div id="trail-map" className="relative h-[430px] overflow-hidden rounded-[2rem] border border-maroon/10 bg-[#EEF4F3] shadow-card">
    <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_20%_15%,rgba(229,138,36,.20),transparent_30%),radial-gradient(circle_at_80%_75%,rgba(23,107,103,.14),transparent_30%)]"/>
    <div className="absolute left-4 top-4 z-10 rounded-full border border-maroon/10 bg-white/90 px-3 py-2 text-xs font-bold text-maroon shadow-sm backdrop-blur">Route map · {trail.stops.length} stops</div>
    <div className="absolute right-4 top-4 z-10 flex overflow-hidden rounded-2xl border border-maroon/10 bg-white/90 shadow-md backdrop-blur">
      <button onClick={()=>setZoom(z=>Math.min(3,z+.25))} className="grid h-9 w-9 place-items-center text-lg font-bold text-maroon hover:bg-maroon hover:text-white">+</button>
      <button onClick={()=>setZoom(z=>Math.max(1,z-.25))} className="grid h-9 w-9 place-items-center border-l border-maroon/10 text-lg font-bold text-maroon hover:bg-maroon hover:text-white">−</button>
    </div>
    <ComposableMap projection="geoMercator" projectionConfig={{ rotate: [-83,0,0], scale: 1050, center:[78.7,22.6] }} className="h-full w-full">
      <ZoomableGroup center={[78.7,22.6]} zoom={zoom} minZoom={1} maxZoom={3} wheelZoom onMove={({zoom: next})=>setZoom(next)}>
        <Geography geography={INDIA_TOPO} style={{ default:{fill:'#E8EFEF',stroke:'#263A73',strokeWidth:.45,outline:'none'}, hover:{fill:'#DCEAE9',outline:'none'}, pressed:{fill:'#E58A24',outline:'none'} }} />
        {points.slice(0,-1).map((point,index)=><Line key={`line-${point.id}`} from={point.coords} to={points[index+1].coords} stroke="#263A73" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />)}
        {points.map(point=><Marker key={point.id} coordinates={point.coords} onClick={()=>onSelectStop(point.index)}>
          <g className="cursor-pointer">
            <circle r={activeStop===point.index ? 10 : 7} fill={activeStop===point.index ? '#C79A3B' : '#263A73'} stroke="#FFFDF7" strokeWidth="3"/>
            <text x="0" y="-14" textAnchor="middle" className="fill-[#242424] text-[9px] font-semibold">{point.index + 1}</text>
          </g>
        </Marker>)}
      </ZoomableGroup>
    </ComposableMap>
  </div>
}
