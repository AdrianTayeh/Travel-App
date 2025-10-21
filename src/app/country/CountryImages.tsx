import Image from "next/image";
import type { Country, UnsplashSearchResult } from "@/types/types";

interface CountryImagesProps {
  country: Country;
  unsplashImages: UnsplashSearchResult | null;
}

export function CountryImages({ country, unsplashImages }: CountryImagesProps) {
  const fallbackQueries = [
    `${country.name.common} landmarks`,
    `${country.name.common} culture`,
    `${country.name.common} nature`,
  ];

  if (unsplashImages?.results && unsplashImages.results.length > 0) {
    return (
      <div className="grid md:grid-cols-3 gap-4 pt-6">
        {unsplashImages.results.slice(0, 3).map((photo) => (
          <div
            key={photo.id}
            className="aspect-square rounded-lg overflow-hidden bg-gray-100 group relative"
          >
            <Image
              src={photo.urls.regular}
              alt={photo.alt_description || `Photo of ${country.name.common}`}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end p-4">
              <div className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p>Photo by {photo.user.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 pt-6">
      {fallbackQueries.map((query, index) => (
        <div
          key={index}
          className="aspect-square rounded-lg overflow-hidden bg-gray-100 group relative"
        >
          <Image
            src={`https://source.unsplash.com/800x800/?${encodeURIComponent(query)}`}
            alt={`${query} in ${country.name.common}`}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end p-4">
            <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {query}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}