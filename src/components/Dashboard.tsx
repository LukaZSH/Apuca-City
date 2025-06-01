
import React, { useState } from 'react';
import Header from './Header';
import ProblemCard from './ProblemCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Problem {
  id: string;
  type: string;
  description: string;
  location: string;
  date: string;
  status: 'pending' | 'in_progress' | 'resolved';
  likes: number;
}

interface DashboardProps {
  onNewReport: () => void;
}

const Dashboard = ({ onNewReport }: DashboardProps) => {
  const [problems, setProblems] = useState<Problem[]>([
    {
      id: '1',
      type: 'Buraco na rua',
      description: 'Buraco grande na Rua das Flores causando transtornos aos motoristas',
      location: 'Rua das Flores, 123 - Centro',
      date: '01/06/2025',
      status: 'pending',
      likes: 12
    },
    {
      id: '2',
      type: 'Iluminação pública',
      description: 'Poste de luz queimado há mais de uma semana',
      location: 'Av. Principal, 456 - Jardim',
      date: '31/05/2025',
      status: 'in_progress',
      likes: 8
    },
    {
      id: '3',
      type: 'Lixo acumulado',
      description: 'Lixo acumulado na esquina causando mau cheiro',
      location: 'Rua do Comércio, 789 - Vila Nova',
      date: '30/05/2025',
      status: 'resolved',
      likes: 5
    }
  ]);

  const handleLike = (id: string) => {
    setProblems(problems.map(problem => 
      problem.id === id 
        ? { ...problem, likes: problem.likes + 1 }
        : problem
    ));
  };

  const filterByStatus = (status?: string) => {
    if (!status) return problems;
    return problems.filter(problem => problem.status === status);
  };

  const getStatusCount = (status: string) => {
    return problems.filter(problem => problem.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewReport={onNewReport} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Relatórios recentes
          </h2>
          <p className="text-gray-600">
            Acompanhe os problemas relatados pela comunidade
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-96">
            <TabsTrigger value="all" className="text-sm">
              Todos
              <Badge variant="secondary" className="ml-2 text-xs">
                {problems.length}
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
              {problems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onLike={handleLike}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterByStatus('pending').map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onLike={handleLike}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterByStatus('in_progress').map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onLike={handleLike}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterByStatus('resolved').map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  onLike={handleLike}
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
