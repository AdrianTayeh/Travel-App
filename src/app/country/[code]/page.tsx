import {
  fetchCountryByCode,
  fetchWeather,
  fetchWikipediaSummary,
  fetchUnsplashImages,
} from "@/lib/api";
import { Country } from "@/types/types";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteButton } from "../FavoriteButton";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

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
{
  /* Prioritzes capital coords from searchParams, first fallback capitalInfo.latlng from fetch, second fallback country.latlng */
}
function pickCoordsFromParamsOrCountry(
  searchParams: { lat?: string; lon?: string } | undefined,
  country: Country
): [number, number] | null {
  if (searchParams?.lat && searchParams?.lon) {
    const lat = Number.parseFloat(searchParams.lat);
    const lon = Number.parseFloat(searchParams.lon);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return [lat, lon];
    }
  }

  const capInfo = country.capitalInfo?.latlng;
  if (Array.isArray(capInfo) && capInfo.length >= 2) {
    const lat = Number(capInfo[0]);
    const lon = Number(capInfo[1]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return [lat, lon];
    }
  }

  const center = country.latlng;
  if (Array.isArray(center) && center.length >= 2) {
    const lat = Number(center[0]);
    const lon = Number(center[1]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return [lat, lon];
    }
  }

  return null;
}

async function fetchAllCountryData(
  code: string,
  countryName: string,
  searchParams?: { lat?: string; lon?: string }
) {
  const country = await fetchCountryByCode(code);

  const [wikiResult, unsplashResult] = await Promise.allSettled([
    fetchWikipediaSummary(countryName || country.name.common),
    fetchUnsplashImages(countryName || country.name.common),
  ]);

  const coords = pickCoordsFromParamsOrCountry(searchParams, country);

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
    usedCoords: coords,
  };
}

export default async function CountryPage({
  params,
  searchParams,
}: CountryPageProps) {
  const { code } = params;
  const countryName = searchParams.name || "";

  const data = await fetchAllCountryData(code, countryName, {
    lat: searchParams.lat,
    lon: searchParams.lon,
  });

  if (!data?.country) {
    notFound();
  }

  const {
    country,
    countryWeather,
    wikipediaSummary,
    unsplashImages,
    usedCoords,
  } = data;

  const languages = country.languages
    ? Object.values(country.languages).join(",")
    : "N/A";
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map(
          (c: { name: string; symbol?: string }) =>
            `${c.name} (${c.symbol || ""})`
        )
        .join(", ")
    : "N/A";
  const coordsLabel = usedCoords
    ? (() => {
        if (searchParams?.lat && searchParams?.lon)
          return `using coordinates from URL`;
        if (
          country.capitalInfo?.latlng &&
          country.capitalInfo.latlng.length >= 2
        )
          return `using capital coordinates`;
        return `using country center coordinates`;
      })()
    : null;

  const coordsSource: "capital" | "country" | undefined =
    searchParams?.lat && searchParams?.lon
      ? "capital"
      : country.capitalInfo?.latlng && country.capitalInfo.latlng.length >= 2
      ? "capital"
      : usedCoords
      ? "country"
      : undefined;
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to list
          </Button>
        </Link>
        <Suspense fallback={<Skeleton className="h-10 w-32" />}>
          <FavoriteButton countryCode={country.cca3} />
        </Suspense>
      </div>

      {/* Flag and Title */}
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={country.flags.svg}
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{country.name.common}</h1>
              <p className="text-gray-600 text-lg">{country.name.official}</p>
            </div>

            {country.continents && country.continents.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {country.continents.map((continent: string) => (
                  <Badge key={continent} variant="secondary">
                    {continent}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
