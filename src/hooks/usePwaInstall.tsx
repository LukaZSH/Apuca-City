// Arquivo: src/hooks/usePwaInstall.tsx

import React, { useState, useEffect, createContext, useContext } from 'react';

// Tipagem para o evento que o navegador dispara
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaInstallContextType {
  installPrompt: BeforeInstallPromptEvent | null;
  triggerInstall: () => void;
}

const PwaInstallContext = createContext<PwaInstallContextType | undefined>(undefined);

// Provider que vai "escutar" o evento de instalação globalmente
export const PwaInstallProvider = ({ children }: { children: React.ReactNode }) => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      console.log('PWA: Evento de instalação capturado!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerInstall = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null); // O prompt só pode ser usado uma vez
  };

  const value = { installPrompt, triggerInstall };

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
    </PwaInstallContext.Provider>
  );
};

// Hook para consumir o contexto nos componentes
export const usePwaInstall = () => {
  const context = useContext(PwaInstallContext);
  if (context === undefined) {
    throw new Error('usePwaInstall must be used within a PwaInstallProvider');
  }
  return context;
};