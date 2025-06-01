
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus } from 'lucide-react';

interface NewReportFormProps {
  onSubmit: (report: any) => void;
  onCancel: () => void;
}

const NewReportForm = ({ onSubmit, onCancel }: NewReportFormProps) => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
  });

  const problemTypes = [
    'Buraco na rua',
    'Lixo acumulado',
    'Vandalismo',
    'Iluminação pública',
    'Sinalização danificada',
    'Calçada danificada',
    'Outro'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      status: 'pending',
      likes: 0
    });
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
                <Label htmlFor="type">Tipo de problema</Label>
                <Select onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o tipo de problema" />
                  </SelectTrigger>
                  <SelectContent>
                    {problemTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
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
                <Label htmlFor="location">Localização</Label>
                <div className="relative">
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Digite o endereço ou use o GPS"
                    className="h-12 pr-12"
                    required
                  />
                  <button
                    type="button"
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
                  <p className="text-xs text-gray-400 mt-1">Até 5 fotos (JPG, PNG)</p>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 h-12"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                >
                  Enviar relato
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
