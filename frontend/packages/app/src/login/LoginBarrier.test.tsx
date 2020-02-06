import { render, wait, act } from '@testing-library/react';
import React from 'react';
import Observable from 'zen-observable';
import { LoginBarrier } from './LoginBarrier';
import { LoginState } from './types';

describe('LoginBarrier', () => {
  it('passes through when logged in', async () => {
    const state$ = Observable.of<LoginState>({
      type: 'LOGGED_IN',
      user: 'apa',
    });
    const rendered = render(
      <LoginBarrier
        state$={state$}
        fallback={({ state }) => <div>{state.type}</div>}
      >
        Logged in!
      </LoginBarrier>,
    );
    await wait(() => rendered.getByText('Logged in!'));
  });

  it('goes to fallback when not logged in', async () => {
    const state$ = Observable.of<LoginState>({ type: 'LOGGED_OUT' });
    const rendered = render(
      <LoginBarrier
        state$={state$}
        fallback={({ state }) => <div>{state.type}</div>}
      >
        Logged in!
      </LoginBarrier>,
    );
    await wait(() => rendered.getByText('LOGGED_OUT'));
  });

  it('transitions between states', async () => {
    let subscriber: ZenObservable.SubscriptionObserver<LoginState> | undefined;
    const state$ = new Observable<LoginState>(s => {
      subscriber = s;
    });

    const rendered = render(
      <LoginBarrier
        state$={state$}
        fallback={({ state }) => <div>{state.type}</div>}
      >
        Logged in!
      </LoginBarrier>,
    );

    await wait(() => rendered.getByText('LOGGED_OUT'));
    // @ts-ignore: Object is possibly 'undefined'
    act(() => subscriber.next({ type: 'LOGGED_IN', user: 'apa' }));
    await wait(() => rendered.getByText('Logged in!'));
  });
});
