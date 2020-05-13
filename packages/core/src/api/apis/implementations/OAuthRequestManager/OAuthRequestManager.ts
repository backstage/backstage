/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  OAuthRequestApi,
  LoginPopupOptions,
  AuthRequest,
  AuthRequester,
  AuthRequesterOptions,
} from '../../definitions/oauthrequest';
import Observable from 'zen-observable';
import { OAuthPendingRequests, PendingRequest } from './OAuthPendingRequests';

/**
 * The OAuthRequestManager is an implementation of the OAuthRequestApi.
 *
 * The purpose of this class and the API is to read a stream of incoming requests
 * of OAuth access tokens from different providers with varying scope, and funnel
 * them all together into a single requests for each OAuth provider.
 */
export class OAuthRequestManager implements OAuthRequestApi {
  private readonly requests$: Observable<AuthRequest[]>;
  private readonly observers = new Set<
    ZenObservable.SubscriptionObserver<AuthRequest[]>
  >();
  private currentRequests: AuthRequest[] = [];
  private handlerCount = 0;

  constructor() {
    this.requests$ = new Observable<AuthRequest[]>((observer) => {
      observer.next(this.currentRequests);

      this.observers.add(observer);
      return () => {
        this.observers.delete(observer);
      };
    }).map((requests) => requests.filter(Boolean)); // Convert from sparse array to array of present items only
  }

  createAuthRequester<T>(options: AuthRequesterOptions<T>): AuthRequester<T> {
    const handler = new OAuthPendingRequests<T>();

    const index = this.handlerCount;
    this.handlerCount++;

    handler.pending().subscribe({
      next: (scopeRequest) => {
        const newRequests = this.currentRequests.slice();
        const request = this.makeAuthRequest(scopeRequest, options);
        if (!request) {
          delete newRequests[index];
        } else {
          newRequests[index] = request;
        }
        this.currentRequests = newRequests;
        this.observers.forEach((observer) => observer.next(newRequests));
      },
    });

    return (scopes) => {
      return handler.request(scopes);
    };
  }

  // Converts the pending request and popup options into a popup request that we can forward to subscribers.
  private makeAuthRequest(
    request: PendingRequest<any>,
    options: AuthRequesterOptions<any>,
  ): AuthRequest | undefined {
    const { scopes } = request;
    if (!scopes) {
      return undefined;
    }

    return {
      info: options.info,
      triggerAuth: async () => {
        const result = await options.authHandler(scopes);
        request.resolve(result);
      },
      reject: () => {
        const error = new Error('Login failed, rejected by user');
        error.name = 'RejectedError';
        request.reject(error);
      },
    };
  }

  handleAuthRequests(): Observable<AuthRequest[]> {
    return this.requests$;
  }

  async showLoginPopup(options: LoginPopupOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      const width = options.width || 500;
      const height = options.height || 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        options.url,
        options.name,
        `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height},top=${top},left=${left}`,
      );

      if (!popup || typeof popup.closed === 'undefined' || popup.closed) {
        reject(new Error('Failed to open auth popup.'));
        return;
      }

      const messageListener = (event: MessageEvent) => {
        if (event.source !== popup) {
          return;
        }
        if (event.origin !== options.origin) {
          return;
        }
        const { data } = event;
        if (data.type !== 'oauth-result') {
          return;
        }

        if (data.payload.error) {
          const error = new Error(data.payload.error.message);
          error.name = data.payload.error.name;
          // TODO: proper error type
          // error.extra = data.payload.error.extra;
          reject(error);
        } else {
          resolve(data.payload);
        }
        done();
      };

      const intervalId = setInterval(() => {
        if (popup.closed) {
          const error = new Error('Login failed, popup was closed');
          error.name = 'PopupClosedError';
          reject(error);
          done();
        }
      }, 100);

      function done() {
        window.removeEventListener('message', messageListener);
        clearInterval(intervalId);
      }

      window.addEventListener('message', messageListener);
    });
  }
}
