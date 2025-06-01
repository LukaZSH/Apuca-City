
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
      
      // Buscar problemas com informações de curtidas do usuário atual
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
        return;
      }

      // Se o usuário estiver logado, verificar quais problemas ele curtiu
      if (user && problemsData) {
        const problemIds = problemsData.map(p => p.id);
        const { data: likesData } = await supabase
          .from('problem_likes')
          .select('problem_id')
          .eq('user_id', user.id)
          .in('problem_id', problemIds);

        const likedProblemIds = new Set(likesData?.map(like => like.problem_id) || []);

        const problemsWithLikes = problemsData.map(problem => ({
          ...problem,
          user_has_liked: likedProblemIds.has(problem.id),
          images: problem.problem_images || []
        }));

        setProblems(problemsWithLikes);
      } else {
        setProblems(problemsData?.map(problem => ({
          ...problem,
          user_has_liked: false,
          images: problem.problem_images || []
        })) || []);
      }
    } catch (error) {
      console.error('Error in fetchProblems:', error);
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
        // Remover curtida
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
        // Adicionar curtida
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

  const createProblem = async (problemData: {
    type: string;
    title: string;
    description: string;
    location_address: string;
    latitude?: number;
    longitude?: number;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('problems')
        .insert({
          ...problemData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating problem:', error);
        return { error };
      }

      // Recarregar a lista de problemas
      fetchProblems();
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in createProblem:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [user]);

  return {
    problems,
    loading,
    toggleLike,
    createProblem,
    refetch: fetchProblems
  };
};
