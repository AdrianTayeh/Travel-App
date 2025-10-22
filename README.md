# Travel-App

A small Next.js (App Router) demo app displaying country data, images, and weather — built with TypeScript, Tailwind CSS, ShadCN, and NextAuth for optional auth.

This README explains how to run the project locally, which external data sources the app integrates with, which environment variables are required, and how to deploy.

## Quick start (local)

1. Install dependencies

```fish
# if you use npm
npm install

# or pnpm
pnpm install

# or yarn
yarn install
```

2. Create a `.env.local` in the repository root and add the required secrets (see the Environment variables section below).

3. Run the dev server

```fish
pnpm dev
# or npm run dev
# or yarn dev
```

4. Open http://localhost:3000 in your browser.

Notes:

- The app uses the Next.js App Router; pages under `src/app` are mostly Server Components. Keep API keys and secrets in `.env.local` — they are accessed server-side only.
- If you change middleware or auth config, restart the dev server to apply middleware matcher changes.

## Data sources & third-party integrations

The project consumes the following external APIs (server-side fetch helpers are in `src/lib/api.ts`):

- REST Countries API — country metadata, flags, capitals, regions, etc.
- Unsplash Search API — images for country galleries. The app hotlinks images using the URLs returned by Unsplash.
- OpenWeatherMap Current Weather Data API — current weather for a set of coordinates. The server fetcher maps the OpenWeather response into the app's `Weather` shape and the client calls a server proxy (`/api/weather`) to avoid exposing the API key.
- Wikipedia REST summary endpoint — a short extract for country pages.

The code that calls these services lives in `src/lib/api.ts` and is executed server-side (or via server routes) so API keys remain secret.

## Environment variables

Create a `.env.local` with at least the following values (example names used in the codebase):

```
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=some_long_random_value
# If you use Google OAuth for NextAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Notes:

- Keep these secrets out of version control. The app expects the weather and Unsplash keys to live server-side.
- If you deploy to Vercel, set the same environment variables in the Vercel project settings.

## Running tests / typechecks

This project uses TypeScript. Run a typecheck with:

```fish
npm tsc --noEmit
```

If you have ESLint configured, run:

```fish
npm lint
```

## Accessibility & best practices

The UI has basic accessibility considerations (semantic headings, alt text fallback for flags and images). Recommended next steps:

- Add a skip-to-content link in `src/app/layout.tsx` for keyboard users.
- Add `aria-pressed` on toggle controls (favorite button) and `aria-live`/`role="alert"` on error messages.
- Run Lighthouse / axe to catch additional issues.

## Deploying

Recommended: Vercel — first-class support for Next.js.

1. Push your branch to GitHub.
2. Import the repository on Vercel and configure the environment variables from the Environment variables section.
3. Vercel will build and deploy the app automatically. For custom domains, configure them via the Vercel dashboard.

## Troubleshooting

- If weather calls return 401, ensure `OPENWEATHERMAP_API_KEY` is set and the server proxy (`/api/weather`) is used for client-side requests.

## Project structure (high level)

- `src/app` — Next.js App Router pages and layout
- `src/components` — UI and client components (Navbar, SearchBar, CountryCard, WeatherSection, etc.)
- `src/lib` — server-side fetch helpers and utilities
- `src/app/api` — server routes (for example `/api/weather`)

## Contact / Links

- Repository: [Github Repo](https://github.com/AdrianTayeh/Travel-App)
- Deployed app: [Vercel Deployment](https://travel-app-six-tan.vercel.app/)
