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
import {
  createOAuthAuthenticator,
  decodeOAuthState,
  encodeOAuthState,
  OAuthState,
  PassportOAuthAuthenticatorHelper,
  PassportOAuthDoneCallback,
  PassportProfile,
} from '@backstage/plugin-auth-node';
import { decodeJwt } from 'jose';
import {
  Metadata,
  StateStoreStoreCallback,
  StateStoreVerifyCallback,
  Strategy as OAuth2Strategy,
} from 'passport-oauth2';

/** @public */
export interface VMwareCloudAuthenticatorContext {
  organizationId?: string;
  providerStrategy: OAuth2Strategy;
  helper: PassportOAuthAuthenticatorHelper;
}

/** @public */
export type VMwarePassportProfile = PassportProfile & {
  organizationId?: string;
};

/**
 * VMware Cloud Authenticator to be used by `createOAuthProviderFactory`
 *
 * @public
 */
export const vmwareCloudAuthenticator = createOAuthAuthenticator<
  VMwareCloudAuthenticatorContext,
  VMwarePassportProfile
>({
  defaultProfileTransform: async input => {
    if (!input.session.idToken) {
      throw new Error(
        `Failed to parse id token and get profile info, missing token from session`,
      );
    }

    const vmwareClaims = ['email', 'given_name', 'family_name', 'context_name'];

    const identity = decodeJwt(input.session.idToken);
    const missingClaims = vmwareClaims.filter(key => !(key in identity));

    if (missingClaims.length > 0) {
      throw new Error(
        `ID token missing required claims: ${missingClaims.join(', ')}`,
      );
    }

    const typeMismatchClaims = vmwareClaims.filter(
      key => typeof identity[key] !== 'string',
    );

    if (typeMismatchClaims.length > 0) {
      throw new Error(
        `ID token claims type mismatch: ${typeMismatchClaims.join(', ')}`,
      );
    }

    // These claims were checked for presence & type
    const { email, given_name, family_name, context_name } = identity as Record<
      string,
      string
    >;

    if (context_name !== input.fullProfile.organizationId) {
      throw new Error(`ID token organizationId mismatch`);
    }

    return {
      profile: {
        displayName: `${given_name} ${family_name}`,
        email,
      },
    };
  },
  scopes: {
    required: ['openid', 'offline_access'],
  },
  initialize({ callbackUrl, config }) {
    const consoleEndpoint =
      config.getOptionalString('consoleEndpoint') ??
      'https://console.cloud.vmware.com';
    const organizationId = config.getString('organizationId');

    const clientId = config.getString('clientId');
    const clientSecret = '';
    const authorizationUrl = `${consoleEndpoint}/csp/gateway/discovery`;
    const tokenUrl = `${consoleEndpoint}/csp/gateway/am/api/auth/token`;

    if (config.has('scope')) {
      throw new Error(
        'The vmware-cloud provider no longer supports the "scope" configuration option. Please use the "additionalScopes" option instead.',
      );
    }

    const providerStrategy = new OAuth2Strategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackUrl,
        authorizationURL: authorizationUrl,
        tokenURL: tokenUrl,
        passReqToCallback: false,
        pkce: true,
        state: true,
        customHeaders: {
          Authorization: `Basic ${encodeClientCredentials(
            clientId,
            clientSecret,
          )}`,
        },
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        fullProfile: PassportProfile,
        done: PassportOAuthDoneCallback,
      ) => {
        done(undefined, { fullProfile, params, accessToken }, { refreshToken });
      },
    );

    // Both VMware & OAuth2Strategy fight over control of the state when PKCE is on, thus this hack
    const pkceSessionStore = Object.create(
      (providerStrategy as any)._stateStore,
    );
    (providerStrategy as any)._stateStore = {
      verify(req: Request, state: string, callback: StateStoreVerifyCallback) {
        pkceSessionStore.verify(
          req,
          (decodeOAuthState(state) as any).handle,
          callback,
        );
      },
      store(
        req: Request & {
          scope: string;
          state: OAuthState;
        },
        verifier: string,
        state: any,
        meta: Metadata,
        callback: StateStoreStoreCallback,
      ) {
        pkceSessionStore.store(
          req,
          verifier,
          state,
          meta,
          (err: Error, handle: string) => {
            callback(
              err,
              encodeOAuthState({
                handle,
                ...state,
                ...req.state,
              } as OAuthState),
            );
          },
        );
      },
    };

    return {
      organizationId,
      providerStrategy,
      helper: PassportOAuthAuthenticatorHelper.from(providerStrategy),
    };
  },

  async start(input, ctx) {
    return new Promise((resolve, reject) => {
      const strategy: OAuth2Strategy = Object.create(ctx.providerStrategy);

      strategy.redirect = (url: string, status?: number) => {
        const parsed = new URL(url);
        if (ctx.organizationId) {
          parsed.searchParams.set('orgId', ctx.organizationId);
        }
        resolve({ url: parsed.toString(), status: status ?? undefined });
      };
      strategy.error = (error: Error) => {
        reject(error);
      };
      strategy.authenticate(input.req, {
        scope: input.scope,
        state: decodeOAuthState(input.state),
        accessType: 'offline',
        prompt: 'consent',
      });
    });
  },

  async authenticate(input, ctx) {
    return ctx.helper.authenticate(input).then(result => ({
      ...result,
      fullProfile: {
        ...result.fullProfile,
        organizationId: ctx.organizationId,
      } as VMwarePassportProfile,
    }));
  },

  async refresh(input, ctx) {
    return ctx.helper.refresh(input).then(result => ({
      ...result,
      fullProfile: {
        ...result.fullProfile,
        organizationId: ctx.organizationId,
      } as VMwarePassportProfile,
    }));
  },
});

/** @private */
function encodeClientCredentials(
  clientID: string,
  clientSecret: string,
): string {
  return Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
}
