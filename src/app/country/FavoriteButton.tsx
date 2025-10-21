"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  countryCode: string;
}

export function FavoriteButton({ countryCode }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(countryCode));
    setIsLoading(false);
  }, [countryCode]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (isFavorite) {
      const newFavorites = favorites.filter((code: string) => code !== countryCode);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      const newFavorites = [...favorites, countryCode];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(true);
    }
  };

  if (isLoading) {
    return <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>;
  }

  return (
    <Button
      onClick={toggleFavorite}
      variant={isFavorite ? "default" : "outline"}
      className="gap-2"
    >
      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
      {isFavorite ? "Remove from favorites" : "Add to favorites"}
    </Button>
  );
}