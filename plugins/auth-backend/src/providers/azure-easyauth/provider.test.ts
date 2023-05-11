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

import { AuthHandler, AuthResolverContext } from '../types';
import { makeProfileInfo } from '../../lib/passport';
import {
  easyAuth,
  ACCESS_TOKEN_HEADER,
  EasyAuthAuthProvider,
  EasyAuthResult,
  ID_TOKEN_HEADER,
} from './provider';
import { Request, Response } from 'express';
import { SignJWT, JWTPayload, errors as JoseErrors } from 'jose';
import { randomBytes } from 'crypto';

const jwtSecret = randomBytes(48);

async function buildJwt(claims: JWTPayload) {
  return await new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(jwtSecret);
}

const backstageIdentityTokenClaims = {
  sub: 'user:default/alice',
  ent: ['user:default/alice'],
};

describe('EasyAuthAuthProvider', () => {
  const authHandler: AuthHandler<EasyAuthResult> = async ({ fullProfile }) => ({
    profile: makeProfileInfo(fullProfile),
  });
  const resolverContext: AuthResolverContext = {} as AuthResolverContext;
  async function signInResolver() {
    return {
      id: 'user.name',
      token: await buildJwt(backstageIdentityTokenClaims),
    };
  }

  const provider = new EasyAuthAuthProvider({
    authHandler,
    signInResolver,
    resolverContext,
  });

  function mockRequest(headers?: Record<string, string>) {
    return {
      header: (name: string) => headers?.[name],
    } as unknown as Request;
  }

  describe('should succeed when', () => {
    it('id_token is valid and identity is resolved successfully', async () => {
      const claims = {
        ver: '2.0',
        oid: 'c43063d4-0650-4f3e-ba6b-307473d24dfd',
        name: 'Alice Bob',
        email: 'alice@bob.com',
        preferred_username: 'Another name',
      };
      const response = {
        end: jest.fn(),
        header: () => jest.fn(),
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      const request = mockRequest({
        [ID_TOKEN_HEADER]: await buildJwt(claims),
      });
      await provider.refresh(request, response);

      expect(response.json).toHaveBeenCalledWith({
        backstageIdentity: {
          id: 'user.name',
          token: await buildJwt(backstageIdentityTokenClaims),
          identity: {
            ownershipEntityRefs: ['user:default/alice'],
            type: 'user',
            userEntityRef: 'user:default/alice',
          },
        },
        profile: {
          displayName: claims.name,
          email: claims.email,
          picture: undefined,
        },
        providerInfo: {
          accessToken: undefined,
        },
      });
    });

    it('valid id_token and access_token provided', async () => {
      const claims = {
        ver: '2.0',
        oid: 'c43063d4-0650-4f3e-ba6b-307473d24dfd',
        name: 'Alice Bob',
        email: 'alice@bob.com',
        preferred_username: 'Another name',
      };
      const response = {
        end: jest.fn(),
        header: () => jest.fn(),
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      const request = mockRequest({
        [ID_TOKEN_HEADER]: await buildJwt(claims),
        [ACCESS_TOKEN_HEADER]: 'ACCESS_TOKEN',
      });
      await provider.refresh(request, response);

      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          providerInfo: {
            accessToken: 'ACCESS_TOKEN',
          },
        }),
      );
    });
  });

  describe('should fail when', () => {
    const response = {} as Response;

    it('Access token is missing', async () => {
      const request = mockRequest();

      await expect(provider.refresh(request, response)).rejects.toThrow(
        'Missing x-ms-token-aad-id-token header',
      );
    });

    it('id token is invalid', async () => {
      const request = mockRequest({
        [ID_TOKEN_HEADER]: 'not-a-jwt',
      });

      await expect(provider.refresh(request, response)).rejects.toThrow(
        JoseErrors.JWTInvalid,
      );
    });

    it('id token is v1', async () => {
      const request = mockRequest({
        [ID_TOKEN_HEADER]: await buildJwt({ ver: '1.0' }),
      });

      await expect(provider.refresh(request, response)).rejects.toThrow(
        'id_token is not version 2.0',
      );
    });

    it('SignInResolver rejects', async () => {
      const request = mockRequest({
        [ID_TOKEN_HEADER]: await buildJwt({ ver: '2.0' }),
      });

      const rejectProvider = new EasyAuthAuthProvider({
        authHandler,
        signInResolver: async () => {
          throw new Error('REJECTED!!');
        },
        resolverContext,
      });

      await expect(rejectProvider.refresh(request, response)).rejects.toThrow(
        'REJECTED!!',
      );
    });

    it('AuthHanlder rejects', async () => {
      const request = mockRequest({
        [ID_TOKEN_HEADER]: await buildJwt({ ver: '2.0' }),
      });

      const rejectProvider = new EasyAuthAuthProvider({
        authHandler: async () => {
          throw new Error('OBJECTION!!');
        },
        signInResolver,
        resolverContext,
      });

      await expect(rejectProvider.refresh(request, response)).rejects.toThrow(
        'OBJECTION!!',
      );
    });
  });
});

describe('easyAuth factory', () => {
  const env = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it('should fail when run outside of Azure App Services', async () => {
    const factory = easyAuth.create({
      signIn: {
        resolver: jest.fn(),
      },
    });

    expect(() => factory({} as any)).toThrow(
      'Backstage is not running on Azure App Services',
    );
  });

  it('should fail when Azure App Services Auth is not enabled', async () => {
    process.env.WEBSITE_SKU = 'Standard';
    process.env.WEBSITE_AUTH_ENABLED = 'False';

    const factory = easyAuth.create({
      signIn: {
        resolver: jest.fn(),
      },
    });

    expect(() => factory({} as any)).toThrow(
      'Azure App Services does not have authentication enabled',
    );
  });

  it('should fail when Azure App Services Auth is not AAD', async () => {
    process.env.WEBSITE_SKU = 'Standard';
    process.env.WEBSITE_AUTH_ENABLED = 'True';
    process.env.WEBSITE_AUTH_DEFAULT_PROVIDER = 'Facebook';

    const factory = easyAuth.create({
      signIn: {
        resolver: jest.fn(),
      },
    });

    expect(() => factory({} as any)).toThrow(
      'Authentication provider is not Azure Active Directory',
    );
  });

  it('should fail when Token Store not enabled', async () => {
    process.env.WEBSITE_SKU = 'Standard';
    process.env.WEBSITE_AUTH_ENABLED = 'True';
    process.env.WEBSITE_AUTH_DEFAULT_PROVIDER = 'AzureActiveDirectory';
    process.env.WEBSITE_AUTH_TOKEN_STORE = 'False';

    const factory = easyAuth.create({
      signIn: {
        resolver: jest.fn(),
      },
    });

    expect(() => factory({} as any)).toThrow('Token Store is not enabled');
  });

  it('should return EasyAuthAuthProvider when running in Azure App Services with AAD Auth', async () => {
    process.env.WEBSITE_SKU = 'Standard';
    process.env.WEBSITE_AUTH_ENABLED = 'True';
    process.env.WEBSITE_AUTH_DEFAULT_PROVIDER = 'AzureActiveDirectory';
    process.env.WEBSITE_AUTH_TOKEN_STORE = 'True';

    const factory = easyAuth.create({
      signIn: {
        resolver: jest.fn(),
      },
    });

    expect(factory({} as any)).toBeInstanceOf(EasyAuthAuthProvider);
  });
});
