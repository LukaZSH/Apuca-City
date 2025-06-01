
import React from 'react';
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
  const { stats, updateProblemStatus } = useAdmin();
  const { problems, loading } = useProblems();

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

  const handleStatusChange = async (problemId: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    await updateProblemStatus(problemId, newStatus);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      <Header onNewReport={onNewReport} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Painel Administrativo
            </h2>
            <p className="text-gray-600">
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
              <CardTitle className="text-sm font-medium text-gray-600">Total de Problemas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_problems || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Problemas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.recent_problems || 0}</div>
              <p className="text-xs text-gray-500">Últimos 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.problems_by_status.find(s => s.status === 'pending')?.count || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Resolvidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
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
                <BarChart data={stats?.problems_by_status || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
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
                <div key={problem.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {getTypeDisplayName(problem.type)}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(problem.status)}`}>
                        {getStatusText(problem.status)}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900">{problem.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{problem.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{problem.location_address}</p>
                  </div>
                  <div className="ml-4">
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
