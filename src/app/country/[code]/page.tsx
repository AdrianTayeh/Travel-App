import {
  fetchCountryByCode,
  fetchWeather,
  fetchWikipediaSummary,
  fetchUnsplashImages,
} from "@/lib/api";

interface CountryPageProps {
  params: {
    code: string;
  };
  searchParams: {
    lat?: string;
    lon?: string;
    name?: string;
    capital?: string;
    region?: string;
  };
}

async function fetchAllCountryData(code: string, countryName: string) {
  const country = await fetchCountryByCode(code);

  const [wikiResult, unsplashResult] = await Promise.allSettled([
    fetchWikipediaSummary(countryName || country.name.common),
    fetchUnsplashImages(countryName || country.name.common),
  ]);

  const coords =
    country.capitalInfo?.latlng && country.capitalInfo.latlng.length >= 2
      ? country.capitalInfo.latlng
      : country.latlng && country.latlng.length >= 2
      ? country.latlng
      : null;

  let countryWeather = null;
  if (coords) {
    const [lat, lon] = coords;
    try {
      countryWeather = await fetchWeather(lat, lon);
    } catch (e) {
      console.error("fetchWeather error:", e);
      countryWeather = null;
    }
  }

  return {
    country,
    countryWeather,
    wikipediaSummary:
      wikiResult.status === "fulfilled" ? wikiResult.value : null,
    unsplashImages:
      unsplashResult.status === "fulfilled" ? unsplashResult.value : null,
  };
}
