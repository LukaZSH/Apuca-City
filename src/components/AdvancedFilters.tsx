
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FilterState {
  type: string;
  status: string;
  location: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

interface AdvancedFiltersProps {
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const AdvancedFilters = ({ onApplyFilters, onClearFilters, isOpen, onToggle }: AdvancedFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    status: '',
    location: '',
    dateFrom: undefined,
    dateTo: undefined
  });

  const problemTypes = [
    { value: 'buraco_na_rua', label: 'Buraco na rua' },
    { value: 'lixo_acumulado', label: 'Lixo acumulado' },
    { value: 'vandalismo', label: 'Vandalismo' },
    { value: 'iluminacao_publica', label: 'Iluminação pública' },
    { value: 'sinalizacao_danificada', label: 'Sinalização danificada' },
    { value: 'calcada_danificada', label: 'Calçada danificada' },
    { value: 'outro', label: 'Outro' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em andamento' },
    { value: 'resolved', label: 'Resolvido' }
  ];

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onToggle();
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      type: '',
      status: '',
      location: '',
      dateFrom: undefined,
      dateTo: undefined
    };
    setFilters(clearedFilters);
    onClearFilters();
    onToggle();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type) count++;
    if (filters.status) count++;
    if (filters.location) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={onToggle}
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtros
        {getActiveFiltersCount() > 0 && (
          <Badge className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5">
            {getActiveFiltersCount()}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros Avançados</CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tipo de problema</Label>
            <Select 
              value={filters.type} 
              onValueChange={(value) => setFilters({...filters, type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                {problemTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters({...filters, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Localização</Label>
            <Input
              placeholder="Digite uma localização..."
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Data inicial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, "PPP", { locale: ptBR }) : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => setFilters({...filters, dateFrom: date})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Data final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, "PPP", { locale: ptBR }) : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => setFilters({...filters, dateTo: date})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button onClick={handleClearFilters} variant="outline" className="flex-1">
            Limpar filtros
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Aplicar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
