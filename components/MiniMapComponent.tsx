"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGoogleMaps } from "./map/hooks";
import { MapLoadingState } from "./map";
import { MapPin } from "lucide-react";

interface MiniMapComponentProps {
  className?: string;
}

export default function MiniMapComponent({
  className = "",
}: MiniMapComponentProps) {
  const router = useRouter();

  const onMapReady = useCallback((mapInstance: any) => {
    // Configure mini map specific settings after a short delay to ensure marker is created first
    setTimeout(() => {
      if (mapInstance) {
        mapInstance.setOptions({
          gestureHandling: "none", // Disable all interactions
          disableDefaultUI: true, // Remove all UI controls
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
      }
    }, 100);
  }, []);

  const { mapRef, map, isClient } = useGoogleMaps({
    onMapReady,
  });

  const handleMapClick = () => {
    router.push("/map");
  };

  if (!isClient) {
    return (
      <button
        onClick={handleMapClick}
        className={`relative flex cursor-pointer items-center justify-center bg-gray-100 transition-colors hover:bg-gray-200 ${className}`}
      >
        <MapLoadingState message="Loading mini map..." />
      </button>
    );
  }

  return (
    <button
      onClick={handleMapClick}
      className={`group relative cursor-pointer overflow-hidden bg-gray-100 transition-colors hover:bg-gray-200 ${className}`}
    >
      <div ref={mapRef} className="pointer-events-none h-full w-full" />

      {/* Location indicator overlay */}
      {map && (
        <div className="absolute top-2 left-2 flex items-center space-x-1 rounded-full bg-white/90 px-2 py-1 text-xs text-gray-700 shadow-sm backdrop-blur-sm">
          <MapPin className="h-3 w-3 text-blue-600" />
          <span>Current Location</span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
        <div className="rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-gray-800 opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100">
          Click to open full map
        </div>
      </div>
    </button>
  );
}
