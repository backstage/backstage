/*
 * Copyright 2023 The Backstage Authors
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

import { Strategy } from 'passport';
import { PassportHelpers, PassportProfile } from '../passport';
import {
  OAuthAuthenticatorAuthenticateInput,
  OAuthAuthenticatorRefreshInput,
  OAuthAuthenticatorResult,
  OAuthAuthenticatorStartInput,
  OAuthProfileTransform,
} from './types';

/** @internal */
export type PassportOAuthResult = {
  fullProfile: PassportProfile;
  params: {
    id_token?: string;
    scope: string;
    token_type?: string;
    expires_in: number;
  };
  accessToken: string;
};

/** @public */
export class PassportOAuthAuthenticatorHelper {
  static defaultProfileTransform: OAuthProfileTransform<PassportProfile> =
    async input => ({
      profile: PassportHelpers.transformProfile(
        input.fullProfile,
        input.session.idToken,
      ),
    });

  static from(strategy: Strategy) {
    return new PassportOAuthAuthenticatorHelper(strategy);
  }

  readonly #strategy: Strategy;

  private constructor(strategy: Strategy) {
    this.#strategy = strategy;
  }

  async start(
    input: OAuthAuthenticatorStartInput,
    options: Record<string, string>,
  ): Promise<{ url: string; status?: number }> {
    return PassportHelpers.executeRedirectStrategy(input.req, this.#strategy, {
      scope: input.scope,
      state: input.state,
      ...options,
    });
  }

  async authenticate(
    input: OAuthAuthenticatorAuthenticateInput,
  ): Promise<OAuthAuthenticatorResult<PassportProfile>> {
    const { result, privateInfo } =
      await PassportHelpers.executeFrameHandlerStrategy<
        PassportOAuthResult,
        { refreshToken?: string }
      >(input.req, this.#strategy);

    return {
      fullProfile: result.fullProfile as PassportProfile,
      session: {
        accessToken: result.accessToken,
        tokenType: result.params.token_type ?? 'bearer',
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in,
        idToken: result.params.id_token,
        refreshToken: privateInfo.refreshToken,
      },
    };
  }

  async refresh(
    input: OAuthAuthenticatorRefreshInput,
  ): Promise<OAuthAuthenticatorResult<PassportProfile>> {
    const result = await PassportHelpers.executeRefreshTokenStrategy(
      this.#strategy,
      input.refreshToken,
      input.scope,
    );
    const fullProfile = await this.fetchProfile(result.accessToken);
    return {
      fullProfile,
      session: {
        accessToken: result.accessToken,
        tokenType: result.params.token_type ?? 'bearer',
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in,
        idToken: result.params.id_token,
        refreshToken: result.refreshToken,
      },
    };
  }

  async fetchProfile(accessToken: string): Promise<PassportProfile> {
    const profile = await PassportHelpers.executeFetchUserProfileStrategy(
      this.#strategy,
      accessToken,
    );
    return profile;
  }
}
