import Observable from 'zen-observable';
import { OAuthScopes } from './types';

type RequestQueueEntry<ResultType> = {
  scopes: OAuthScopes;
  resolve: (value?: ResultType | PromiseLike<ResultType> | undefined) => void;
  reject: (reason: Error) => void;
};

export type PendingRequest<ResultType> = {
  scopes: OAuthScopes | undefined;
  resolve: (value: ResultType) => void;
  reject: (reason: Error) => void;
};

export type OAuthPendingRequestsApi<ResultType> = {
  request(scopes: OAuthScopes): Promise<ResultType>;
  resolve(scopes: OAuthScopes, result: ResultType): void;
  reject(error: Error): void;
  pending(): Observable<PendingRequest<ResultType>>;
};

export class OAuthPendingRequests<ResultType> implements OAuthPendingRequestsApi<ResultType> {
  private requests: RequestQueueEntry<ResultType>[] = [];
  private listeners: ZenObservable.SubscriptionObserver<PendingRequest<ResultType>>[] = [];

  request(scopes: OAuthScopes): Promise<ResultType> {
    return new Promise((resolve, reject) => {
      this.requests.push({ scopes, resolve, reject });

      const pending = this.getCurrentPending();
      this.listeners.forEach(listener => listener.next(pending));
    });
  }

  resolve(scopes: OAuthScopes, result: ResultType): void {
    this.requests = this.requests.filter(request => {
      if (scopes.hasScopes(request.scopes)) {
        request.resolve(result);
        return false;
      } else {
        return true;
      }
    });

    const pending = this.getCurrentPending();
    this.listeners.forEach(listener => listener.next(pending));
  }

  reject(error: Error) {
    this.requests.forEach(request => request.reject(error));
    this.requests = [];

    const pending = this.getCurrentPending();
    this.listeners.forEach(listener => listener.next(pending));
  }

  pending(): Observable<PendingRequest<ResultType>> {
    return new Observable(subscriber => {
      this.listeners.push(subscriber);
      subscriber.next(this.getCurrentPending());
      return () => {
        this.listeners = this.listeners.filter(l => l !== subscriber);
      };
    });
  }

  private getCurrentPending(): PendingRequest<ResultType> {
    const currentScopes =
      this.requests.length === 0
        ? undefined
        : this.requests.slice(1).reduce((acc, current) => acc.extend(current.scopes), this.requests[0].scopes);

    return {
      scopes: currentScopes,
      resolve: (value: ResultType) => {
        if (currentScopes) {
          this.resolve(currentScopes, value);
        }
      },
      reject: (reason: Error) => {
        if (currentScopes) {
          this.reject(reason);
        }
      },
    };
  }
}
