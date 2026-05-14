/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      // Obtenir la clé API depuis les variables d'environnement
      const apiKey = import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
                     import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      console.log('API Key check:', {
        NEXT_PUBLIC: import.meta.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'defined' : 'undefined',
        VITE: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'defined' : 'undefined',
        selected: apiKey ? 'found' : 'not found'
      });

      if (!apiKey) {
        const message = 'Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in Vercel.';
        console.error(message);
        setError(message);
        return;
      }

      try {
        const loader = new Loader({
          apiKey,
          libraries: ["places", "marker"],
        });

        console.log('Loading Google Maps via Loader...');
        await loader.load();
        console.log('Google Maps loaded via Loader, window.google:', (window as any).google);

        if ((window as any).google?.maps) {
          setIsLoaded(true);
        } else {
          const message = 'Google Maps loaded but api object is not available.';
          console.error(message, (window as any).google);
          setError(message);
        }
      } catch (loadError) {
        const message = 'Failed to load Google Maps via Loader.';
        console.error(message, loadError);
        setError(`${message} ${loadError}`);
      }
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    console.log('Map creation effect triggered, isLoaded:', isLoaded, 'mapRef.current:', !!mapRef.current);
    if (!isLoaded || !mapRef.current) return;

    // Vérifier que google.maps est disponible
    if (!(window as any).google?.maps) {
      console.error('Google Maps API not available in map creation effect');
      return;
    }

    console.log('google object', (window as any).google);
    console.log('google.maps', (window as any).google?.maps);
    console.log('google.maps.Map type', typeof (window as any).google?.maps?.Map, (window as any).google?.maps?.Map);

    if (typeof (window as any).google?.maps?.Map !== 'function') {
      const message = 'google.maps.Map is not a constructor - incompatible Google Maps object.';
      console.error(message, (window as any).google?.maps?.Map);
      setError(message);
      return;
    }

    console.log('Creating Google Map...');
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

    // Vérifier que google.maps est disponible
    if (!(window as any).google?.maps) {
      console.error('Google Maps API not available');
      return;
    }

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

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-secondary rounded-2xl p-4 text-center">
        <p className="text-red-400 font-semibold mb-2">Erro ao carregar o mapa</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

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