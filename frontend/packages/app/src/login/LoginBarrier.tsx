import React, { FC } from 'react';
import Observable from 'zen-observable';
import { useObservable } from 'react-use';
import { LoginState } from './types';

type LoginBarrierProps = {
  fallback: React.ComponentType<{ state: LoginState }>;
  state$: Observable<LoginState>;
};

export const LoginBarrier: FC<LoginBarrierProps> = ({
  fallback: Fallback,
  state$,
  children,
}) => {
  const state = useObservable(state$, { type: 'LOGGED_OUT' });
  if (state.type === 'LOGGED_IN') {
    return <>{children}</>;
  } else {
    return <Fallback state={state} />;
  }
};
