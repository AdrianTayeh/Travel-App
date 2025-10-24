"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  countryCode: string;
  userId?: string | null;
}

export function FavoriteButton({ countryCode, userId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const key = userId ? `favorites:${userId}` : "favorites";
    const favorites = JSON.parse(localStorage.getItem(key) || "[]");
    setIsFavorite(favorites.includes(countryCode));
    setIsLoading(false);
  }, [countryCode, userId]);

  const toggleFavorite = () => {
  const key = userId ? `favorites:${userId}` : "favorites";
  const favorites = JSON.parse(localStorage.getItem(key) || "[]");

    if (isFavorite) {
      const newFavorites = favorites.filter(
        (code: string) => code !== countryCode
      );
      localStorage.setItem(key, JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      const newFavorites = [...favorites, countryCode];
      localStorage.setItem(key, JSON.stringify(newFavorites));
      setIsFavorite(true);
    }
  };

  if (isLoading) {
    return (
      <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>
    );
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
