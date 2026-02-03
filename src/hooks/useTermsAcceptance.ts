import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseTermsAcceptanceResult {
  hasAcceptedTerms: boolean;
  isLoading: boolean;
  termsAcceptedAt: string | null;
  refetch: () => Promise<void>;
}

export const useTermsAcceptance = (): UseTermsAcceptanceResult => {
  const { user } = useAuth();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [termsAcceptedAt, setTermsAcceptedAt] = useState<string | null>(null);

  const fetchTermsStatus = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('terms_accepted_at')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching terms status:', error);
        setHasAcceptedTerms(false);
      } else {
        const accepted = data?.terms_accepted_at !== null;
        setHasAcceptedTerms(accepted);
        setTermsAcceptedAt(data?.terms_accepted_at || null);
      }
    } catch (error) {
      console.error('Error fetching terms status:', error);
      setHasAcceptedTerms(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsStatus();
  }, [user]);

  return {
    hasAcceptedTerms,
    isLoading,
    termsAcceptedAt,
    refetch: fetchTermsStatus,
  };
};
