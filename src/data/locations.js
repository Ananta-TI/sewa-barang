export const MAP_BOUNDS = {
  minLat: 0.40,
  maxLat: 0.60,
  minLon: 101.34,
  maxLon: 101.54,
}

export const DEFAULT_LOCATION = {
  address: 'Pekanbaru, Riau',
  latitude: 0.5071,
  longitude: 101.4478,
}

export const LOCATION_PRESETS = [
  { id: 'marpoyan', name: 'Marpoyan Damai', address: 'Marpoyan Damai, Pekanbaru', latitude: 0.4478, longitude: 101.4535 },
  { id: 'bukit-raya', name: 'Bukit Raya', address: 'Bukit Raya, Pekanbaru', latitude: 0.4743, longitude: 101.4721 },
  { id: 'sail', name: 'Sail', address: 'Sail, Pekanbaru', latitude: 0.5211, longitude: 101.4583 },
  { id: 'tampan', name: 'Tampan', address: 'Tampan, Pekanbaru', latitude: 0.4722, longitude: 101.3711 },
  { id: 'rumbai', name: 'Rumbai', address: 'Rumbai, Pekanbaru', latitude: 0.5775, longitude: 101.4312 },
  { id: 'tenayan', name: 'Tenayan Raya', address: 'Tenayan Raya, Pekanbaru', latitude: 0.5334, longitude: 101.5132 },
]

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export const coordsToPercent = (latitude, longitude) => {
  const lat = Number.isFinite(Number(latitude)) ? Number(latitude) : DEFAULT_LOCATION.latitude
  const lon = Number.isFinite(Number(longitude)) ? Number(longitude) : DEFAULT_LOCATION.longitude
  return {
    left: `${clamp(((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * 100, 4, 96)}%`,
    top: `${clamp(100 - ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100, 5, 94)}%`,
  }
}

export const percentToCoords = (leftPercent, topPercent) => {
  const left = clamp(leftPercent, 0, 100) / 100
  const top = clamp(topPercent, 0, 100) / 100
  return {
    longitude: Number((MAP_BOUNDS.minLon + left * (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)).toFixed(7)),
    latitude: Number((MAP_BOUNDS.minLat + (1 - top) * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)).toFixed(7)),
  }
}
