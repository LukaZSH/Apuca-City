// src/components/UpdatePasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UpdatePasswordPageProps {
  onPasswordUpdated?: () => void; // Opcional: para redirecionar ou mudar view
}

const UpdatePasswordPage = ({ onPasswordUpdated }: UpdatePasswordPageProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUserPassword } = useAuth();
  const navigate = useNavigate(); // Para redirecionar após sucesso

  // Este useEffect é importante. Ele garante que o usuário só pode acessar
  // esta página se houver uma sessão de recuperação de senha ativa (ou seja, 'user' existe).
  // O Supabase JS SDK lida com o token da URL quando o AuthProvider é inicializado
  // e o evento 'PASSWORD_RECOVERY' é disparado.
  useEffect(() => {
    if (!user) {
      // Se não houver usuário na sessão (o que aconteceria se alguém tentasse acessar
      // /update-password diretamente sem o token do email), redirecione para o login.
      // Você pode querer mostrar uma mensagem mais específica.
      // toast.error("Sessão de recuperação de senha inválida ou expirada.");
      // navigate('/'); // Ou para a página de login
    }
  }, [user, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    const { error } = await updateUserPassword(newPassword);
    if (error) {
      toast.error(error.message || 'Erro ao atualizar a senha.');
    } else {
      toast.success('Senha atualizada com sucesso! Você pode fazer login agora.');
      setNewPassword('');
      setConfirmPassword('');
      if (onPasswordUpdated) {
        onPasswordUpdated(); // Chama o callback se fornecido
      } else {
        navigate('/'); // Redireciona para o login/dashboard por padrão
      }
    }
    setIsLoading(false);
  };

  // Se o usuário não estiver presente (o que significa que não há sessão de recuperação de senha ativa),
  // você pode optar por mostrar uma mensagem ou redirecionar.
  // O listener onAuthStateChange no AuthProvider já lida com o evento PASSWORD_RECOVERY,
  // então 'user' deve estar disponível se o link do e-mail foi usado.
  if (!user && !isLoading) { // Adicionado !isLoading para evitar piscar
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Link Inválido ou Expirado</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        O link de redefinição de senha pode ser inválido ou ter expirado.
                        Por favor, solicite um novo link.
                    </p>
                    <Button onClick={() => navigate('/')}>Voltar ao Login</Button>
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card text-card-foreground">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl font-bold text-foreground mb-2">Definir Nova Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12"
                placeholder="Digite sua nova senha"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12"
                placeholder="Confirme sua nova senha"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium dark:bg-blue-500 dark:hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? 'Atualizando...' : 'Atualizar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordPage;