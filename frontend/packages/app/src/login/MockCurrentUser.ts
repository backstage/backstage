import Observable from 'zen-observable';
import { LoginState } from './types';

const LOCAL_STORAGE_KEY = 'mock_current_user';

export class MockCurrentUser {
  private listeners: ZenObservable.SubscriptionObserver<LoginState>[];
  private currentUser: string | undefined;

  constructor() {
    this.listeners = [];
    this.currentUser = undefined;
    this.loadPrevious();
  }

  login(user: string) {
    this.currentUser = user;
    this.saveCurrent();
    this.notify();
  }

  logout() {
    this.currentUser = undefined;
    this.saveCurrent();
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

  private loadPrevious() {
    const user = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (user) {
      try {
        this.currentUser = JSON.parse(user);
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }

  private saveCurrent() {
    if (!this.currentUser) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.currentUser));
    }
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
