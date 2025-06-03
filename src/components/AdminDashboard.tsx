import React from 'react'; // Adicionado import do React para React.useMemo
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/hooks/useAdmin';
import { useProblems } from '@/hooks/useProblems';
import Header from './Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  onNewReport: () => void;
  onBackToDashboard: () => void;
}

const AdminDashboard = ({ onNewReport, onBackToDashboard }: AdminDashboardProps) => {
  const { stats, updateProblemStatus, deleteProblem } = useAdmin();
  const { problems, loading, refetch } = useProblems();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
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

  const handleStatusChange = async (problemId: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    await updateProblemStatus(problemId, newStatus);
    refetch();
  };

  const handleDeleteProblem = async (problemId: string) => {
    if (confirm('Tem certeza que deseja excluir este problema? Esta ação não pode ser desfeita.')) {
      await deleteProblem(problemId);
      refetch();
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // MODIFICAÇÃO: Preparar dados traduzidos para o gráfico de status
  // Usar React.useMemo para otimizar, recalculando apenas quando stats.problems_by_status mudar.
  const translatedProblemsByStatus = React.useMemo(() => {
    if (!stats?.problems_by_status) {
      return [];
    }
    return stats.problems_by_status.map(item => ({
      ...item,
      statusLabel: getStatusText(item.status) // Adiciona um novo campo com o rótulo traduzido
    }));
  }, [stats?.problems_by_status]); // Dependência do useMemo

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onNewReport={onNewReport} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Carregando painel administrativo...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900"> {/* Alterado para bg-gray-50 dark:bg-gray-900 para consistência com o loading */}
      <Header onNewReport={onNewReport} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Painel Administrativo
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie problemas e visualize estatísticas da cidade
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

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Problemas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total_problems || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Problemas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.recent_problems || 0}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Últimos 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats?.problems_by_status.find(s => s.status === 'pending')?.count || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolvidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats?.problems_by_status.find(s => s.status === 'resolved')?.count || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Problemas por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {/* MODIFICAÇÃO: Passar os dados traduzidos para o gráfico */}
                <BarChart data={translatedProblemsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* MODIFICAÇÃO: Usar o campo traduzido para o eixo X */}
                  <XAxis dataKey="statusLabel" /> 
                  <YAxis allowDecimals={false} /> {/* Adicionado allowDecimals={false} para o eixo Y se a contagem for sempre inteira */}
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Problemas por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats?.problems_by_type || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percent }) => `${getTypeDisplayName(type)} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats?.problems_by_type.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Problemas para Gerenciar */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Problemas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {problems.map((problem) => (
                <div key={problem.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {getTypeDisplayName(problem.type)}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(problem.status)}`}>
                        {getStatusText(problem.status)}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{problem.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{problem.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{problem.location_address}</p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Select
                      value={problem.status}
                      onValueChange={(value: 'pending' | 'in_progress' | 'resolved') => 
                        handleStatusChange(problem.id, value)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="in_progress">Em andamento</SelectItem>
                        <SelectItem value="resolved">Resolvido</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProblem(problem.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;