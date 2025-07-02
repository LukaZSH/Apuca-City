// @deno-types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Função delete-user inicializada.");

Deno.serve(async (req) => {
  // Tratamento específico para a requisição OPTIONS (preflight) do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Extrair o ID do usuário do corpo da requisição
    const body = await req.json();
    const userIdToDelete = body.userIdToDelete;

    if (!userIdToDelete) {
      throw new Error("ID do usuário para deletar (userIdToDelete) não foi fornecido no corpo da requisição.");
    }

    // 2. Criar um cliente admin do Supabase que pode bypassar as políticas de RLS
    // As variáveis de ambiente são configuradas no painel do Supabase ou via 'supabase secrets set'
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 3. Deletar o usuário usando a API de administração da autenticação
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);

    if (error) {
      // Se houver um erro ao deletar, lança o erro para o bloco catch
      throw error;
    }

    // 4. Retornar uma resposta de sucesso
    return new Response(JSON.stringify({ message: 'Usuário deletado com sucesso!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    // 5. Capturar e retornar qualquer erro que tenha ocorrido no processo
    console.error('Erro na função delete-user:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Usar 500 para erro de servidor é mais apropriado
    });
  }
});
