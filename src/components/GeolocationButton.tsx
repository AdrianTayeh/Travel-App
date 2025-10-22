"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface GeolocationButtonProps {
  onLocation: (lat: number, lon: number) => void;
  label?: string;
}

export function GeolocationButton({
  onLocation,
  label = "Use my location",
}: GeolocationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        onLocation(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLoading(false);
        setError(err.message || "Unable to retrieve your location");
      }
    );
  };

  return (
    <div className="space-y-2" role="status">
      <Button
        onClick={handleGetLocation}
        variant="outline"
        disabled={loading}
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MapPin className="w-4 h-4" />
        )}
        {label}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
