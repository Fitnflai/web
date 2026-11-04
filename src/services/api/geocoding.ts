export interface GeocodingResult {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  elevation?: number;
  timezone?: string;
  latitude?: number;
  longitude?: number;
}

interface OpenMeteoResponse {
  results?: GeocodingResult[];
}

/**
 * Searches cities worldwide using Open-Meteo Geocoding API.
 * Free, public, no API key required. Returns city name, country, elevation (altitude in meters) and timezone.
 */
export async function searchCitiesGeocoding(query: string, signal?: AbortSignal): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=6&language=es&format=json`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data: OpenMeteoResponse = await res.json();
    return data.results || [];
  } catch (err: any) {
    if (err.name === 'AbortError') return [];
    console.error('Error fetching geocoding data:', err);
    return [];
  }
}
