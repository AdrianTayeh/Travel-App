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
  capitalInfo: z.object({
    latlng: z.array(z.number()).optional(),
  }).optional(),
  continents: z.array(z.string()).optional(),
});

export const WeatherSchema = z.object({
  current: z.object({
    temperature_2m: z.number(),
    weathercode: z.number(),
    windspeed_10m: z.number(),
    relative_humidity_2m: z.number(),
  }),
});

export type Country = z.infer<typeof CountrySchema>;
export type Weather = z.infer<typeof WeatherSchema>;
