import Image from "next/image";
import type { Country, UnsplashSearchResult } from "@/types/types";

interface CountryImagesProps {
  country: Country;
  unsplashImages: UnsplashSearchResult | null;
}

export function CountryImages({ country, unsplashImages }: CountryImagesProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4 pt-6">
      {(unsplashImages?.results ?? []).slice(0, 3).map((photo) => (
        <div
          key={photo.id}
          className="aspect-square rounded-lg overflow-hidden bg-gray-100 group relative"
        >
          <Image
            src={photo.urls.regular}
            alt={photo.alt_description || `Photo of ${country.name.common}`}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 z-0"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-end p-4 z-10 pointer-events-none backdrop-blur-sm">
            <div className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium drop-shadow-md">
              <p>Photo by {photo.user.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
