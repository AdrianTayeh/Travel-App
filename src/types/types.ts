import { z } from "zod";

export type Continent =
  | "Africa"
  | "Americas"
  | "Asia"
  | "Europe"
  | "Antarctic"
  | "Oceania"
  | "All";

export const CountrySchema = z.object({
  name: z.object({
    common: z.string(),
    official: z.string(),
  }),
  cca2: z.string(),
  cca3: z.string(),
  capital: z.array(z.string()).optional(),
  region: z.string(),
  subregion: z.string().optional(),
  population: z.number(),
  flags: z.object({
    png: z.string(),
    svg: z.string(),
    alt: z.string().optional(),
  }),
  languages: z.record(z.string(), z.string()).optional(),
  currencies: z
    .record(
      z.string(),
      z.object({
        name: z.string(),
        symbol: z.string().optional(),
      })
    )
    .optional(),
  latlng: z.array(z.number()).optional(),
  capitalInfo: z
    .object({
      latlng: z.array(z.number()).optional(),
    })
    .optional(),
  continents: z.array(z.string()).optional(),
});

export const WeatherSchema = z.object({
  current: z.object({
    temp: z.number(),
    humidity: z.number(),
    wind_speed: z.number(),
    weather: z.array(
      z.object({
        main: z.string(),
        description: z.string(),
        icon: z.string(),
      })
    ),
  }),
});

export const WikipediaSchema = z.object({
  title: z.string(),
  extract: z.string(),
  thumbnail: z
    .object({
      source: z.string(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
});

export const UnsplashPhotoSchema = z.object({
  id: z.string(),
  urls: z.object({
    regular: z.string(),
    small: z.string(),
    thumb: z.string(),
    raw: z.string(),
  }),
  alt_description: z.string().nullable(),
  user: z.object({
    name: z.string(),
    username: z.string(),
  }),
});

export const UnsplashSearchSchema = z.object({
  results: z.array(UnsplashPhotoSchema),
  total: z.number(),
  meta: z
    .object({
      link: z.string().optional(),
      xRatelimitLimit: z.string().optional(),
      xRatelimitRemaining: z.string().optional(),
    })
    .optional(),
});

export type Country = z.infer<typeof CountrySchema>;
export type Weather = z.infer<typeof WeatherSchema>;
export type WikipediaSummary = z.infer<typeof WikipediaSchema>;
export type UnsplashPhoto = z.infer<typeof UnsplashPhotoSchema>;
export type UnsplashSearchResult = z.infer<typeof UnsplashSearchSchema>;
