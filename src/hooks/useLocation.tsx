import { useState } from 'react';

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
      
      // --- MODIFICAÇÃO AQUI: Geocodificação Reversa ---
      // Substitua 'YOUR_OPENCAGE_API_KEY' pela sua chave da API OpenCage
      const apiKey = '1d5e15795d734c598940b9e7b7468a79'; 
      const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=pt&pretty=1`;
      
      try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        
        // Pega o endereço formatado a partir da resposta da API
        const address = data.results[0]?.formatted || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        
        const newLocation = { latitude, longitude, address };
        setLocation(newLocation);
        console.log('Localização obtida e endereço traduzido:', newLocation);

      } catch (geocodeError) {
        console.error('Erro ao obter endereço:', geocodeError);
        // Se a tradução falhar, usa as coordenadas como fallback
        setLocation({
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        });
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setError('Não foi possível obter sua localização. Verifique as permissões do navegador.');
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
