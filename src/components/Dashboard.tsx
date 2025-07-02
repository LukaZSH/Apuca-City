import React, { useState } from 'react';
import { useProblems, Problem } from '@/hooks/useProblems';
import { useAuth } from '@/hooks/useAuth';
import ProblemCard from './ProblemCard';
import ProblemDetailModal from './ProblemDetailModal';
import Header from './Header';
import { Input } from '@/components/ui/input';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';

interface DashboardProps {
  onNewReport: () => void;
  onShowUserProblems: () => void;
  onShowAdminPanel: () => void;
  onShowProfile: () => void;
}

const Dashboard = ({ onNewReport, onShowUserProblems, onShowAdminPanel, onShowProfile }: DashboardProps) => {
  const { problems, loading, toggleLike } = useProblems();
  const { isVisitor } = useAuth();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleProblemClick = (problem: Problem) => {
    setSelectedProblem(problem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProblem(null);
  };

  // Função "wrapper" que verifica se é visitante antes de dar o like
  const handleLikeWrapper = (problemId: string) => {
    if (isVisitor) {
      toast.info("Você precisa criar uma conta para apoiar um relato.");
      return;
    }
    toggleLike(problemId);
  };
  
  const filteredProblems = problems.filter(problem => 
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.location_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          onNewReport={onNewReport}
          onShowUserProblems={onShowUserProblems}
          onShowAdminPanel={onShowAdminPanel}
          onShowProfile={onShowProfile}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Carregando problemas...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onNewReport={onNewReport}
        onShowUserProblems={onShowUserProblems}
        onShowAdminPanel={onShowAdminPanel}
        onShowProfile={onShowProfile}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Problemas da Cidade
          </h2>
          <p className="text-muted-foreground">
            Veja os problemas relatados pela comunidade e ajude a melhorar nossa cidade
          </p>
        </div>

        <div className="mb-6 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              type="text"
              placeholder="Buscar por título, descrição, rua ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm pl-10"
            />
        </div>

        {filteredProblems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Nenhum problema encontrado para sua busca.' : 'Nenhum problema foi relatado ainda.'}
            </p>
            {!searchTerm && !isVisitor && (
                <button
                onClick={onNewReport}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Seja o primeiro a relatar um problema
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onLike={handleLikeWrapper}
                onClick={handleProblemClick}
              />
            ))}
          </div>
        )}
      </main>

      <ProblemDetailModal
        problem={selectedProblem}
        isOpen={isModalOpen}
        onClose={closeModal}
        onLike={handleLikeWrapper}
      />
    </div>
  );
};

export default Dashboard;
