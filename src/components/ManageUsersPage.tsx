import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import Header from './Header';

// Interface para os dados do usuário que vamos buscar
interface AppUser {
  id: string;
  email?: string;
  full_name?: string;
  created_at: string;
}

interface ManageUsersPageProps {
  onNewReport: () => void;
  onBackToDashboard: () => void;
}

const ManageUsersPage = ({ onNewReport, onBackToDashboard }: ManageUsersPageProps) => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para buscar todos os perfis de usuários
  const fetchUsers = async () => {
    setLoading(true);
    // Buscamos da tabela 'profiles' que é publicamente acessível (com RLS)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error("Erro ao buscar usuários.", { description: error.message });
      setUsers([]);
    } else {
      setUsers(data as AppUser[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string, userEmail?: string) => {
    if (!window.confirm(`Tem certeza que deseja deletar o usuário ${userEmail || userId}? Esta ação é irreversível e apagará todos os relatos e dados associados a ele.`)) {
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userIdToDelete: userId },
      });

      if (error) throw error;

      toast.success('Usuário deletado com sucesso!');
      fetchUsers(); // Atualiza a lista
    } catch (error: any) {
      console.error("Erro ao invocar a função de deletar:", error);
      toast.error('Falha ao deletar usuário.', { description: error.message || 'Verifique os logs da Edge Function.' });
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onNewReport={onNewReport} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Gerenciar Usuários</h2>
            <p className="text-muted-foreground">Busque, visualize e remova usuários da plataforma.</p>
          </div>
          <Button variant="outline" onClick={onBackToDashboard}>Voltar ao Painel</Button>
        </div>
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 max-w-sm"
        />
        <div className="space-y-4">
          {loading ? <p className="text-muted-foreground">Carregando usuários...</p> : filteredUsers.map(user => (
            <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
              <div>
                <p className="font-medium text-foreground">{user.full_name || 'Nome não informado'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground/80">Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.id, user.email)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Deletar Usuário</span>
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManageUsersPage;
