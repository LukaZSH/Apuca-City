import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useAdmin } from '@/hooks/useAdmin';
import { LogOut, User as UserIcon, FileText, PanelTop, Download } from 'lucide-react';
import InstallPwaButton from './InstallPwaButton'; // 1. Importa o novo botão

interface HeaderProps {
  onNewReport: () => void;
  onShowUserProblems?: () => void;
  onShowAdminPanel?: () => void;
  onShowProfile?: () => void;
}

const Header = ({ onNewReport, onShowUserProblems, onShowAdminPanel, onShowProfile }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { isAdmin } = useAdmin();

  const getUserDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    return user?.email || 'Usuário';
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(name => name.charAt(0)).join('').slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full dark:bg-slate-700">
               <img src="/pwa-192x192.png" alt="Logo Apuca City" className="h-full w-full rounded-full" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              Apuca City
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <InstallPwaButton /> {/* 2. Adiciona o botão aqui */}
            <ThemeToggle />
            
            <div className="hidden md:flex items-center space-x-4">
              <Button onClick={onNewReport} className="bg-blue-600 hover:bg-blue-700 text-white">
                Novo Relato
              </Button>
              
              {onShowUserProblems && (
                <Button variant="outline" onClick={onShowUserProblems}>
                  Meus Relatos
                </Button>
              )}
              
              {isAdmin && onShowAdminPanel && (
                <Button 
                  variant="outline" 
                  onClick={onShowAdminPanel}
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Badge variant="secondary" className="mr-2 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                    Admin
                  </Badge>
                  Painel
                </Button>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />

                <div className="md:hidden">
                    <DropdownMenuItem onClick={onNewReport}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Novo Relato</span>
                    </DropdownMenuItem>
                    {onShowUserProblems && (
                        <DropdownMenuItem onClick={onShowUserProblems}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Meus Relatos</span>
                        </DropdownMenuItem>
                    )}
                     {isAdmin && onShowAdminPanel && (
                        <DropdownMenuItem onClick={onShowAdminPanel}>
                            <PanelTop className="mr-2 h-4 w-4" />
                            <span>Painel Admin</span>
                        </DropdownMenuItem>
                    )}
                   <DropdownMenuSeparator />
                </div>
                
                {onShowProfile && (
                    <DropdownMenuItem onClick={onShowProfile}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
