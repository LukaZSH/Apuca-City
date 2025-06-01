
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';
import { useProblems } from '@/hooks/useProblems';
import { useAuth } from '@/hooks/useAuth';
import Header from './Header';

interface UserProblemsPageProps {
  onNewReport: () => void;
  onBackToDashboard: () => void;
}

const UserProblemsPage = ({ onNewReport, onBackToDashboard }: UserProblemsPageProps) => {
  const { problems, loading } = useProblems();
  const { user } = useAuth();

  const userProblems = problems.filter(problem => problem.user_id === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em andamento';
      case 'resolved': return 'Resolvido';
      default: return 'Desconhecido';
    }
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

  const formatDate = (dateString: string) => {
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
      <div className="min-h-screen bg-gray-50">
        <Header onNewReport={onNewReport} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Carregando seus problemas...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNewReport={onNewReport} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Meus Relatórios
            </h2>
            <p className="text-gray-600">
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
              <p className="text-gray-500 mb-4">Você ainda não relatou nenhum problema.</p>
              <Button onClick={onNewReport} className="bg-blue-600 hover:bg-blue-700">
                Criar primeiro relatório
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userProblems.map((problem) => (
              <Card key={problem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                      {getTypeDisplayName(problem.type)}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(problem.status)}`}>
                      {getStatusText(problem.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {problem.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {problem.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{problem.location_address}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(problem.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span className="text-sm font-medium">{problem.likes_count}</span>
                      <span className="text-xs">apoios</span>
                    </div>
                    {problem.status === 'resolved' && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
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
    </div>
  );
};

export default UserProblemsPage;
