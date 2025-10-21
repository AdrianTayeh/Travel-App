import type { Country, Weather, WikipediaSummary, UnsplashSearchResult } from "@/types/types";

export async function fetchCountries(): Promise<Country[]> {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=region,capital,population,name,flags,latlng,cca3,capitalInfo",
    {
      next: { revalidate: 60 * 10 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

export async function fetchCountryByCode(code: string): Promise<Country> {
  const res = await fetch(
    `https://restcountries.com/v3.1/alpha/${code}?fields=region,capital,population,name,flags,latlng,cca3,capitalInfo,subregion,languages,currencies,continents`,
    {
      next: { revalidate: 60 * 60 }, // Cache for 1 hour
    }
  );

  if (!res.ok) throw new Error("Failed to fetch country");
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

export async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    throw new Error("OpenWeatherMap API key not found");
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&exclude=minutely,hourly,daily,alerts`,
    {
      next: { revalidate: 60 * 5 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

export function getWeatherDescription(
  weather: Weather["current"]["weather"][0]
): { icon: string; iconUrl: string; description: string } {
  return {
    icon: weather.main,
    iconUrl: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
    description: weather.description,
  };
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function fetchWikipediaSummary(country: string): Promise<WikipediaSummary> {
  const encodedCountry = encodeURIComponent(country);
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedCountry}`,
    {
      next: { revalidate: 60 * 60 * 24 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch Wikipedia summary");
  return res.json();
}

export async function fetchUnsplashImages(country: string): Promise<UnsplashSearchResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("Unsplash access key not found");
  }

  const encodedQuery = encodeURIComponent(country);
  const res = await fetch(
    `https://api.unsplash.com/search/photos/?client_id=${accessKey}&query=${encodedQuery}&per_page=3&orientation=landscape`,
    {
      next: { revalidate: 60 * 60 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch Unsplash images");
  return res.json();
}

