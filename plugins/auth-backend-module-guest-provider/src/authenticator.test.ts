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

import { guestAuthenticator } from './authenticator';
import { ConfigReader } from '@backstage/config';
import { NotAllowedError } from '@backstage/errors';
import { UserEntity } from '@backstage/catalog-model';
import { AuthResolverContext } from '@backstage/plugin-auth-node';

describe('guestAuthenticator', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (originalNodeEnv !== undefined) {
      (process.env as any).NODE_ENV = originalNodeEnv;
    } else {
      delete (process.env as any).NODE_ENV;
    }
  });

  describe('initialize', () => {
    it('should return disabled=false in development environment', () => {
      (process.env as any).NODE_ENV = 'development';
      const config = new ConfigReader({});

      const context = guestAuthenticator.initialize({ config });

      expect(context).toEqual({
        disabled: false,
        userEntityRef: 'user:development/guest',
      });
    });

    it('should return disabled=true in production without dangerouslyAllowOutsideDevelopment', () => {
      (process.env as any).NODE_ENV = 'production';
      const config = new ConfigReader({});

      const context = guestAuthenticator.initialize({ config });

      expect(context).toEqual({
        disabled: true,
        userEntityRef: 'user:development/guest',
      });
    });

    it('should return disabled=false in production with dangerouslyAllowOutsideDevelopment=true', () => {
      (process.env as any).NODE_ENV = 'production';
      const config = new ConfigReader({
        dangerouslyAllowOutsideDevelopment: true,
      });

      const context = guestAuthenticator.initialize({ config });

      expect(context).toEqual({
        disabled: false,
        userEntityRef: 'user:development/guest',
      });
    });

    it('should use custom userEntityRef from config', () => {
      (process.env as any).NODE_ENV = 'development';
      const config = new ConfigReader({
        userEntityRef: 'user:default/testuser',
      });

      const context = guestAuthenticator.initialize({ config });

      expect(context).toEqual({
        disabled: false,
        userEntityRef: 'user:default/testuser',
      });
    });
  });

  describe('authenticate', () => {
    it('should succeed when not disabled', async () => {
      const context = {
        disabled: false,
        userEntityRef: 'user:development/guest',
      };

      const result = await guestAuthenticator.authenticate(
        { req: {} as any },
        context,
      );

      expect(result).toEqual({
        result: { userEntityRef: 'user:development/guest' },
      });
    });

    it('should throw NotAllowedError when disabled', async () => {
      const context = {
        disabled: true,
        userEntityRef: 'user:development/guest',
      };

      await expect(
        guestAuthenticator.authenticate({ req: {} as any }, context),
      ).rejects.toThrow(NotAllowedError);
    });

    it('should throw NotAllowedError with correct message when disabled', async () => {
      const context = {
        disabled: true,
        userEntityRef: 'user:development/guest',
      };

      await expect(
        guestAuthenticator.authenticate({ req: {} as any }, context),
      ).rejects.toThrow(
        "The guest provider cannot be used outside of a development environment unless 'auth.providers.guest.dangerouslyAllowOutsideDevelopment' is enabled",
      );
    });
  });

  describe('defaultProfileTransform', () => {
    const mockUserEntity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'guest',
        namespace: 'development',
      },
      spec: {
        profile: {
          displayName: 'Guest User',
          email: 'guest@example.com',
          picture: 'https://example.com/avatar.jpg',
        },
        memberOf: [],
      },
    };

    const mockAuthResolverContext: Partial<AuthResolverContext> = {
      findCatalogUser: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return profile from catalog user when found', async () => {
      (mockAuthResolverContext.findCatalogUser as jest.Mock).mockResolvedValue({
        entity: mockUserEntity,
      });

      const result = { userEntityRef: 'user:development/guest' };

      const profile = await guestAuthenticator.defaultProfileTransform(
        result,
        mockAuthResolverContext as AuthResolverContext,
      );

      expect(profile).toEqual({
        profile: {
          displayName: 'Guest User',
          email: 'guest@example.com',
          picture: 'https://example.com/avatar.jpg',
        },
      });

      expect(mockAuthResolverContext.findCatalogUser).toHaveBeenCalledWith({
        entityRef: 'user:development/guest',
      });
    });

    it('should return profile with partial data when some fields are missing', async () => {
      const partialUserEntity: UserEntity = {
        ...mockUserEntity,
        spec: {
          profile: {
            displayName: 'Guest User',
            // email and picture are missing
          },
          memberOf: [],
        },
      };

      (mockAuthResolverContext.findCatalogUser as jest.Mock).mockResolvedValue({
        entity: partialUserEntity,
      });

      const result = { userEntityRef: 'user:development/guest' };

      const profile = await guestAuthenticator.defaultProfileTransform(
        result,
        mockAuthResolverContext as AuthResolverContext,
      );

      expect(profile).toEqual({
        profile: {
          displayName: 'Guest User',
          email: undefined,
          picture: undefined,
        },
      });
    });

    it('should return empty profile when catalog user is not found', async () => {
      (mockAuthResolverContext.findCatalogUser as jest.Mock).mockRejectedValue(
        new Error('User not found'),
      );

      const result = { userEntityRef: 'user:development/guest' };

      const profile = await guestAuthenticator.defaultProfileTransform(
        result,
        mockAuthResolverContext as AuthResolverContext,
      );

      expect(profile).toEqual({
        profile: {},
      });
    });

    it('should use default userEntityRef when not provided in result', async () => {
      (mockAuthResolverContext.findCatalogUser as jest.Mock).mockResolvedValue({
        entity: mockUserEntity,
      });

      const result = {}; // No userEntityRef provided

      await guestAuthenticator.defaultProfileTransform(
        result,
        mockAuthResolverContext as AuthResolverContext,
      );

      expect(mockAuthResolverContext.findCatalogUser).toHaveBeenCalledWith({
        entityRef: 'user:development/guest',
      });
    });

    it('should handle catalog user with no profile spec', async () => {
      const userEntityWithoutProfile: UserEntity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'guest',
          namespace: 'development',
        },
        spec: {
          memberOf: [],
        },
      };

      (mockAuthResolverContext.findCatalogUser as jest.Mock).mockResolvedValue({
        entity: userEntityWithoutProfile,
      });

      const result = { userEntityRef: 'user:development/guest' };

      const profile = await guestAuthenticator.defaultProfileTransform(
        result,
        mockAuthResolverContext as AuthResolverContext,
      );

      expect(profile).toEqual({
        profile: {
          displayName: undefined,
          email: undefined,
          picture: undefined,
        },
      });
    });

    it('should use custom userEntityRef from result', async () => {
      (mockAuthResolverContext.findCatalogUser as jest.Mock).mockResolvedValue({
        entity: mockUserEntity,
      });

      const result = { userEntityRef: 'user:custom/testuser' };

      await guestAuthenticator.defaultProfileTransform(
        result,
        mockAuthResolverContext as AuthResolverContext,
      );

      expect(mockAuthResolverContext.findCatalogUser).toHaveBeenCalledWith({
        entityRef: 'user:custom/testuser',
      });
    });
  });
});
