import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
import { delay } from '../utils/delay.ts';

export const useLoginPageEffect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (location.state) {
        navigate(location.pathname, { replace: true, state: {} });
      }
      return;
    }

    if (location.state?.needAuth) {
      toast.error('로그인이 필요한 서비스입니다.');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (!loading && user) {
      (async () => {
        await delay(200);
        navigate('/', { replace: true });
      })();
    }
  }, [loading, user, navigate]);
};
