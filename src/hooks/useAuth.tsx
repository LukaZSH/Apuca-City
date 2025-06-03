// Arquivo: src/hooks/useAuth.tsx
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: any }>; // <-- Adicionar
  updateUserPassword: (password: string) => Promise<{ error: any }>; // <-- Adicionar para a próxima etapa
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (lógica onAuthStateChange e getSession)
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Listener para evento PASSWORD_RECOVERY
        // Se o evento for PASSWORD_RECOVERY, o usuário clicou no link do e-mail
        // e foi redirecionado de volta para o app.
        // A sessão conterá o usuário, indicando que ele está pronto para atualizar a senha.
        // Você pode querer redirecionar para a página de atualização de senha aqui,
        // ou sua lógica de roteamento já pode estar fazendo isso.
        if (event === 'PASSWORD_RECOVERY') {
          // Exemplo: router.push('/update-password');
          // Ou, se sua página de atualização de senha já verifica se 'user' existe
          // e está na URL correta, pode não precisar de ação aqui.
          console.log('Password recovery event detected, user should be on update password page.');
        }
      }
    );
     supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });


    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    // ... (código signUp)
     const redirectUrl = `${window.location.origin}/`; // Para confirmação de email, se aplicável
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // ... (código signIn)
     const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signOut = async () => {
    // ... (código signOut)
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  // NOVA FUNÇÃO
  const requestPasswordReset = async (email: string) => {
    // A URL para onde o usuário será redirecionado após clicar no link do e-mail.
    // Certifique-se que '/update-password' seja uma rota válida no seu app.
    const redirectTo = `${window.location.origin}/update-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    return { error };
  };

  // NOVA FUNÇÃO (para a página de atualização de senha)
  const updateUserPassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    return { error }; // data aqui geralmente é o objeto do usuário atualizado
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    requestPasswordReset, // <-- Adicionar
    updateUserPassword,   // <-- Adicionar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // ... (código useAuth)
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};