
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onNewReport: () => void;
}

const Header = ({ onNewReport }: HeaderProps) => {
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
          
          <Button
            onClick={onNewReport}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo relato
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
