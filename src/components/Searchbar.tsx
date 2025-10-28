import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        aria-hidden="true"
        focusable="false"
      />
      <Input
        type="text"
        placeholder="Search countries by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 py-6"
        aria-label="Search countries"
      />
    </div>
  );
}
