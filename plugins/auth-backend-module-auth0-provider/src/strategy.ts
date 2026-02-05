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

import Auth0InternalStrategy from 'passport-auth0';
import type { StateStore } from 'passport-oauth2';
import type express from 'express';
import { ConflictError } from '@backstage/errors';

/** @public */
export interface Auth0StrategyOptionsWithRequest {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  domain: string;
  passReqToCallback: true;
  store: StateStore;
  organization?: string;
}

/** @public */
export class Auth0Strategy extends Auth0InternalStrategy {
  private organization: string | undefined;

  constructor(
    options: Auth0StrategyOptionsWithRequest,
    verify: Auth0InternalStrategy.VerifyFunction,
  ) {
    const optionsWithURLs = {
      ...options,
      authorizationURL: `https://${options.domain}/authorize`,
      tokenURL: `https://${options.domain}/oauth/token`,
      userInfoURL: `https://${options.domain}/userinfo`,
      apiUrl: `https://${options.domain}/api`,
    };
    super(optionsWithURLs, verify);
    this.organization = options.organization;
  }

  authenticate(req: express.Request, options: Record<string, any>): void {
    const { organization, invitation } = req.query;

    // Throw an error if the organization in the request does not match the organization configured in the strategy
    if (
      organization &&
      this.organization &&
      organization !== this.organization
    ) {
      throw new ConflictError(
        'Organization mismatch. The organization provided in the request does not match the organization configured in the strategy.',
      );
    }

    super.authenticate(req, {
      ...options,
      ...(organization ? { organization } : {}),
      ...(invitation ? { invitation } : {}),
    });
  }

  authorizationParams(options: Record<string, any>): Record<string, any> {
    const params = super.authorizationParams(options);

    if (options.organization || this.organization) {
      params.organization = options.organization || this.organization;
    }

    if (options.invitation) {
      params.invitation = options.invitation;
    }

    return params;
  }
}
