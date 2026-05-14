/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";

interface MapMarker {
  id: number | string;
  name: string;
  lat: number;
  lng: number;
  isPremium: boolean;
  slug?: string;
}

interface GoogleMapProps {
  markers: MapMarker[];
  onMarkerClick?: (id: number | string) => void;
}

const GoogleMap = ({ markers, onMarkerClick }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Vérifier si Google Maps est déjà chargé
      if ((window as any).google?.maps) {
        setIsLoaded(true);
        return;
      }

      // Vérifier si le script est déjà en cours de chargement
      const existingScript = document.querySelector('script[data-google-maps]');
      if (existingScript) {
        existingScript.addEventListener('load', () => setIsLoaded(true));
        return;
      }

      // Obtenir la clé API depuis les variables d'environnement
      const apiKey = import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
                     import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error('Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY or VITE_GOOGLE_MAPS_API_KEY');
        return;
      }

      // Créer et charger le script Google Maps
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-google-maps', 'true');
      script.onload = () => setIsLoaded(true);
      script.onerror = () => console.error('Failed to load Google Maps script');

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: -23.5505, lng: -46.6333 },
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
      markersRef.current.forEach((m) => m.map = null);
      markersRef.current = [];
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    markersRef.current.forEach((m) => m.map = null);
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    markers.forEach((m) => {
      const profileUrl = `/profile/${m.slug || m.id}`;

      // Créer un élément DOM pour le marker personnalisé
      const markerElement = document.createElement('div');
      markerElement.style.width = m.isPremium ? '20px' : '14px';
      markerElement.style.height = m.isPremium ? '20px' : '14px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = m.isPremium ? '#D4AF37' : '#a855f7';
      markerElement.style.border = `2px solid ${m.isPremium ? '#FFD700' : '#7c3aed'}`;
      markerElement.style.cursor = 'pointer';
      markerElement.style.opacity = '0.9';

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: m.lat, lng: m.lng },
        map: mapInstanceRef.current!,
        title: m.name,
        content: markerElement,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color:#1a1a2e;padding:8px;min-width:150px;font-family:sans-serif;">
            <a href="${profileUrl}" style="text-decoration:none; color:inherit;">
              <div style="font-weight:700;font-size:16px;margin-bottom:10px;color:#000; cursor:pointer;">
                ${m.isPremium ? "👑 " : ""}${m.name}
              </div>
            </a>
            <a href="${profileUrl}" style="display:block;background:#E11D48;color:white;text-align:center;padding:8px 12px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">
              Ver Perfil Completo
            </a>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current!, marker);
        if (onMarkerClick) {
          onMarkerClick(m.id);
        }
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