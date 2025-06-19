
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm } from '@/components/LoginForm';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      // 检查是否有重定向参数
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(redirect);
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, searchParams]);

  return <LoginForm />;
};

export default Login;
