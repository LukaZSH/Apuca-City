
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AdminStats {
  total_problems: number;
  problems_by_status: { status: string; count: number }[];
  problems_by_type: { type: string; count: number }[];
  recent_problems: number;
}

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const { user } = useAuth();

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      // Verificar se o usuário tem role de admin na tabela user_roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!isAdmin) return;

    try {
      // Total de problemas
      const { count: totalProblems } = await supabase
        .from('problems')
        .select('*', { count: 'exact', head: true });

      // Problemas por status
      const { data: statusData } = await supabase
        .from('problems')
        .select('status')
        .order('status');

      // Problemas por tipo
      const { data: typeData } = await supabase
        .from('problems')
        .select('type')
        .order('type');

      // Problemas recentes (últimos 7 dias)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: recentProblems } = await supabase
        .from('problems')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Processar dados para estatísticas
      const problemsByStatus = statusData?.reduce((acc, problem) => {
        const existing = acc.find(item => item.status === problem.status);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ status: problem.status, count: 1 });
        }
        return acc;
      }, [] as { status: string; count: number }[]) || [];

      const problemsByType = typeData?.reduce((acc, problem) => {
        const existing = acc.find(item => item.type === problem.type);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ type: problem.type, count: 1 });
        }
        return acc;
      }, [] as { type: string; count: number }[]) || [];

      setStats({
        total_problems: totalProblems || 0,
        problems_by_status: problemsByStatus,
        problems_by_type: problemsByType,
        recent_problems: recentProblems || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const updateProblemStatus = async (problemId: string, status: 'pending' | 'in_progress' | 'resolved') => {
    if (!isAdmin) return { error: 'Unauthorized' };

    try {
      const { error } = await supabase
        .from('problems')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', problemId);

      if (!error) {
        fetchStats(); // Recarregar estatísticas
      }

      return { error };
    } catch (error) {
      console.error('Error updating problem status:', error);
      return { error };
    }
  };

  const deleteProblem = async (problemId: string) => {
    if (!isAdmin) return { error: 'Unauthorized' };

    try {
      const { error } = await supabase
        .from('problems')
        .delete()
        .eq('id', problemId);

      if (!error) {
        fetchStats(); // Recarregar estatísticas
      }

      return { error };
    } catch (error) {
      console.error('Error deleting problem:', error);
      return { error };
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  return {
    isAdmin,
    loading,
    stats,
    updateProblemStatus,
    deleteProblem,
    refetchStats: fetchStats
  };
};
