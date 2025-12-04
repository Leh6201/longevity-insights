import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
};

export default Index;
