import { auth } from "@/auth"; // your Auth.js config
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const session = await auth()

  return (
    <NavbarClient
      user={session?.user ?? null}
    />
  );
}