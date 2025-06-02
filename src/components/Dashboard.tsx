
import React, { useState } from 'react';
import { useProblems } from '@/hooks/useProblems';
import ProblemCard from './ProblemCard';
import ProblemDetailModal from './ProblemDetailModal';
import Header from './Header';
import { Problem } from '@/hooks/useProblems';

interface DashboardProps {
  onNewReport: () => void;
  onShowUserProblems: () => void;
  onShowAdminPanel: () => void;
  onShowProfile: () => void;
}

const Dashboard = ({ onNewReport, onShowUserProblems, onShowAdminPanel, onShowProfile }: DashboardProps) => {
  const { problems, loading, toggleLike } = useProblems();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProblemClick = (problem: Problem) => {
    setSelectedProblem(problem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProblem(null);
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Problemas da Cidade
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Veja os problemas relatados pela comunidade e ajude a melhorar nossa cidade
          </p>
        </div>

        {problems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Nenhum problema foi relatado ainda.
            </p>
            <button
              onClick={onNewReport}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Seja o primeiro a relatar um problema
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onLike={toggleLike}
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
        onLike={toggleLike}
      />
    </div>
  );
};

export default Dashboard;
