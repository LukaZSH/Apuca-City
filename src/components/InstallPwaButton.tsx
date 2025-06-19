// Arquivo: src/components/InstallPwaButton.tsx

import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { usePwaInstall } from '@/hooks/usePwaInstall'; // Importa nosso hook global

const InstallPwaButton = () => {
  // Consome o contexto para obter o prompt e a função de disparo
  const { installPrompt, triggerInstall } = usePwaInstall();

  // Se não houver prompt, o app não é instalável ou já foi instalado.
  // Neste caso, o componente não renderiza nada.
  if (!installPrompt) {
    return null;
  }

  return (
    <Button
      onClick={triggerInstall}
      // CORREÇÃO: A classe 'flex' garante que ele apareça em todos os tamanhos de tela.
      // O texto interno se adapta para telas pequenas e grandes.
      className="bg-green-600 hover:bg-green-700 text-white animate-pulse flex"
      size="sm"
    >
      <Download className="mr-2 h-4 w-4" />
      {/* Mostra "Instalar App" em telas maiores */}
      <span className="hidden sm:inline">Instalar App</span>
      {/* Mostra apenas "Instalar" em telas pequenas para não quebrar o layout */}
      <span className="sm:hidden">Instalar</span>
    </Button>
  );
};

export default InstallPwaButton;