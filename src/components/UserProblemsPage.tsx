// Arquivo: src/components/UserProblemsPage.tsx

import React, { useState } from 'react'; // Adicionar useState
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';
import { useProblems, Problem } from '@/hooks/useProblems'; // Importar Problem
import { useAuth } from '@/hooks/useAuth';
import Header from './Header';
import ProblemDetailModal from './ProblemDetailModal'; // <<< IMPORTAR O MODAL

interface UserProblemsPageProps {
  onNewReport: () => void;
  onBackToDashboard: () => void;
}

const UserProblemsPage = ({ onNewReport, onBackToDashboard }: UserProblemsPageProps) => {
  const { problems, loading, toggleLike } = useProblems(); // <<< Obter toggleLike
  const { user } = useAuth();

  // Estados para o modal
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userProblems = problems.filter(problem => problem.user_id === user?.id);

  // Função para abrir o modal
  const handleProblemCardClick = (problem: Problem) => {
    setSelectedProblem(problem);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProblem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    // ... (sua função getStatusText)
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em andamento';
      case 'resolved': return 'Resolvido';
      default: return 'Desconhecido';
    }
  };

  const getTypeDisplayName = (type: string) => {
    // ... (sua função getTypeDisplayName)
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

  const formatDate = (dateString: string) => {
    // ... (sua função formatDate)
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onNewReport={onNewReport} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Carregando seus relatos...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onNewReport={onNewReport} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Meus Relatos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe o status dos problemas que você relatou
            </p>
          </div>
          <Button
            variant="outline"
            onClick={onBackToDashboard}
            className="h-10"
          >
            Voltar ao Dashboard
          </Button>
        </div>

        {userProblems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">Você ainda não relatou nenhum problema.</p> {/* Usar muted-foreground */}
              <Button onClick={onNewReport} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"> {/* Adicionado dark variants */}
                Criar primeiro relato
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userProblems.map((problem) => (
              <Card 
                key={problem.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer" // Adicionado cursor-pointer
                onClick={() => handleProblemCardClick(problem)} // <<< ADICIONADO ONCLICK
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50">
                      {getTypeDisplayName(problem.type)}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(problem.status)}`}>
                      {getStatusText(problem.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-2 text-card-foreground"> {/* Aplicar text-card-foreground */}
                    {problem.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3"> {/* Aplicar text-muted-foreground */}
                    {problem.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground text-sm"> {/* Aplicar text-muted-foreground */}
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{problem.location_address}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground text-sm"> {/* Aplicar text-muted-foreground */}
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(problem.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between"> {/* Usar border-border */}
                    <div className="flex items-center space-x-1 text-muted-foreground"> {/* Aplicar text-muted-foreground */}
                      <span className="text-sm font-medium">{problem.likes_count}</span>
                      <span className="text-xs">apoios</span>
                    </div>
                    {problem.status === 'resolved' && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300 text-xs"> {/* Adicionado dark variants */}
                        ✓ Resolvido
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Renderizar o Modal */}
      <ProblemDetailModal
        problem={selectedProblem}
        isOpen={isModalOpen}
        onClose={closeModal}
        onLike={toggleLike} // Passar a função toggleLike
      />
    </div>
  );
};

export default UserProblemsPage;