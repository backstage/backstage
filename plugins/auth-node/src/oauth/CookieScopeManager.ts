/*
 * Copyright 2024 The Backstage Authors
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

import express from 'express';
import {
  OAuthAuthenticator,
  OAuthAuthenticatorResult,
  OAuthAuthenticatorScopeOptions,
} from './types';
import { OAuthCookieManager } from './OAuthCookieManager';
import { OAuthState } from './state';
import { AuthenticationError } from '@backstage/errors';
import { Config } from '@backstage/config';

function reqRes(req: express.Request): express.Response {
  const res = req.res;
  if (!res) {
    throw new Error('No response object found in request');
  }
  return res;
}

const defaultTransform: Required<OAuthAuthenticatorScopeOptions>['transform'] =
  ({ requested, granted, required, additional }) => {
    return [...requested, ...granted, ...required, ...additional];
  };

function splitScope(scope?: string): Iterable<string> {
  if (!scope) {
    return [];
  }

  return scope.split(/[\s|,]/).filter(Boolean);
}

export class CookieScopeManager {
  static create(options: {
    config?: Config;
    additionalScopes?: string[];
    authenticator: OAuthAuthenticator<any, any>;
    cookieManager: OAuthCookieManager;
  }) {
    const { authenticator, config } = options;

    const shouldPersistScopes =
      authenticator.scopes?.persist ??
      authenticator.shouldPersistScopes ??
      false;

    const configScopes =
      typeof config?.getOptional('additionalScopes') === 'string'
        ? splitScope(config.getString('additionalScopes'))
        : config?.getOptionalStringArray('additionalScopes') ?? [];

    const transform = authenticator?.scopes?.transform ?? defaultTransform;
    const additional = [...configScopes, ...(options.additionalScopes ?? [])];
    const required = authenticator?.scopes?.required ?? [];

    return new CookieScopeManager(
      (requested, granted) =>
        Array.from(
          new Set(transform({ required, additional, requested, granted })),
        ).join(' '),
      shouldPersistScopes ? options.cookieManager : undefined,
    );
  }

  private constructor(
    private readonly scopeTransform: (
      requested: Iterable<string>,
      granted: Iterable<string>,
    ) => string,
    private readonly cookieManager?: OAuthCookieManager,
  ) {}

  async start(
    req: express.Request,
  ): Promise<{ scopeState?: Partial<OAuthState>; scope: string }> {
    const requestScope = splitScope(req.query.scope?.toString());
    const grantedScope = splitScope(this.cookieManager?.getGrantedScopes(req));

    const scope = this.scopeTransform(requestScope, grantedScope);

    if (this.cookieManager) {
      // If scopes are persisted then we pass them through the state so that we
      // can set the cookie on successful auth
      return {
        scope,
        scopeState: { scope },
      };
    }
    return { scope };
  }

  async handleCallback(
    req: express.Request,
    ctx: {
      result: OAuthAuthenticatorResult<any>;
      state: OAuthState;
      origin?: string;
    },
  ): Promise<string> {
    // If we are not persisting scopes we can forward the scope from the result
    if (!this.cookieManager) {
      return Array.from(splitScope(ctx.result.session.scope)).join(' ');
    }

    const scope = ctx.state.scope;
    if (scope === undefined) {
      throw new AuthenticationError('No scope found in OAuth state');
    }

    // Store the scope that we have been granted for this session. This is useful if
    // the provider does not return granted scopes on refresh or if they are normalized.
    this.cookieManager.setGrantedScopes(reqRes(req), scope, ctx.origin);

    return scope;
  }

  async clear(req: express.Request): Promise<void> {
    if (this.cookieManager) {
      this.cookieManager.removeGrantedScopes(reqRes(req), req.get('origin'));
    }
  }

  async refresh(req: express.Request): Promise<{
    scope: string;
    scopeAlreadyGranted?: boolean;
    commit(result: OAuthAuthenticatorResult<any>): Promise<string>;
  }> {
    const requestScope = splitScope(req.query.scope?.toString());
    const grantedScope = splitScope(this.cookieManager?.getGrantedScopes(req));

    const scope = this.scopeTransform(requestScope, grantedScope);

    return {
      scope,
      scopeAlreadyGranted: this.cookieManager
        ? hasScopeBeenGranted(grantedScope, scope)
        : undefined,
      commit: async result => {
        if (this.cookieManager) {
          this.cookieManager.setGrantedScopes(
            reqRes(req),
            scope,
            req.get('origin'),
          );
          return scope;
        }

        return Array.from(splitScope(result.session.scope)).join(' ');
      },
    };
  }
}

function hasScopeBeenGranted(
  grantedScope: Iterable<string>,
  requestedScope: string,
): boolean {
  const granted = new Set(grantedScope);
  for (const requested of splitScope(requestedScope)) {
    if (!granted.has(requested)) {
      return false;
    }
  }
  return true;
}
