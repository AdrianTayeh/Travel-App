"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/Searchbar";
import { ContinentFilters } from "@/components/ContintentFilters";
import { CountryCard } from "@/components/CountryCard";
import { GeolocationButton } from "@/components/GeolocationButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateDistance } from "@/lib/api";
import type { Country, Continent } from "@/types/types";

interface CountriesListClientProps {
  initialCountries: Country[];
}

const DEFAULT_PAGE_SIZE = 15;

export function CountriesListClient({
  initialCountries,
}: CountriesListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("query") || "";
  const selectedContinent = (searchParams.get("region") as Continent) || "All";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(
    searchParams.get("pageSize") || DEFAULT_PAGE_SIZE.toString()
  );
  const sortByDistance = searchParams.get("sortByDistance") === "true";

  // Helper function to build URLs while preserving existing parameters
  const buildUrl = (updates: Record<string, string | number | boolean>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === false || value === "All") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value.toString());
      }
    });

    return `?${newSearchParams.toString()}`;
  };

  const buildUrlCb = useCallback(
    (updates: Record<string, string | number | boolean>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === false || value === "All") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value.toString());
        }
      });

      return `?${newSearchParams.toString()}`;
    },
    [searchParams]
  );

  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchQuery !== localQuery) {
        router.replace(buildUrlCb({ query: localQuery, page: 1 }), {
          scroll: false,
        });
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [localQuery, searchQuery, buildUrlCb, router]);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedContinent, currentPage, pageSize, sortByDistance]);

  useEffect(() => {
    const current = searchParams.get("pageSize");
    const desired = pageSize.toString();
    if (current !== desired) {
      router.replace(buildUrlCb({ pageSize }), { scroll: false });
    }
  }, [pageSize, buildUrlCb, router, searchParams]);

  const filteredCountries = useMemo(() => {
    let filtered = [...initialCountries];

    if (searchQuery) {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedContinent !== "All") {
      filtered = filtered.filter(
        (country) => country.region === selectedContinent
      );
    }

    if (sortByDistance && userLocation) {
      filtered = [...filtered].sort((a, b) => {
        // Try to use capital coordinates first, fallback to country center
        const aLat = a.capitalInfo?.latlng?.[0] ?? a.latlng?.[0];
        const aLon = a.capitalInfo?.latlng?.[1] ?? a.latlng?.[1];
        const bLat = b.capitalInfo?.latlng?.[0] ?? b.latlng?.[0];
        const bLon = b.capitalInfo?.latlng?.[1] ?? b.latlng?.[1];

        if (!aLat || !aLon) return 1;
        if (!bLat || !bLon) return -1;

        const distA = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          aLat,
          aLon
        );
        const distB = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          bLat,
          bLon
        );

        return distA - distB;
      });
    }

    return filtered;
  }, [
    initialCountries,
    searchQuery,
    selectedContinent,
    sortByDistance,
    userLocation,
  ]);

  const totalPages = Math.ceil(filteredCountries.length / pageSize);
  const paginatedCountries = filteredCountries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <main className="space-y-8">
      {/* Search and Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row md:flex-row items-start sm:items-center md:items-center gap-4 justify-between">
          <SearchBar
            value={localQuery}
            onChange={(q) => {
              setLocalQuery(q);
            }}
          />
          <div className="flex items-center gap-2">
            <GeolocationButton
              onLocation={(lat, lon) => {
                setUserLocation({ lat, lon });
                router.replace(buildUrl({ sortByDistance: true, page: 1 }), {
                  scroll: false,
                });
              }}
              label="Near me"
            />
            {userLocation && (
              <Button
                variant={sortByDistance ? "default" : "outline"}
                onClick={() =>
                  router.replace(
                    buildUrl({ sortByDistance: !sortByDistance, page: 1 }),
                    {
                      scroll: false,
                    }
                  )
                }
              >
                {sortByDistance
                  ? "Sorted by closest capital"
                  : "Sort by closes capital"}
              </Button>
            )}
          </div>
        </div>

        <ContinentFilters
          selected={selectedContinent}
          onSelect={(continent) =>
            router.replace(buildUrl({ region: continent, page: 1 }), {
              scroll: false,
            })
          }
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedCountries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600" role="status">
            No countries found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {paginatedCountries.map((country, index) => (
            <CountryCard key={`${country.cca3}-${index}`} country={country} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            onClick={() =>
              router.replace(buildUrl({ page: Math.max(1, currentPage - 1) }), {
                scroll: false,
              })
            }
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2)
                pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() =>
                    router.replace(buildUrl({ page: pageNum }), {
                      scroll: false,
                    })
                  }
                  className="w-10"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() =>
              router.replace(
                buildUrl({ page: Math.min(totalPages, currentPage + 1) }),
                {
                  scroll: false,
                }
              )
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
