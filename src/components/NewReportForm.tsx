
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useProblems } from '@/hooks/useProblems';
import { Database } from '@/integrations/supabase/types';
import ImageUpload from './ImageUpload';
import LocationPicker from './LocationPicker';

type ProblemType = Database['public']['Enums']['problem_type'];

interface NewReportFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const NewReportForm = ({ onSubmit, onCancel }: NewReportFormProps) => {
  const [formData, setFormData] = useState({
    type: '' as ProblemType,
    title: '',
    description: '',
    location_address: '',
    latitude: 0,
    longitude: 0
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { createProblem } = useProblems();

  const problemTypes = [
    { value: 'buraco_na_rua', label: 'Buraco na rua' },
    { value: 'lixo_acumulado', label: 'Lixo acumulado' },
    { value: 'vandalismo', label: 'Vandalismo' },
    { value: 'iluminacao_publica', label: 'Iluminação pública' },
    { value: 'sinalizacao_danificada', label: 'Sinalização danificada' },
    { value: 'calcada_danificada', label: 'Calçada danificada' },
    { value: 'outro', label: 'Outro' }
  ];

  const handleLocationChange = (location: { latitude: number; longitude: number; address: string }) => {
    setFormData(prev => ({
      ...prev,
      location_address: location.address,
      latitude: location.latitude,
      longitude: location.longitude
    }));
  };

  const handleImageUploaded = (url: string) => {
    setImages(prev => [...prev, url]);
  };

  const handleRemoveImage = (url: string) => {
    setImages(prev => prev.filter(img => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.title || !formData.description || !formData.location_address) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const { error } = await createProblem({
        type: formData.type,
        title: formData.title,
        description: formData.description,
        location_address: formData.location_address,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined
      });

      if (error) {
        console.error('Erro ao criar problema:', error);
        alert('Erro ao enviar o relato. Tente novamente.');
        return;
      }

      alert('Relato enviado com sucesso!');
      onSubmit();
    } catch (error) {
      console.error('Erro ao enviar relato:', error);
      alert('Erro ao enviar o relato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Novo relato</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Relate um problema em sua cidade</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="type">Tipo de problema *</Label>
                <Select value={formData.type} onValueChange={(value: ProblemType) => 
                  setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
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

              <div>
                <Label htmlFor="title">Título do problema *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Buraco grande na Rua das Flores"
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição detalhada *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o problema em detalhes..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 caracteres
                </p>
              </div>

              <LocationPicker
                onLocationChange={handleLocationChange}
                initialAddress={formData.location_address}
              />

              <div>
                <Label>Fotos do problema (opcional)</Label>
                <div className="mt-2">
                  <ImageUpload
                    onImageUploaded={handleImageUploaded}
                    onRemoveImage={handleRemoveImage}
                    images={images}
                    maxImages={3}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Enviando...' : 'Enviar relato'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewReportForm;
