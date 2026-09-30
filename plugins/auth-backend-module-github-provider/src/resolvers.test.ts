/*
 * Copyright 2026 The Backstage Authors
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

import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import type {
  AuthResolverContext,
  OAuthAuthenticatorResult,
  SignInInfo,
} from '@backstage/plugin-auth-node';
import type { GithubProfile } from './authenticator';
import {
  createGithubProviderSignInResolvers,
  githubSignInResolvers,
} from './resolvers';

function createSignInInfo(
  userId: string,
): SignInInfo<OAuthAuthenticatorResult<GithubProfile>> {
  return {
    profile: {},
    result: {
      fullProfile: {
        provider: 'github',
        id: 'github-user',
        displayName: 'GitHub User',
        username: 'github-user',
        nodeId: userId,
      },
      session: {
        accessToken: 'access-token',
        scope: 'read:user',
        tokenType: 'bearer',
      },
    },
  };
}

function githubUser(name: string, userId: string) {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name,
      annotations: { 'github.com/user-id': userId },
    },
  };
}

function createResolverContext(
  entity = githubUser('github-user', 'U_kgDOAAPqnw'),
): jest.Mocked<AuthResolverContext> {
  return {
    findCatalogUser: jest.fn().mockResolvedValue({ entity }),
    signInWithCatalogUser: jest.fn().mockResolvedValue({
      token: 'catalog-user-token',
    }),
    resolveOwnershipEntityRefs: jest.fn().mockResolvedValue({
      ownershipEntityRefs: ['group:default/github-users'],
    }),
    issueToken: jest.fn().mockImplementation(async ({ claims }) => ({
      token: claims.sub,
    })),
  };
}

describe('githubSignInResolvers', () => {
  it('signs in a catalog user with an exact GitHub user ID', async () => {
    const resolver = githubSignInResolvers.userIdMatchingUserEntityAnnotation();

    await expect(
      resolver(createSignInInfo('U_kgDOAAPqnw'), createResolverContext()),
    ).resolves.toEqual({ token: 'user:default/github-user' });
  });

  it('requires GitHub user ID casing to match the catalog annotation exactly', async () => {
    const resolver = githubSignInResolvers.userIdMatchingUserEntityAnnotation();
    const context = createResolverContext(
      githubUser('wrong-case-user', 'U_kgDOAAPQNw'),
    );

    await expect(
      resolver(createSignInInfo('U_kgDOAAPqnw'), context),
    ).rejects.toThrow('GitHub user ID does not match the catalog user');
  });

  it('preserves the fallback when no catalog user is found', async () => {
    const resolver = githubSignInResolvers.userIdMatchingUserEntityAnnotation({
      dangerouslyAllowSignInWithoutUserInCatalog: true,
    });
    const context = createResolverContext();
    const error = new Error('User not found');
    error.name = 'NotFoundError';
    context.findCatalogUser.mockRejectedValue(error);

    await expect(
      resolver(createSignInInfo('U_kgDOAAPqnw'), context),
    ).resolves.toEqual({ token: 'user:default/u_kgdoaapqnw' });
    expect(context.findCatalogUser).toHaveBeenCalledTimes(1);
    expect(context.signInWithCatalogUser).not.toHaveBeenCalled();
  });
});

describe('configured GitHub sign-in resolvers', () => {
  function createResolver(items: ReturnType<typeof githubUser>[]) {
    const catalog = catalogServiceMock.mock({
      getEntities: jest.fn().mockResolvedValue({ items }),
    });
    const credentials = mockCredentials.service('auth');
    const auth = mockServices.auth.mock({
      getOwnServiceCredentials: jest.fn().mockResolvedValue(credentials),
    });

    return {
      resolver: createGithubProviderSignInResolvers({ auth, catalog })
        .userIdMatchingUserEntityAnnotation,
      catalog,
      credentials,
    };
  }

  it('selects the exact GitHub user ID from case-insensitive catalog matches', async () => {
    const { resolver, catalog, credentials } = createResolver([
      githubUser('wrong-case-user', 'U_kgDOAAPQNw'),
      githubUser('exact-user', 'U_kgDOAAPqnw'),
    ]);
    const context = createResolverContext();

    await expect(
      resolver()(createSignInInfo('U_kgDOAAPqnw'), context),
    ).resolves.toEqual({ token: 'user:default/exact-user' });
    expect(catalog.getEntities).toHaveBeenCalledWith(
      {
        filter: {
          kind: 'user',
          'metadata.annotations.github.com/user-id': 'U_kgDOAAPqnw',
        },
      },
      { credentials },
    );
  });

  it('rejects a wrong-case-only catalog match', async () => {
    const { resolver } = createResolver([
      githubUser('wrong-case-user', 'U_kgDOAAPQNw'),
    ]);

    await expect(
      resolver({ dangerouslyAllowSignInWithoutUserInCatalog: true })(
        createSignInInfo('U_kgDOAAPqnw'),
        createResolverContext(),
      ),
    ).rejects.toThrow('GitHub user ID does not match the catalog user');
  });

  it('rejects multiple exact catalog matches', async () => {
    const { resolver } = createResolver([
      githubUser('first-user', 'U_kgDOAAPqnw'),
      githubUser('second-user', 'U_kgDOAAPqnw'),
    ]);

    await expect(
      resolver()(createSignInInfo('U_kgDOAAPqnw'), createResolverContext()),
    ).rejects.toThrow('User lookup resulted in multiple exact matches');
  });

  it('preserves the fallback when there are no catalog candidates', async () => {
    const { resolver } = createResolver([]);

    await expect(
      resolver({ dangerouslyAllowSignInWithoutUserInCatalog: true })(
        createSignInInfo('U_kgDOAAPqnw'),
        createResolverContext(),
      ),
    ).resolves.toEqual({ token: 'user:default/u_kgdoaapqnw' });
  });
});
