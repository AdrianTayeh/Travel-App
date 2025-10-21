import { MapPin, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { Country } from "@/types/types";

interface CountryCardProps {
  country: Country;
}

export function CountryCard({ country }: CountryCardProps) {
  const detailUrl =
    `/country/${country.cca3}?` +
    new URLSearchParams({
      lat: country.latlng?.[0]?.toString() || "",
      lon: country.latlng?.[1]?.toString() || "",
      name: country.name.common,
      capital: country.capital?.[0] || "",
      region: country.region,
    }).toString();

  return (
    <Link href={detailUrl}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
        <div className="aspect-video overflow-hidden bg-gray-100">
          <Image
            src={country.flags.png}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            width={320}
            height={213}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="line-clamp-1">{country.name.common}</h3>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{country.region}</span>
          </div>
          {country.capital && country.capital[0] && (
            <p className="text-sm text-gray-600">
              Capital: {country.capital[0]}
            </p>
          )}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Users className="w-4 h-4" />
            <span>{country.population.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
