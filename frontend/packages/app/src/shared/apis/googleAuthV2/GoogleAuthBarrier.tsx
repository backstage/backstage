import React, { createContext, FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GoogleSession } from './types';
import { googleAuth } from './GoogleAuth';
import Progress from 'shared/components/Progress';

const DEFAULT_INTERVAL = 60 * 1000;

type Props = {
  scope?: string | string[];
  refreshInterval?: number;
};

const Context = createContext<(() => GoogleSession) | undefined>(undefined);

export const useGetGoogleAccessToken = (): (() => String) => {
  const getSession = useContext(Context);
  if (!getSession) {
    throw new Error('You can only use this hook inside a GoogleAuthBarrier');
  }

  return useCallback(() => getSession().accessToken, [getSession]);
};

export const useGetGoogleIdToken = (): (() => String) => {
  const getSession = useContext(Context);
  if (!getSession) {
    throw new Error('You can only use this hook inside a GoogleAuthBarrier');
  }

  return useCallback(() => getSession().idToken, [getSession]);
};

const GoogleAuthBarrier: FC<Props> = ({ scope, refreshInterval = DEFAULT_INTERVAL, children }) => {
  const ref = useRef<GoogleSession>();
  const [state, setState] = useState({ loading: true, error: null });
  const [retryAttempts, setRetryAttempts] = useState(0);
  const getSession = useCallback(() => ref.current!, []);
  const api = googleAuth;
  const scopeString = Array.isArray(scope) ? scope.join(' ') : scope;

  const handleRetry = () => {
    setState({ loading: true, error: null });
    setRetryAttempts(x => x + 1);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timer | undefined;

    const initialGet = async () => {
      try {
        const googleSession = await api.getSession({ optional: false, scope: scopeString });
        ref.current = googleSession;
        setState({ loading: false, error: null });

        timeoutId = setTimeout(refresh, refreshInterval);
      } catch (error) {
        setState({ loading: false, error });
      }
    };

    const refresh = async () => {
      try {
        const googleSession = await api.getSession({ optional: false, scope: scopeString });
        ref.current = googleSession;
        timeoutId = setTimeout(refresh, refreshInterval);
      } catch (error) {
        if (error.name === 'PopupClosedError') {
          ref.current = undefined;
          setState({ loading: false, error });
        } else {
          timeoutId = setTimeout(refresh, 5 * 1000);
        }
      }
    };

    initialGet();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [retryAttempts, refreshInterval, api, scopeString]);

  if (state.loading) {
    return <Progress />;
  }
  if (state.error) {
    return (
      <div>
        Google auth failed, {String(state.error)} <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return <Context.Provider value={getSession} children={children} />;
};

export default GoogleAuthBarrier;
