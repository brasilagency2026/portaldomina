/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";

interface MapMarker {
  id: number;
  name: string;
  lat: number;
  lng: number;
  isPremium: boolean;
}

interface GoogleMapProps {
  markers: MapMarker[];
  onMarkerClick?: (id: number) => void;
}

const GoogleMap = ({ markers, onMarkerClick }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if ((window as any).google?.maps) {
        setIsLoaded(true);
      } else {
        setTimeout(checkGoogleMaps, 200);
      }
    };
    checkGoogleMaps();
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: -23.5505, lng: -46.6333 }, // São Paulo
      zoom: 12,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#8a8a9a" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2a3e" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e0e1a" }] },
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
      ],
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    markers.forEach((m) => {
      const marker = new google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map: mapInstanceRef.current!,
        title: m.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: m.isPremium ? 10 : 7,
          fillColor: m.isPremium ? "#D4AF37" : "#a855f7",
          fillOpacity: 0.9,
          strokeColor: m.isPremium ? "#FFD700" : "#7c3aed",
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="color:#1a1a2e;font-weight:600;font-size:14px;">${m.isPremium ? "👑 " : ""}${m.name}</div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current!, marker);
        onMarkerClick?.(m.id);
      });

      bounds.extend({ lat: m.lat, lng: m.lng });
      markersRef.current.push(marker);
    });

    if (markers.length > 0) {
      mapInstanceRef.current.fitBounds(bounds);
      if (markers.length === 1) {
        mapInstanceRef.current.setZoom(14);
      }
    }
  }, [markers, isLoaded, onMarkerClick]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary rounded-2xl">
        <p className="text-muted-foreground">Carregando mapa...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full rounded-2xl" />;
};

export default GoogleMap;
