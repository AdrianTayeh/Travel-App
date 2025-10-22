"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { CountryCard } from "@/components/CountryCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Country } from "@/types/types";

interface FavoritesClientProps {
  countries: Country[];
}

export default function FavoritesClient({ countries }: FavoritesClientProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favorites");
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      setFavoriteIds(ids);
    } catch (e) {
      console.error("Failed reading favorites from localStorage:", e);
      setFavoriteIds([]);
    }
  }, []);

  const favoriteCountries = useMemo(() => {
    if (!favoriteIds) return [];
    return countries.filter((c) => favoriteIds.includes(c.cca3));
  }, [countries, favoriteIds]);

  if (favoriteIds === null) {
    return (
      <main className="container mx-auto px-4 py-8 space-y-8" aria-busy>
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" aria-hidden="true" />
          <h1>My Favorite Countries</h1>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-8" id="main-content">
      <div className="flex items-center gap-3">
        <Heart className="w-8 h-8 text-red-600 fill-current" aria-hidden="true" />
        <h1>My Favorite Countries</h1>
      </div>

      {favoriteCountries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-600 mb-2">You haven&apos;t added any favorites yet.</p>
          <p className="text-sm text-gray-500">
            Browse countries and click the heart icon to add them to your favorites!
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCountries.map((country) => (
            <div key={country.cca3}>
              <CountryCard country={country} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
