/*
 * Copyright 2021 Spotify AB
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
  AuthProviderFactoryOptions,
  AuthProviderRouteHandlers,
} from '../types';
import { TokenIssuer } from '../../identity';
import express from 'express';
import r2 from 'r2';
import * as crypto from 'crypto';
import { KeyObject } from 'crypto';
import { Logger } from 'winston';
import jwtVerify from 'jose/jwt/verify';
import { CatalogApi } from '@backstage/catalog-client';
import { UserEntityV1alpha1 } from '@backstage/catalog-model';

const ALB_JWT_HEADER = 'x-amzn-oidc-data';
/**
 * A callback function that receives a verified JWT and returns a UserEntity
 *  @param {payload} The verified JWT payload
 */
type IdentityResolutionCallback = (
  payload: object,
  catalogApi: CatalogApi,
) => Promise<UserEntityV1alpha1>;
type AwsAlbAuthProviderOptions = {
  region: string;
  issuer: string;
  identityResolutionCallback: IdentityResolutionCallback;
};
export const getJWTHeaders = (input: string) => {
  const encoded = input.split('.')[0];
  return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
};

export class AwsAlbAuthProvider implements AuthProviderRouteHandlers {
  private logger: Logger;
  private readonly catalogClient: CatalogApi;
  private tokenIssuer: TokenIssuer;
  private options: AwsAlbAuthProviderOptions;
  private readonly keyCache: { [key: string]: KeyObject };

  constructor(
    logger: Logger,
    catalogClient: CatalogApi,
    tokenIssuer: TokenIssuer,
    options: AwsAlbAuthProviderOptions,
  ) {
    this.logger = logger;
    this.catalogClient = catalogClient;
    this.tokenIssuer = tokenIssuer;
    this.options = options;
    this.keyCache = {};
  }
  frameHandler(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    const jwt = req.header(ALB_JWT_HEADER);
    if (jwt !== undefined) {
      try {
        const headers = getJWTHeaders(jwt);
        const key = await this.getKey(headers.kid);
        const verifiedToken = await jwtVerify(jwt, key, {});

        if (
          this.options.issuer !== '' &&
          headers.issuer !== this.options.issuer
        ) {
          throw new Error('issuer mismatch on JWT');
        }

        const resolvedEntity = await this.options.identityResolutionCallback(
          verifiedToken.payload,
          this.catalogClient,
        );
        res.send({
          providerInfo: {},
          profile: resolvedEntity?.spec?.profile,
          backstageIdentity: {
            id: resolvedEntity?.metadata?.name,
            idToken: await this.tokenIssuer.issueToken({
              claims: { sub: resolvedEntity?.metadata?.name },
            }),
          },
        });
      } catch (e) {
        this.logger.error('exception occurred during JWT processing', e);
        res.send(401);
      }
    } else {
      res.send(401);
    }
  }

  start(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async getKey(keyId: string): Promise<KeyObject> {
    if (this.keyCache[keyId]) {
      return this.keyCache[keyId];
    }
    const keyText: string = await r2(
      `https://public-keys.auth.elb.${this.options.region}.amazonaws.com/${keyId}`,
    ).text;
    const keyValue = crypto.createPublicKey(keyText);
    this.keyCache[keyId] = keyValue;
    return keyValue;
  }
}

export const createAwsAlbProvider = (
  { logger, catalogApi, tokenIssuer, config }: AuthProviderFactoryOptions,
  identityResolver: IdentityResolutionCallback,
) => {
  const region = config.getString('region');
  const issuer = config.getString('iss');
  return new AwsAlbAuthProvider(logger, catalogApi, tokenIssuer, {
    region,
    issuer,
    identityResolutionCallback: identityResolver,
  });
};
