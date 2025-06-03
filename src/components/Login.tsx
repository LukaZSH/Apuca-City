// Arquivo: src/components/Login.tsx
import React, { useState } from 'react'; // Removido useEffect se não for usado diretamente aqui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Adicionado CardTitle se for usar
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { FaBuilding } from "react-icons/fa6";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Novos estados para a funcionalidade "Esqueci minha senha"
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Adicionar requestPasswordReset do hook useAuth
  const { signIn, signUp, requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este e-mail já está cadastrado. Tente fazer login.');
          } else {
            toast.error(error.message || 'Erro ao criar conta');
          }
        } else {
          toast.success('Conta criada com sucesso! Verifique seu e-mail.');
          // Opcional: Limpar campos ou mudar para tela de login se necessário
          // setIsSignUp(false);
          // setEmail('');
          // setPassword('');
          // setFullName('');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('E-mail ou senha incorretos');
          } else {
            toast.error(error.message || 'Erro ao fazer login');
          }
        }
        // Se o login for bem-sucedido, o AuthProvider cuidará do redirecionamento/atualização do estado global
      }
    } catch (error) {
      toast.error('Erro inesperado. Tente novamente.');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Nova função para lidar com a submissão do formulário de "Esqueci minha senha"
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error('Por favor, insira seu e-mail.');
      return;
    }
    setIsLoading(true);
    // Certifique-se que 'requestPasswordReset' existe no seu 'useAuth' e está corretamente implementado
    const { error } = await requestPasswordReset(forgotPasswordEmail);
    if (error) {
      toast.error(error.message || 'Erro ao solicitar redefinição de senha.');
    } else {
      toast.success('Se o e-mail existir em nossa base, um link para redefinição de senha foi enviado.');
      setShowForgotPassword(false); // Volta para a tela de login/cadastro
      setForgotPasswordEmail(''); // Limpa o campo
    }
    setIsLoading(false);
  };

  // Renderização condicional para o formulário de "Esqueci minha senha"
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-card text-card-foreground">
          <CardHeader className="text-center pb-8">
            {/* Você pode adicionar um ícone específico para redefinição de senha se desejar */}
            <div className="mx-auto mb-6 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <div className="text-white text-2xl font-bold"><FaBuilding /></div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Redefinir Senha</h1>
            <p className="text-muted-foreground text-sm">
              Digite seu e-mail para enviarmos um link de redefinição.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">E-mail</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="h-12"
                  placeholder="Digite seu e-mail de cadastro"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium dark:bg-blue-500 dark:hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Link'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                disabled={isLoading}
              >
                Voltar ao Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Formulário principal de Login/Cadastro
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card text-card-foreground">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <div className="text-white text-2xl font-bold"><FaBuilding /></div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Apuca City</h1>
          <p className="text-muted-foreground text-sm">
            Relatar problemas urbanos nunca foi tão fácil
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12"
                  placeholder="Digite seu nome completo"
                  required={isSignUp}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                placeholder="Digite seu e-mail"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                placeholder={isSignUp ? "Crie uma senha (mín. 6 caracteres)" : "Digite sua senha"}
                minLength={isSignUp ? 6 : undefined}
                required
              />
            </div>
            
            {/* Link para Esqueci minha senha (aparece apenas na tela de login) */}
            {!isSignUp && (
              <div className="text-right -mt-2 mb-2"> 
                <button
                  type="button" // Importante ser type="button" para não submeter o form principal
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  disabled={isLoading}
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : (isSignUp ? 'Criar conta' : 'Entrar')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                // Limpar campos ao alternar pode ser uma boa UX
                // setEmail(''); 
                // setPassword('');
                // setFullName('');
              }}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              disabled={isLoading}
            >
              {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;