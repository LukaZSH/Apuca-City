
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useStorage } from '@/hooks/useStorage';
import Header from './Header';

interface ProfilePageProps {
  onNewReport: () => void;
  onBackToDashboard: () => void;
}

const ProfilePage = ({ onNewReport, onBackToDashboard }: ProfilePageProps) => {
  const { signOut } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const { uploadImage, uploading } = useStorage();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    try {
      const { url, error } = await uploadImage(file, 'avatars', profile.id);
      
      if (error) {
        console.error('Error uploading avatar:', error);
        return;
      }

      if (url) {
        await updateProfile({ avatar_url: url });
      }
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
    }
  };

  const handleUpdateName = async () => {
    if (!fullName.trim()) return;

    setIsUpdating(true);
    try {
      await updateProfile({ full_name: fullName.trim() });
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      setIsUpdating(false);
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
              <CardTitle>Informações Pessoais</CardTitle>
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
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Digite seu nome completo"
                />
              </div>
              <Button
                onClick={handleUpdateName}
                disabled={isUpdating || !fullName.trim() || fullName === profile?.full_name}
                className="w-full"
              >
                {isUpdating ? 'Atualizando...' : 'Atualizar Nome'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Zona de Perigo</CardTitle>
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
