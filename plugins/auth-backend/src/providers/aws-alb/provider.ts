/*
 * Copyright 2021 The Backstage Authors
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
  AuthHandler,
  AuthProviderRouteHandlers,
  AuthResolverContext,
  AuthResponse,
  SignInResolver,
} from '../types';
import express from 'express';
import fetch from 'node-fetch';
import * as crypto from 'crypto';
import { KeyObject } from 'crypto';
import NodeCache from 'node-cache';
import { JWTHeaderParameters, jwtVerify } from 'jose';
import { Profile as PassportProfile } from 'passport';
import { makeProfileInfo } from '../../lib/passport';
import { AuthenticationError } from '@backstage/errors';
import { prepareBackstageIdentityResponse } from '../prepareBackstageIdentityResponse';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';

export const ALB_JWT_HEADER = 'x-amzn-oidc-data';
export const ALB_ACCESS_TOKEN_HEADER = 'x-amzn-oidc-accesstoken';

type Options = {
  region: string;
  issuer?: string;
  authHandler: AuthHandler<AwsAlbResult>;
  signInResolver: SignInResolver<AwsAlbResult>;
  resolverContext: AuthResolverContext;
};

export type AwsAlbHeaders = {
  alg: string;
  kid: string;
  signer: string;
  iss: string;
  client: string;
  exp: number;
};

export type AwsAlbClaims = {
  sub: string;
  name: string;
  family_name: string;
  given_name: string;
  picture: string;
  email: string;
  exp: number;
  iss: string;
};

/** @public */
export type AwsAlbResult = {
  fullProfile: PassportProfile;
  expiresInSeconds?: number;
  accessToken: string;
};

export type AwsAlbProviderInfo = {
  /**
   * An access token issued for the signed in user.
   */
  accessToken: string;
  /**
   * Expiry of the access token in seconds.
   */
  expiresInSeconds?: number;
};

export type AwsAlbResponse = AuthResponse<AwsAlbProviderInfo>;

export class AwsAlbAuthProvider implements AuthProviderRouteHandlers {
  private readonly region: string;
  private readonly issuer?: string;
  private readonly resolverContext: AuthResolverContext;
  private readonly keyCache: NodeCache;
  private readonly authHandler: AuthHandler<AwsAlbResult>;
  private readonly signInResolver: SignInResolver<AwsAlbResult>;

  constructor(options: Options) {
    this.region = options.region;
    this.issuer = options.issuer;
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;
    this.resolverContext = options.resolverContext;
    this.keyCache = new NodeCache({ stdTTL: 3600 });
  }

  frameHandler(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = await this.getResult(req);
      const response = await this.handleResult(result);
      res.json(response);
    } catch (e) {
      throw new AuthenticationError(
        'Exception occurred during AWS ALB token refresh',
        e,
      );
    }
  }

  start(): Promise<void> {
    return Promise.resolve(undefined);
  }

  private async getResult(req: express.Request): Promise<AwsAlbResult> {
    const jwt = req.header(ALB_JWT_HEADER);
    const accessToken = req.header(ALB_ACCESS_TOKEN_HEADER);

    if (jwt === undefined) {
      throw new AuthenticationError(
        `Missing ALB OIDC header: ${ALB_JWT_HEADER}`,
      );
    }

    if (accessToken === undefined) {
      throw new AuthenticationError(
        `Missing ALB OIDC header: ${ALB_ACCESS_TOKEN_HEADER}`,
      );
    }

    try {
      const verifyResult = await jwtVerify(jwt, this.getKey);
      const claims = verifyResult.payload as AwsAlbClaims;

      if (this.issuer && claims.iss !== this.issuer) {
        throw new AuthenticationError('Issuer mismatch on JWT token');
      }

      const fullProfile: PassportProfile = {
        provider: 'unknown',
        id: claims.sub,
        displayName: claims.name,
        username: claims.email.split('@')[0].toLowerCase(),
        name: {
          familyName: claims.family_name,
          givenName: claims.given_name,
        },
        emails: [{ value: claims.email.toLowerCase() }],
        photos: [{ value: claims.picture }],
      };

      return {
        fullProfile,
        expiresInSeconds: claims.exp,
        accessToken,
      };
    } catch (e) {
      throw new Error(`Exception occurred during JWT processing: ${e}`);
    }
  }

  private async handleResult(result: AwsAlbResult): Promise<AwsAlbResponse> {
    const { profile } = await this.authHandler(result, this.resolverContext);
    const backstageIdentity = await this.signInResolver(
      {
        result,
        profile,
      },
      this.resolverContext,
    );

    return {
      providerInfo: {
        accessToken: result.accessToken,
        expiresInSeconds: result.expiresInSeconds,
      },
      backstageIdentity: prepareBackstageIdentityResponse(backstageIdentity),
      profile,
    };
  }

  getKey = async (header: JWTHeaderParameters): Promise<KeyObject> => {
    if (!header.kid) {
      throw new AuthenticationError('No key id was specified in header');
    }
    const optionalCacheKey = this.keyCache.get<KeyObject>(header.kid);
    if (optionalCacheKey) {
      return crypto.createPublicKey(optionalCacheKey);
    }
    const keyText: string = await fetch(
      `https://public-keys.auth.elb.${encodeURIComponent(
        this.region,
      )}.amazonaws.com/${encodeURIComponent(header.kid)}`,
    ).then(response => response.text());
    const keyValue = crypto.createPublicKey(keyText);
    this.keyCache.set(
      header.kid,
      keyValue.export({ format: 'pem', type: 'spki' }),
    );
    return keyValue;
  };
}

/**
 * @public
 * @deprecated This type has been inlined into the create method and will be removed.
 */
export type AwsAlbProviderOptions = {
  /**
   * The profile transformation function used to verify and convert the auth response
   * into the profile that will be presented to the user.
   */
  authHandler?: AuthHandler<AwsAlbResult>;

  /**
   * Configure sign-in for this provider, without it the provider can not be used to sign users in.
   */
  signIn: {
    /**
     * Maps an auth result to a Backstage identity for the user.
     */
    resolver: SignInResolver<AwsAlbResult>;
  };
};

/**
 * Auth provider integration for AWS ALB auth
 *
 * @public
 */
export const awsAlb = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<AwsAlbResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<AwsAlbResult>;
    };
  }) {
    return ({ config, resolverContext }) => {
      const region = config.getString('region');
      const issuer = config.getOptionalString('iss');

      if (options?.signIn.resolver === undefined) {
        throw new Error(
          'SignInResolver is required to use this authentication provider',
        );
      }

      const authHandler: AuthHandler<AwsAlbResult> = options?.authHandler
        ? options.authHandler
        : async ({ fullProfile }) => ({
            profile: makeProfileInfo(fullProfile),
          });

      return new AwsAlbAuthProvider({
        region,
        issuer,
        signInResolver: options?.signIn.resolver,
        authHandler,
        resolverContext,
      });
    };
  },
});

/**
 * @public
 * @deprecated Use `providers.awsAlb.create` instead
 */
export const createAwsAlbProvider = awsAlb.create;
