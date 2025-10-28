import {
  fetchCountryByCode,
  fetchWeather,
  fetchWikipediaSummary,
  fetchUnsplashImages,
} from "@/lib/api";
import { Country } from "@/types/types";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Coins,
  Globe,
  Languages,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteButton } from "../FavoriteButton";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { WeatherSection } from "@/components/WeatherSection";
import { CountryImages } from "../CountryImages";
import { auth } from "@/auth";

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
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const { code } = awaitedParams;
  const countryName = awaitedSearchParams?.name || "";

  const data = await fetchAllCountryData(code, countryName, {
    lat: awaitedSearchParams?.lat,
    lon: awaitedSearchParams?.lon,
  });

  const session = await auth();
  const userId =
    session?.user?.email ?? (session?.user?.id as string | undefined) ?? null;

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

  const coordsSource: "capital" | "country" | undefined =
    awaitedSearchParams?.lat && awaitedSearchParams?.lon
      ? "capital"
      : country.capitalInfo?.latlng && country.capitalInfo.latlng.length >= 2
      ? "capital"
      : usedCoords
      ? "country"
      : undefined;
  return (
    <main id="main-content" className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to list
          </Button>
        </Link>
        <Suspense fallback={<Skeleton className="h-10 w-32" />}>
          <FavoriteButton countryCode={country.cca3} userId={userId} />
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

      {/* Basic Facts */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2x font-semibold mb-6">Basic Information</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Region</p>
                <p className="font-medium">{country.region}</p>
                {country.subregion && (
                  <p className="text-sm text-gray-500">{country.subregion}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Capital</p>
                <p className="font-medium">{country.capital?.[0] || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Population</p>
                <p className="font-medium">
                  {country.population.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Languages className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Languages</p>
                <p className="text-sm font-medium">{languages}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2 md:col-span-2">
              <Coins className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Currencies</p>
                <p className="text-sm font-medium">{currencies}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Section */}
      <WeatherSection
        country={country}
        countryWeather={countryWeather || undefined}
        coordsSource={coordsSource}
        capitalName={awaitedSearchParams?.capital || country.capital?.[0]}
      />

      {/* Wikipedia Summary & Images */}
      <Card>
        <CardContent className="p-6 text-gray-500">
          <h2 className="tetx-2xl font-semibold">
            Discover {country.name.common}
          </h2>
          <div className="prose max-w-none">
            {wikipediaSummary ? (
              <>
                <p className="text-gray-700 leading-relaxed">
                  {wikipediaSummary.extract}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  <a
                    href={`https://en.wikipedia.org/wiki/${country.name.common.replace(
                      / /g,
                      "_"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Read more on Wikipedia →
                  </a>
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-700 leading-relaxed">
                  {country.name.common} is a country located in {country.region}
                  {country.subregion &&
                    `, specifically in ${country.subregion}`}
                  . With a population of {country.population.toLocaleString()},
                  it is known for its rich cultural heritage and diverse
                  landscapes.{" "}
                  {country.capital?.[0] && (
                    <>
                      The capital city is {country.capital[0]}, which serves as
                      the political and economic center of the nation.
                    </>
                  )}{" "}
                  {country.name.common} offers travelers a unique blend of
                  history, culture, and natural beauty, making it a fascinating
                  destination to explore.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  <a
                    href={`https://en.wikipedia.org/wiki/${country.name.common.replace(
                      / /g,
                      "_"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Learn more on Wikipedia →
                  </a>
                </p>
              </>
            )}
          </div>

          <Suspense
            fallback={
              <div className="grid md:grid-cols-3 gap-4 pt-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            }
          >
            <CountryImages country={country} unsplashImages={unsplashImages} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
