# Travel-App (compact)

Small Next.js demo showing country data, images, and weather. Server-side helpers live in `src/lib/api.ts`.

Quick start

1. Install:

```fish
npm install
```

1. Add `.env.local` (see Environment variables) and run:

```fish
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000)

Environment variables (minimum)

OPENWEATHERMAP_API_KEY, UNSPLASH_ACCESS_KEY, NEXTAUTH_URL, NEXTAUTH_SECRET

Notes

- Keep API keys server-side in `.env.local`.

Deploy

Vercel is recommended — set env vars in the project settings and deploy.

Project layout

- `src/app` — routes & server components
- `src/components` — client UI
- `src/lib` — server helpers & utilities

[Deployed site](https://travel-app-six-tan.vercel.app/)
