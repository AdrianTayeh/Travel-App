import { Button } from "./ui/button";
import type { Continent } from "@/types/types";

interface ContinentFiltersProps {
  selected: Continent;
  onSelect: (continent: Continent) => void;
}

const continents: Continent[] = [
  "All",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
];

export function ContinentFilters({
  selected,
  onSelect,
}: ContinentFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {continents.map((continent) => (
        <Button
          key={continent}
          variant={selected === continent ? "default" : "outline"}
          onClick={() => onSelect(continent)}
          className="rounded-full"
        >
          {continent}
        </Button>
      ))}
    </div>
  );
}
