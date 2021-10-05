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
  AuthProviderFactoryOptions,
  AuthProviderRouteHandlers,
  AuthResponse,
  SignInResolver,
} from '../types';
import express from 'express';
import fetch from 'cross-fetch';
import * as crypto from 'crypto';
import { KeyObject } from 'crypto';
import { Logger } from 'winston';
import NodeCache from 'node-cache';
import { JWT } from 'jose';
import { TokenIssuer } from '../../identity/types';
import { CatalogIdentityClient } from '../../lib/catalog';
import { Profile as PassportProfile } from 'passport';
import { makeProfileInfo } from '../../lib/passport';
import { AuthenticationError } from '@backstage/errors';

export const ALB_JWT_HEADER = 'x-amzn-oidc-data';
export const ALB_ACCESSTOKEN_HEADER = 'x-amzn-oidc-accesstoken';

type Options = {
  region: string;
  issuer?: string;
  logger: Logger;
  authHandler: AuthHandler<AwsAlbResult>;
  signInResolver: SignInResolver<AwsAlbResult>;
  tokenIssuer: TokenIssuer;
  catalogIdentityClient: CatalogIdentityClient;
};

export const getJWTHeaders = (input: string): AwsAlbHeaders => {
  const encoded = input.split('.')[0];
  return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
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
  private readonly tokenIssuer: TokenIssuer;
  private readonly catalogIdentityClient: CatalogIdentityClient;
  private readonly logger: Logger;
  private readonly keyCache: NodeCache;
  private readonly authHandler: AuthHandler<AwsAlbResult>;
  private readonly signInResolver: SignInResolver<AwsAlbResult>;

  constructor(options: Options) {
    this.region = options.region;
    this.issuer = options.issuer;
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;
    this.tokenIssuer = options.tokenIssuer;
    this.catalogIdentityClient = options.catalogIdentityClient;
    this.logger = options.logger;
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
      this.logger.error('Exception occurred during AWS ALB token refresh', e);
      res.status(401);
      res.end();
    }
  }

  start(): Promise<void> {
    return Promise.resolve(undefined);
  }

  private async getResult(req: express.Request): Promise<AwsAlbResult> {
    const jwt = req.header(ALB_JWT_HEADER);
    const accessToken = req.header(ALB_ACCESSTOKEN_HEADER);

    if (jwt === undefined) {
      throw new AuthenticationError(
        `Missing ALB OIDC header: ${ALB_JWT_HEADER}`,
      );
    }

    if (accessToken === undefined) {
      throw new AuthenticationError(
        `Missing ALB OIDC header: ${ALB_ACCESSTOKEN_HEADER}`,
      );
    }

    try {
      const headers = getJWTHeaders(jwt);
      const key = await this.getKey(headers.kid);
      const claims = JWT.verify(jwt, key) as AwsAlbClaims;

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
    const { profile } = await this.authHandler(result);
    const backstageIdentity = await this.signInResolver(
      {
        result,
        profile,
      },
      {
        tokenIssuer: this.tokenIssuer,
        catalogIdentityClient: this.catalogIdentityClient,
        logger: this.logger,
      },
    );

    return {
      providerInfo: {
        accessToken: result.accessToken,
        expiresInSeconds: result.expiresInSeconds,
      },
      backstageIdentity,
      profile,
    };
  }

  async getKey(keyId: string): Promise<KeyObject> {
    const optionalCacheKey = this.keyCache.get<KeyObject>(keyId);
    if (optionalCacheKey) {
      return crypto.createPublicKey(optionalCacheKey);
    }
    const keyText: string = await fetch(
      `https://public-keys.auth.elb.${this.region}.amazonaws.com/${keyId}`,
    ).then(response => response.text());
    const keyValue = crypto.createPublicKey(keyText);
    this.keyCache.set(keyId, keyValue.export({ format: 'pem', type: 'spki' }));
    return keyValue;
  }
}

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

export const createAwsAlbProvider = (options?: AwsAlbProviderOptions) => {
  return ({
    config,
    tokenIssuer,
    catalogApi,
    logger,
  }: AuthProviderFactoryOptions) => {
    const region = config.getString('region');
    const issuer = config.getOptionalString('iss');

    if (options?.signIn.resolver === undefined) {
      throw new Error(
        'SignInResolver is required to use this authentication provider',
      );
    }

    const catalogIdentityClient = new CatalogIdentityClient({
      catalogApi,
      tokenIssuer,
    });

    const authHandler: AuthHandler<AwsAlbResult> = options?.authHandler
      ? options.authHandler
      : async ({ fullProfile }) => ({
          profile: makeProfileInfo(fullProfile),
        });

    const signInResolver = options?.signIn.resolver;

    return new AwsAlbAuthProvider({
      region,
      issuer,
      signInResolver,
      authHandler,
      tokenIssuer,
      catalogIdentityClient,
      logger,
    });
  };
};
