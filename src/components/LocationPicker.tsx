
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

interface LocationPickerProps {
  onLocationChange: (location: { latitude: number; longitude: number; address: string }) => void;
  initialAddress?: string;
}

const LocationPicker = ({ onLocationChange, initialAddress = '' }: LocationPickerProps) => {
  const [manualAddress, setManualAddress] = useState(initialAddress);
  const { location, loading, error, getCurrentLocation } = useLocation();

  const handleGetCurrentLocation = async () => {
    await getCurrentLocation();
  };

  React.useEffect(() => {
    if (location) {
      setManualAddress(location.address || '');
      onLocationChange({
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || ''
      });
    }
  }, [location, onLocationChange]);

  const handleManualAddressChange = (address: string) => {
    setManualAddress(address);
    // Para endereço manual, não temos coordenadas precisas
    // Em uma implementação real, você usaria um serviço de geocoding
    onLocationChange({
      latitude: 0,
      longitude: 0,
      address
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location">Localização do problema</Label>
        <div className="flex gap-2 mt-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            disabled={loading}
            className="shrink-0"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {loading ? 'Obtendo...' : 'GPS'}
          </Button>
          <Input
            id="location"
            value={manualAddress}
            onChange={(e) => handleManualAddressChange(e.target.value)}
            placeholder="Digite o endereço do problema..."
            className="flex-1"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
        {location && (
          <p className="text-sm text-green-600 mt-1">
            📍 Localização obtida: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
