
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus } from 'lucide-react';
import { useProblems } from '@/hooks/useProblems';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type ProblemType = Database['public']['Enums']['problem_type'];

interface NewReportFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const NewReportForm = ({ onSubmit, onCancel }: NewReportFormProps) => {
  const [formData, setFormData] = useState({
    type: '' as ProblemType | '',
    title: '',
    description: '',
    location_address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createProblem } = useProblems();

  const problemTypes = [
    { value: 'buraco_na_rua' as ProblemType, label: 'Buraco na rua' },
    { value: 'lixo_acumulado' as ProblemType, label: 'Lixo acumulado' },
    { value: 'vandalismo' as ProblemType, label: 'Vandalismo' },
    { value: 'iluminacao_publica' as ProblemType, label: 'Iluminação pública' },
    { value: 'sinalizacao_danificada' as ProblemType, label: 'Sinalização danificada' },
    { value: 'calcada_danificada' as ProblemType, label: 'Calçada danificada' },
    { value: 'outro' as ProblemType, label: 'Outro' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.description || !formData.location_address) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await createProblem({
        type: formData.type,
        title: formData.title,
        description: formData.description,
        location_address: formData.location_address
      });
      
      if (error) {
        console.error('Error creating problem:', error);
        toast.error('Erro ao criar relato. Tente novamente.');
      } else {
        toast.success('Relato criado com sucesso!');
        onSubmit();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.info('Obtendo localização...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Em uma implementação real, você usaria reverse geocoding para converter coordenadas em endereço
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFormData(prev => ({
            ...prev,
            location_address: `Localização atual (${lat.toFixed(6)}, ${lng.toFixed(6)})`
          }));
          toast.success('Localização obtida com sucesso!');
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Não foi possível obter a localização. Digite o endereço manualmente.');
        }
      );
    } else {
      toast.error('Geolocalização não é suportada neste navegador');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Novo relato
            </CardTitle>
            <p className="text-gray-600">
              Descreva o problema urbano que você identificou
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de problema *</Label>
                <Select onValueChange={(value: ProblemType) => setFormData({...formData, type: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o tipo de problema" />
                  </SelectTrigger>
                  <SelectContent>
                    {problemTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Título do problema *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Buraco grande na rua causando transtornos"
                  className="h-12"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva detalhadamente o problema encontrado..."
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <div className="relative">
                  <Input
                    id="location"
                    value={formData.location_address}
                    onChange={(e) => setFormData({...formData, location_address: e.target.value})}
                    placeholder="Digite o endereço ou use o GPS"
                    className="h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Fotos do problema</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Clique para adicionar fotos</p>
                  <p className="text-xs text-gray-400 mt-1">Até 5 fotos (JPG, PNG) - Em breve!</p>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 h-12"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar relato'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewReportForm;
