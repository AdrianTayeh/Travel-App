import { fetchCountries } from "@/lib/api";
import FavoritesClient from "./FavoritesClient";

export default async function FavoritesPage() {
  const countries = await fetchCountries();

  return <FavoritesClient countries={countries} />;
}
