
import { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada neste navegador');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding para obter endereço
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY&language=pt&pretty=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          const address = data.results[0]?.formatted || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          setLocation({
            latitude,
            longitude,
            address
          });
        } else {
          setLocation({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          });
        }
      } catch (geocodeError) {
        console.error('Erro ao obter endereço:', geocodeError);
        setLocation({
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        });
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setError('Não foi possível obter sua localização');
    } finally {
      setLoading(false);
    }
  };

  const setManualLocation = (latitude: number, longitude: number, address?: string) => {
    setLocation({
      latitude,
      longitude,
      address: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    });
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    setManualLocation,
    clearLocation: () => setLocation(null)
  };
};
