/*
 * Copyright 2020 The Backstage Authors
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

import OAuth2Strategy, { InternalOAuthError } from 'passport-oauth2';
import { Profile } from 'passport';

interface ProfileResponse {
  account_id: string;
  email: string;
  name: string;
  picture: string;
  nickname: string;
}

interface AtlassianStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope: string;
}

const defaultScopes = ['offline_access', 'read:me'];

export default class AtlassianStrategy extends OAuth2Strategy {
  private readonly profileURL: string;

  constructor(
    options: AtlassianStrategyOptions,
    verify: OAuth2Strategy.VerifyFunction,
  ) {
    if (!options.scope) {
      throw new TypeError('Atlassian requires a scope option');
    }

    const scopes = options.scope.split(' ');

    const optionsWithURLs = {
      ...options,
      authorizationURL: `https://auth.atlassian.com/authorize`,
      tokenURL: `https://auth.atlassian.com/oauth/token`,
      scope: Array.from(new Set([...defaultScopes, ...scopes])),
    };

    super(optionsWithURLs, verify);
    this.profileURL = 'https://api.atlassian.com/me';
    this.name = 'atlassian';

    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  authorizationParams() {
    return {
      audience: 'api.atlassian.com',
      prompt: 'consent',
    };
  }

  userProfile(
    accessToken: string,
    done: (err?: Error | null, profile?: any) => void,
  ): void {
    this._oauth2.get(this.profileURL, accessToken, (err, body) => {
      if (err) {
        return done(
          new InternalOAuthError(
            'Failed to fetch user profile',
            err.statusCode,
          ),
        );
      }

      if (!body) {
        return done(
          new Error('Failed to fetch user profile, body cannot be empty'),
        );
      }

      try {
        const json = typeof body !== 'string' ? body.toString() : body;
        const profile = AtlassianStrategy.parse(json);
        return done(null, profile);
      } catch (e) {
        return done(new Error('Failed to parse user profile'));
      }
    });
  }

  static parse(json: string): Profile {
    const resp = JSON.parse(json) as ProfileResponse;

    return {
      id: resp.account_id,
      provider: 'atlassian',
      username: resp.nickname,
      displayName: resp.name,
      emails: [{ value: resp.email }],
      photos: [{ value: resp.picture }],
    };
  }
}
