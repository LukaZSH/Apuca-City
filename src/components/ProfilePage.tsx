
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useStorage } from '@/hooks/useStorage';
import { supabase } from '@/integrations/supabase/client';
import Header from './Header';

interface ProfilePageProps {
  onNewReport: () => void;
  onBackToDashboard: () => void;
}

const ProfilePage = ({ onNewReport, onBackToDashboard }: ProfilePageProps) => {
  const { signOut } = useAuth();
  const { profile, loading } = useProfile();
  const { uploadImage, uploading } = useStorage();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    try {
      const { url, error } = await uploadImage(file, 'avatars', profile.id);
      
      if (error) {
        console.error('Error uploading avatar:', error);
        alert('Erro ao fazer upload da imagem. Tente novamente.');
        return;
      }

      if (url) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: url })
          .eq('id', profile.id);

        if (updateError) {
          console.error('Error updating avatar URL:', updateError);
          alert('Erro ao atualizar foto de perfil. Tente novamente.');
        } else {
          alert('Foto de perfil atualizada com sucesso!');
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword.trim() || newPassword !== confirmPassword) {
      alert('As senhas não coincidem ou estão vazias');
      return;
    }

    if (newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        alert('Erro ao atualizar senha. Tente novamente.');
      } else {
        alert('Senha atualizada com sucesso!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Error in handleUpdatePassword:', error);
      alert('Erro ao atualizar senha. Tente novamente.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header onNewReport={onNewReport} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Carregando perfil...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onNewReport={onNewReport} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Meu Perfil
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie suas informações pessoais
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Foto do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="text-lg">
                    {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button 
                      variant="outline" 
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        {uploading ? 'Enviando...' : 'Alterar Foto'}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                />
              </div>
              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !newPassword.trim() || newPassword !== confirmPassword}
                className="w-full"
              >
                {isUpdatingPassword ? 'Atualizando...' : 'Atualizar Senha'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Logout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sair da sua conta atual
            </p>
            <Button
              onClick={handleSignOut}
              variant="destructive"
            >
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;
