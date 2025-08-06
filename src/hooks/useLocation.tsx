import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// 1. Acessa a chave de API a partir das variáveis de ambiente
const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      const msg = "Geolocalização não é suportada pelo seu navegador.";
      toast.error(msg);
      setError(msg);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        
        // Verifica se a chave de API foi configurada no .env
        if (!OPENCAGE_API_KEY) {
          const msg = "A chave da API de geolocalização não foi configurada.";
          console.error(msg);
          toast.error("Erro de configuração do servidor.");
          setError(msg);
          setLocation({ address: 'Endereço não disponível', latitude, longitude });
          setLoading(false);
          return;
        }

        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}&language=pt&pretty=1`;
        
        try {
          const response = await fetch(geocodeUrl);
          const data = await response.json();

          if (response.ok && data.results && data.results.length > 0) {
            const formattedAddress = data.results[0].formatted;
            setLocation({ address: formattedAddress, latitude, longitude });
          } else {
            throw new Error(data.status.message || 'Não foi possível obter o endereço.');
          }
        } catch (err: any) {
          const msg = `Erro ao converter coordenadas em endereço: ${err.message}`;
          toast.error(msg);
          setError(msg);
          setLocation({ address: 'Erro ao obter endereço', latitude, longitude });
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        const msg = `Erro ao obter localização: ${err.message}`;
        toast.error(msg);
        setError(msg);
        setLoading(false);
      }
    );
  }, []);

  return { location, loading, error, getCurrentLocation };
};
