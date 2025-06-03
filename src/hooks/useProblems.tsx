// Arquivo: src/hooks/useProblems.tsx

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Database } from '@/integrations/supabase/types';

type ProblemType = Database['public']['Enums']['problem_type'];
// ProblemStatus não é usado diretamente em createProblem, mas pode ser mantido se usado em outro lugar.
// type ProblemStatus = Database['public']['Enums']['problem_status'];

export interface Problem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string;
  location_address: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'in_progress' | 'resolved';
  likes_count: number;
  created_at: string;
  updated_at: string;
  user_has_liked?: boolean;
  images?: { image_url: string }[];
}

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProblems = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('problems')
        .select(`
          *,
          problem_images(image_url)
        `)
        .order('created_at', { ascending: false });

      const { data: problemsData, error } = await query;

      if (error) {
        console.error('Error fetching problems:', error);
        setProblems([]); // Definir como array vazio em caso de erro
        return;
      }

      if (user && problemsData) {
        const problemIds = problemsData.map(p => p.id);
        const { data: likesData } = await supabase
          .from('problem_likes')
          .select('problem_id')
          .eq('user_id', user.id)
          .in('problem_id', problemIds);

        const likedProblemIds = new Set(likesData?.map(like => like.problem_id) || []);

        const problemsWithLikesAndImages = problemsData.map(problem => ({
          ...problem,
          user_has_liked: likedProblemIds.has(problem.id),
          // Assegurar que 'images' seja um array, mesmo que problem_images seja null/undefined
          images: Array.isArray(problem.problem_images) ? problem.problem_images : [] 
        }));
        setProblems(problemsWithLikesAndImages);
      } else {
        setProblems(problemsData?.map(problem => ({
          ...problem,
          user_has_liked: false,
          images: Array.isArray(problem.problem_images) ? problem.problem_images : []
        })) || []);
      }
    } catch (error) {
      console.error('Error in fetchProblems:', error);
      setProblems([]); // Definir como array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (problemId: string) => {
    if (!user) return;

    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;

    try {
      if (problem.user_has_liked) {
        const { error } = await supabase
          .from('problem_likes')
          .delete()
          .eq('problem_id', problemId)
          .eq('user_id', user.id);

        if (!error) {
          setProblems(prev => prev.map(p => 
            p.id === problemId 
              ? { ...p, user_has_liked: false, likes_count: p.likes_count - 1 }
              : p
          ));
        }
      } else {
        const { error } = await supabase
          .from('problem_likes')
          .insert({ problem_id: problemId, user_id: user.id });

        if (!error) {
          setProblems(prev => prev.map(p => 
            p.id === problemId 
              ? { ...p, user_has_liked: true, likes_count: p.likes_count + 1 }
              : p
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // MODIFICAÇÃO AQUI: Ajustar a tipagem de problemData e a lógica da função
  const createProblem = async (problemData: {
    type: ProblemType;
    title: string;
    description: string;
    location_address: string;
    latitude?: number;
    longitude?: number;
    image_urls?: string[]; // <-- ADICIONADO: para receber as URLs das imagens
  }) => {
    if (!user) return { data: null, error: { message: 'User not authenticated' } };

    try {
      // 1. Criar o problema principal
      const { data: newProblem, error: problemError } = await supabase
        .from('problems')
        .insert({
          type: problemData.type,
          title: problemData.title,
          description: problemData.description,
          location_address: problemData.location_address,
          latitude: problemData.latitude,
          longitude: problemData.longitude,
          user_id: user.id
          // status e likes_count têm valores padrão no DB, não precisa enviar aqui
        })
        .select()
        .single();

      if (problemError) {
        console.error('Error creating problem:', problemError);
        return { data: null, error: problemError };
      }

      if (!newProblem) {
        // Isso não deveria acontecer se problemError for nulo, mas é uma boa verificação
        return { data: null, error: { message: 'Failed to create problem or retrieve its ID.' }};
      }

      // 2. Se houver URLs de imagem, inseri-las na tabela problem_images
      if (problemData.image_urls && problemData.image_urls.length > 0) {
        const imageRecords = problemData.image_urls.map(url => ({
          problem_id: newProblem.id, // Usa o ID do problema recém-criado
          image_url: url,
        }));

        const { error: imagesError } = await supabase
          .from('problem_images')
          .insert(imageRecords);

        if (imagesError) {
          console.error('Error saving problem images:', imagesError);
          // Aqui você pode decidir como lidar com este erro.
          // Por exemplo, poderia retornar o erro ou deletar o problema que foi criado
          // se o salvamento das imagens for crítico.
          // Por simplicidade, vamos apenas logar e continuar.
        }
      }

      await fetchProblems(); // Recarrega a lista de problemas para incluir o novo
      
      return { data: newProblem, error: null };
    } catch (error) {
      console.error('Error in createProblem:', error);
      return { data: null, error: error as any };
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [user]); // fetchProblems já é estável, mas user pode mudar

  return {
    problems,
    loading,
    toggleLike,
    createProblem,
    refetch: fetchProblems
  };
};