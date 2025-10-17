import { fetchCountries } from "@/lib/api";
import { CountriesListClient } from "./countries/CountriesListClient";

export default async function Home() {
  const countries = await fetchCountries();
  return (
    <div className="container mx-auto px-4 py-8">
      <CountriesListClient initialCountries={countries} />
    </div>
  );
}
