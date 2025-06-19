import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

// Tipagem para o evento 'beforeinstallprompt' que os navegadores disparam
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPwaButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previne o comportamento padrão do navegador
      e.preventDefault();
      // Guarda o evento para que possamos acioná-lo com nosso botão
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Escuta o evento que indica que o app pode ser instalado
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Limpa o listener quando o componente é desmontado
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Mostra o prompt de instalação nativo do navegador
    deferredPrompt.prompt();
    // Espera o usuário responder ao prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Resposta do usuário ao prompt de instalação: ${outcome}`);
    // O prompt só pode ser usado uma vez, então limpamos o estado
    setDeferredPrompt(null);
  };

  // Se não houver prompt, o botão não é renderizado.
  // Isso acontece se o app já estiver instalado ou se o navegador não suportar.
  if (!deferredPrompt) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      className="bg-green-600 hover:bg-green-700 text-white animate-pulse hidden sm:flex"
      size="sm"
    >
      <Download className="mr-2 h-4 w-4" />
      Instalar App
    </Button>
  );
};

export default InstallPwaButton;