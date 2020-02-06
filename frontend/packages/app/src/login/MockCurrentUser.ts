import Observable from 'zen-observable';
import { LoginState } from './types';

export class MockCurrentUser {
  private listeners: ZenObservable.SubscriptionObserver<LoginState>[] = [];
  private currentUser: string | undefined = undefined;

  login(user: string) {
    this.currentUser = user;
    this.notify();
  }

  logout() {
    this.currentUser = undefined;
    this.notify();
  }

  get state(): Observable<LoginState> {
    return new Observable(subscriber => {
      this.listeners.push(subscriber);
      subscriber.next(this.getState());
      return () => {
        this.listeners = this.listeners.filter(x => x !== subscriber);
      };
    });
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach(listener => listener.next(state));
  }

  private getState(): LoginState {
    return this.currentUser
      ? { type: 'LOGGED_IN', user: this.currentUser }
      : { type: 'LOGGED_OUT' };
  }
}
