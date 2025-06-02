
import React, { useState } from 'react';
import Header from './Header';
import ProblemCard from './ProblemCard';
import AdvancedFilters from './AdvancedFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useProblems } from '@/hooks/useProblems';

interface DashboardProps {
  onNewReport: () => void;
  onShowUserProblems: () => void;
  onShowAdminPanel: () => void;
  onShowProfile: () => void;
}

interface FilterState {
  type: string;
  status: string;
  location: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

const Dashboard = ({ onNewReport, onShowUserProblems, onShowAdminPanel, onShowProfile }: DashboardProps) => {
  const { problems, loading, toggleLike } = useProblems();
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    type: '',
    status: '',
    location: '',
    dateFrom: undefined,
    dateTo: undefined
  });

  const applyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setActiveFilters({
      type: '',
      status: '',
      location: '',
      dateFrom: undefined,
      dateTo: undefined
    });
  };

  const filteredProblems = problems.filter(problem => {
    // Filtro por tipo
    if (activeFilters.type && problem.type !== activeFilters.type) return false;
    
    // Filtro por status
    if (activeFilters.status && problem.status !== activeFilters.status) return false;
    
    // Filtro por localização
    if (activeFilters.location && !problem.location_address.toLowerCase().includes(activeFilters.location.toLowerCase())) return false;
    
    // Filtro por data inicial
    if (activeFilters.dateFrom) {
      const problemDate = new Date(problem.created_at);
      const filterDate = new Date(activeFilters.dateFrom);
      if (problemDate < filterDate) return false;
    }
    
    // Filtro por data final
    if (activeFilters.dateTo) {
      const problemDate = new Date(problem.created_at);
      const filterDate = new Date(activeFilters.dateTo);
      filterDate.setHours(23, 59, 59, 999); // Final do dia
      if (problemDate > filterDate) return false;
    }
    
    return true;
  });

  const filterByStatus = (status?: string) => {
    if (!status) return filteredProblems;
    return filteredProblems.filter(problem => problem.status === status);
  };

  const getStatusCount = (status: string) => {
    return filteredProblems.filter(problem => problem.status === status).length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTypeDisplayName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'buraco_na_rua': 'Buraco na rua',
      'lixo_acumulado': 'Lixo acumulado',
      'vandalismo': 'Vandalismo',
      'iluminacao_publica': 'Iluminação pública',
      'sinalizacao_danificada': 'Sinalização danificada',
      'calcada_danificada': 'Calçada danificada',
      'outro': 'Outro'
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header 
          onNewReport={onNewReport}
          onShowUserProblems={onShowUserProblems}
          onShowAdminPanel={onShowAdminPanel}
          onShowProfile={onShowProfile}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Carregando problemas...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        onNewReport={onNewReport}
        onShowUserProblems={onShowUserProblems}
        onShowAdminPanel={onShowAdminPanel}
        onShowProfile={onShowProfile}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Relatórios recentes
              </h2>
              <p className="text-gray-600">
                Acompanhe os problemas relatados pela comunidade
              </p>
            </div>
            <AdvancedFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>
          
          {showFilters && (
            <div className="mb-6">
              <AdvancedFilters
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
                isOpen={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
              />
            </div>
          )}
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-96">
            <TabsTrigger value="all" className="text-sm">
              Todos
              <Badge variant="secondary" className="ml-2 text-xs">
                {filteredProblems.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">
              Pendentes
              <Badge variant="secondary" className="ml-2 text-xs">
                {getStatusCount('pending')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="text-sm">
              Em andamento
              <Badge variant="secondary" className="ml-2 text-xs">
                {getStatusCount('in_progress')}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-sm">
              Resolvidos
              <Badge variant="secondary" className="ml-2 text-xs">
                {getStatusCount('resolved')}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={{
                    id: problem.id,
                    type: getTypeDisplayName(problem.type),
                    description: problem.title,
                    location: problem.location_address,
                    date: formatDate(problem.created_at),
                    status: problem.status,
                    likes: problem.likes_count,
                    userHasLiked: problem.user_has_liked
                  }}
                  onLike={toggleLike}
                />
              ))}
            </div>
            {filteredProblems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum problema encontrado com os filtros aplicados.</p>
                <p className="text-gray-400 text-sm mt-1">Tente ajustar os filtros ou limpar todos os filtros.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterByStatus('pending').map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={{
                    id: problem.id,
                    type: getTypeDisplayName(problem.type),
                    description: problem.title,
                    location: problem.location_address,
                    date: formatDate(problem.created_at),
                    status: problem.status,
                    likes: problem.likes_count,
                    userHasLiked: problem.user_has_liked
                  }}
                  onLike={toggleLike}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterByStatus('in_progress').map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={{
                    id: problem.id,
                    type: getTypeDisplayName(problem.type),
                    description: problem.title,
                    location: problem.location_address,
                    date: formatDate(problem.created_at),
                    status: problem.status,
                    likes: problem.likes_count,
                    userHasLiked: problem.user_has_liked
                  }}
                  onLike={toggleLike}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterByStatus('resolved').map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={{
                    id: problem.id,
                    type: getTypeDisplayName(problem.type),
                    description: problem.title,
                    location: problem.location_address,
                    date: formatDate(problem.created_at),
                    status: problem.status,
                    likes: problem.likes_count,
                    userHasLiked: problem.user_has_liked
                  }}
                  onLike={toggleLike}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
