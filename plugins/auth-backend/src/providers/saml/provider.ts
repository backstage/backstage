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

import express from 'express';
import { SamlConfig } from 'passport-saml/lib/passport-saml/types';
import {
  Strategy as SamlStrategy,
  Profile as SamlProfile,
  VerifyWithoutRequest,
} from 'passport-saml';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  PassportDoneCallback,
} from '../../lib/passport';
import {
  AuthProviderRouteHandlers,
  AuthHandler,
  SignInResolver,
  AuthResponse,
  AuthResolverContext,
} from '../types';
import { postMessageResponse } from '../../lib/flow';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { AuthenticationError, isError } from '@backstage/errors';
import { prepareBackstageIdentityResponse } from '../prepareBackstageIdentityResponse';

/** @public */
export type SamlAuthResult = {
  fullProfile: any;
};

type Options = SamlConfig & {
  signInResolver?: SignInResolver<SamlAuthResult>;
  authHandler: AuthHandler<SamlAuthResult>;
  resolverContext: AuthResolverContext;
  appUrl: string;
};

export class SamlAuthProvider implements AuthProviderRouteHandlers {
  private readonly strategy: SamlStrategy;
  private readonly signInResolver?: SignInResolver<SamlAuthResult>;
  private readonly authHandler: AuthHandler<SamlAuthResult>;
  private readonly resolverContext: AuthResolverContext;
  private readonly appUrl: string;

  constructor(options: Options) {
    this.appUrl = options.appUrl;
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.resolverContext = options.resolverContext;
    this.strategy = new SamlStrategy({ ...options }, ((
      fullProfile: SamlProfile,
      done: PassportDoneCallback<SamlAuthResult>,
    ) => {
      // TODO: There's plenty more validation and profile handling to do here,
      //       this provider is currently only intended to validate the provider pattern
      //       for non-oauth auth flows.
      // TODO: This flow doesn't issue an identity token that can be used to validate
      //       the identity of the user in other backends, which we need in some form.
      done(undefined, { fullProfile });
    }) as VerifyWithoutRequest);
  }

  async start(req: express.Request, res: express.Response): Promise<void> {
    const { url } = await executeRedirectStrategy(req, this.strategy, {});
    res.redirect(url);
  }

  async frameHandler(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    try {
      const { result } = await executeFrameHandlerStrategy<SamlAuthResult>(
        req,
        this.strategy,
      );

      const { profile } = await this.authHandler(result, this.resolverContext);

      const response: AuthResponse<{}> = {
        profile,
        providerInfo: {},
      };

      if (this.signInResolver) {
        const signInResponse = await this.signInResolver(
          {
            result,
            profile,
          },
          this.resolverContext,
        );

        response.backstageIdentity =
          prepareBackstageIdentityResponse(signInResponse);
      }

      return postMessageResponse(res, this.appUrl, {
        type: 'authorization_response',
        response,
      });
    } catch (error) {
      const { name, message } = isError(error)
        ? error
        : new Error('Encountered invalid error'); // Being a bit safe and not forwarding the bad value
      return postMessageResponse(res, this.appUrl, {
        type: 'authorization_response',
        error: { name, message },
      });
    }
  }

  async logout(_req: express.Request, res: express.Response): Promise<void> {
    res.end();
  }
}

type SignatureAlgorithm = 'sha1' | 'sha256' | 'sha512';

/**
 * Auth provider integration for SAML auth
 *
 * @public
 */
export const saml = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<SamlAuthResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<SamlAuthResult>;
    };
  }) {
    return ({ providerId, globalConfig, config, resolverContext }) => {
      const authHandler: AuthHandler<SamlAuthResult> = options?.authHandler
        ? options.authHandler
        : async ({ fullProfile }) => ({
            profile: {
              email: fullProfile.email,
              displayName: fullProfile.displayName,
            },
          });

      return new SamlAuthProvider({
        callbackUrl: `${globalConfig.baseUrl}/${providerId}/handler/frame`,
        entryPoint: config.getString('entryPoint'),
        logoutUrl: config.getOptionalString('logoutUrl'),
        audience: config.getOptionalString('audience'),
        issuer: config.getString('issuer'),
        cert: config.getString('cert'),
        privateKey: config.getOptionalString('privateKey'),
        authnContext: config.getOptionalStringArray('authnContext'),
        identifierFormat: config.getOptionalString('identifierFormat'),
        decryptionPvk: config.getOptionalString('decryptionPvk'),
        signatureAlgorithm: config.getOptionalString('signatureAlgorithm') as
          | SignatureAlgorithm
          | undefined,
        digestAlgorithm: config.getOptionalString('digestAlgorithm'),
        acceptedClockSkewMs: config.getOptionalNumber('acceptedClockSkewMs'),

        appUrl: globalConfig.appUrl,
        authHandler,
        signInResolver: options?.signIn?.resolver,
        resolverContext,
      });
    };
  },
  resolvers: {
    /**
     * Looks up the user by matching their nameID to the entity name.
     */
    nameIdMatchingUserEntityName(): SignInResolver<SamlAuthResult> {
      return async (info, ctx) => {
        const id = info.result.fullProfile.nameID;

        if (!id) {
          throw new AuthenticationError('No nameID found in SAML response');
        }

        return ctx.signInWithCatalogUser({
          entityRef: { name: id },
        });
      };
    },
  },
});
