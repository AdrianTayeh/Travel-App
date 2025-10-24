import { fetchCountries } from "@/lib/api";
import FavoritesClient from "./FavoritesClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const countries = await fetchCountries();

  const userId =
    session.user.email ?? (session.user.id as string | undefined) ?? null;

  return <FavoritesClient countries={countries} userId={userId} />;
}
