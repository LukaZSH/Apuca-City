// Arquivo: src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { PwaInstallProvider } from "@/hooks/usePwaInstall"; // 1. Importar o Provider
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UpdatePasswordPage from "@/components/UpdatePasswordPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="cidade-app-theme">
      <TooltipProvider>
        <AuthProvider>
          {/* 2. Envolver TODA a aplicação com o PwaInstallProvider */}
          <PwaInstallProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/update-password" element={<UpdatePasswordPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </PwaInstallProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;