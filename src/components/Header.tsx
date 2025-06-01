
import React from 'react';
import { Plus, LogOut, User, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onNewReport: () => void;
  onShowUserProblems?: () => void;
  onShowAdminPanel?: () => void;
}

const Header = ({ onNewReport, onShowUserProblems, onShowAdminPanel }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">AC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Apuca City</h1>
              <p className="text-xs text-gray-500">Sua cidade, sua voz</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={onNewReport}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo relato
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled className="text-xs">
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {onShowUserProblems && (
                  <DropdownMenuItem onClick={onShowUserProblems}>
                    <FileText className="w-4 h-4 mr-2" />
                    Meus relatórios
                  </DropdownMenuItem>
                )}
                {isAdmin && onShowAdminPanel && (
                  <DropdownMenuItem onClick={onShowAdminPanel}>
                    <Settings className="w-4 h-4 mr-2" />
                    Painel administrativo
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
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
