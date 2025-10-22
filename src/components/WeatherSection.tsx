"use client";

import { useState } from "react";
import { Cloud, Droplets, Wind, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { GeolocationButton } from "./GeolocationButton";
import { getWeatherDescription } from "../lib/api";
import type { Country, Weather } from "../types/types";
import Image from "next/image";

interface WeatherSectionProps {
  country: Country;
  countryWeather?: Weather;
  coordsSource?: "capital" | "country" | undefined;
  capitalName?: string | undefined;
}

export function WeatherSection({
  country,
  countryWeather,
  coordsSource,
  capitalName,
}: WeatherSectionProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [userWeather, setUserWeather] = useState<Weather | null>(null);
  const [isUserWeatherLoading, setIsUserWeatherLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // prefer capitalInfo.latlng for the capital coordinates when available
  const capitalLat = country.capitalInfo?.latlng?.[0] ?? country.latlng?.[0];
  const capitalLon = country.capitalInfo?.latlng?.[1] ?? country.latlng?.[1];

  const handleUserLocation = async (lat: number, lon: number) => {
    setUserLocation({ lat, lon });
    setIsUserWeatherLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error("Failed to fetch user weather");
      const weather = await res.json();
      setUserWeather(weather);
    } catch (err) {
      setError("Failed to load your weather data");
      console.error("Weather fetch error:", err);
    } finally {
      setIsUserWeatherLoading(false);
    }
  };

  if (!capitalLat || !capitalLon) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Weather data not available for this country.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          <span>Weather Information</span>

          {coordsSource === "capital" && capitalName && (
            <span className="ml-2 inline-flex items-center gap-2 bg-slate-100 text-slate-800 text-sm px-2 py-0.5 rounded-md">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span className="font-medium">{capitalName}</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Country Weather */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {country.capital?.[0] || country.name.common}
            </span>
          </div>

          {!countryWeather ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-6 w-40" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative">
                  <Image
                    src={
                      getWeatherDescription(countryWeather.current.weather[0])
                        .iconUrl
                    }
                    alt={countryWeather.current.weather[0].description}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-4xl">
                    {Math.round(countryWeather.current.temp)}°C
                  </p>
                  <p className="text-gray-600 capitalize">
                    {countryWeather.current.weather[0].description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p>{countryWeather.current.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Wind Speed</p>
                    <p>{Math.round(countryWeather.current.wind_speed)} m/s</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Location Weather Comparison */}
        <div className="pt-4 border-t space-y-3">
          <p className="text-sm">Compare with your location:</p>
          <GeolocationButton
            onLocation={handleUserLocation}
            label="Weather here"
          />

          {isUserWeatherLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm" aria-live="polite">
                Loading your weather...
              </span>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {userWeather && userLocation && countryWeather && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <p className="text-sm">Your Location Weather:</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 relative">
                  <Image
                    src={
                      getWeatherDescription(userWeather.current.weather[0])
                        .iconUrl
                    }
                    alt={userWeather.current.weather[0].description}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-2xl">
                    {Math.round(userWeather.current.temp)}°C
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {userWeather.current.weather[0].description}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-blue-200">
                <p className="text-sm text-gray-600">
                  Temperature difference:{" "}
                  <span className="text-blue-700">
                    {Math.abs(
                      Math.round(
                        userWeather.current.temp - countryWeather.current.temp
                      )
                    )}
                    °C{" "}
                    {userWeather.current.temp > countryWeather.current.temp
                      ? "warmer"
                      : "cooler"}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
