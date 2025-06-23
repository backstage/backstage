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

import { MockAuthService } from './MockAuthService';
import {
  DEFAULT_MOCK_SERVICE_SUBJECT,
  DEFAULT_MOCK_USER_ENTITY_REF,
  MOCK_SERVICE_TOKEN_PREFIX,
  MOCK_USER_TOKEN_PREFIX,
  mockCredentials,
} from './mockCredentials';

describe('MockAuthService', () => {
  const auth = new MockAuthService({
    pluginId: 'test',
    disableDefaultAuthPolicy: false,
  });

  it('should reject invalid tokens', async () => {
    await expect(auth.authenticate('')).rejects.toThrow('Token is empty');
    await expect(auth.authenticate('not-a-mock-token')).rejects.toThrow(
      "Unknown mock token 'not-a-mock-token'",
    );
    await expect(auth.authenticate(MOCK_USER_TOKEN_PREFIX)).rejects.toThrow(
      'Unexpected end of JSON input',
    );
    await expect(
      auth.authenticate(`${MOCK_USER_TOKEN_PREFIX}{"invalid":json}`),
    ).rejects.toThrow('Unexpected token');
    await expect(auth.authenticate(MOCK_SERVICE_TOKEN_PREFIX)).rejects.toThrow(
      'Unexpected end of JSON input',
    );
    await expect(
      auth.authenticate(`${MOCK_SERVICE_TOKEN_PREFIX}{"invalid":json}`),
    ).rejects.toThrow('Unexpected token');
  });

  it('should authenticate mock user tokens', async () => {
    await expect(
      auth.authenticate(mockCredentials.user.token()),
    ).resolves.toEqual(mockCredentials.user());

    await expect(
      auth.authenticate(mockCredentials.user.token(), {
        allowLimitedAccess: true,
      }),
    ).resolves.toEqual(mockCredentials.user());

    await expect(
      auth.authenticate(mockCredentials.user.token()),
    ).resolves.toEqual(mockCredentials.user(DEFAULT_MOCK_USER_ENTITY_REF));

    await expect(
      auth.authenticate(mockCredentials.user.token('user:default/other')),
    ).resolves.toEqual(mockCredentials.user('user:default/other'));

    await expect(
      auth.authenticate(mockCredentials.user.invalidToken()),
    ).rejects.toThrow('User token is invalid');
  });

  it('should authenticate mock limited user tokens', async () => {
    await expect(
      auth.authenticate(mockCredentials.limitedUser.token()),
    ).rejects.toThrow('Limited user token is not allowed');
    await expect(
      auth.authenticate(mockCredentials.limitedUser.token(), {}),
    ).rejects.toThrow('Limited user token is not allowed');
    await expect(
      auth.authenticate(mockCredentials.limitedUser.token(), {
        allowLimitedAccess: false,
      }),
    ).rejects.toThrow('Limited user token is not allowed');
    await expect(
      auth.authenticate(mockCredentials.limitedUser.token(), {
        allowLimitedAccess: true,
      }),
    ).resolves.toEqual(mockCredentials.user());

    await expect(
      auth.authenticate(mockCredentials.limitedUser.token(), {
        allowLimitedAccess: true,
      }),
    ).resolves.toEqual(mockCredentials.user(DEFAULT_MOCK_USER_ENTITY_REF));

    await expect(
      auth.authenticate(
        mockCredentials.limitedUser.token('user:default/other'),
        {
          allowLimitedAccess: true,
        },
      ),
    ).resolves.toEqual(mockCredentials.user('user:default/other'));

    await expect(
      auth.authenticate(mockCredentials.limitedUser.invalidToken()),
    ).rejects.toThrow('Limited user token is invalid');
  });

  it('should authenticate mock service tokens', async () => {
    await expect(
      auth.authenticate(mockCredentials.service.token()),
    ).resolves.toEqual(mockCredentials.service());

    await expect(
      auth.authenticate(mockCredentials.service.token()),
    ).resolves.toEqual(mockCredentials.service(DEFAULT_MOCK_SERVICE_SUBJECT));

    await expect(
      auth.authenticate(mockCredentials.service.token()),
    ).resolves.toEqual(mockCredentials.service());

    await expect(
      auth.authenticate(
        mockCredentials.service.token({
          onBehalfOf: mockCredentials.service('plugin:catalog'),
          targetPluginId: 'test',
        }),
      ),
    ).resolves.toEqual(mockCredentials.service('plugin:catalog'));

    await expect(
      auth.authenticate(
        mockCredentials.service.token({
          onBehalfOf: await auth.getOwnServiceCredentials(),
          targetPluginId: 'test',
        }),
      ),
    ).resolves.toEqual(mockCredentials.service('plugin:test'));

    await expect(
      auth.authenticate(
        mockCredentials.service.token({
          onBehalfOf: await auth.getOwnServiceCredentials(),
          targetPluginId: 'other',
        }),
      ),
    ).rejects.toThrow(
      "Invalid mock token target plugin ID, got 'other' but expected 'test'",
    );

    await expect(
      auth.authenticate(mockCredentials.service.invalidToken()),
    ).rejects.toThrow('Service token is invalid');
  });

  it('should return none credentials', async () => {
    await expect(auth.getNoneCredentials()).resolves.toEqual(
      mockCredentials.none(),
    );
  });

  it('should return own service credentials', async () => {
    await expect(auth.getOwnServiceCredentials()).resolves.toEqual(
      mockCredentials.service('plugin:test'),
    );
  });

  it('should check principal types', () => {
    const none = mockCredentials.none();
    const user = mockCredentials.user();
    const service = mockCredentials.service();

    expect(auth.isPrincipal(none, 'unknown')).toBe(true);
    expect(auth.isPrincipal(user, 'unknown')).toBe(true);
    expect(auth.isPrincipal(service, 'unknown')).toBe(true);

    expect(auth.isPrincipal(none, 'none')).toBe(true);
    expect(auth.isPrincipal(user, 'none')).toBe(false);
    expect(auth.isPrincipal(service, 'none')).toBe(false);

    expect(auth.isPrincipal(none, 'user')).toBe(false);
    expect(auth.isPrincipal(user, 'user')).toBe(true);
    expect(auth.isPrincipal(service, 'user')).toBe(false);

    expect(auth.isPrincipal(none, 'service')).toBe(false);
    expect(auth.isPrincipal(user, 'service')).toBe(false);
    expect(auth.isPrincipal(service, 'service')).toBe(true);
  });

  it('should issue plugin request tokens', async () => {
    await expect(
      auth.getPluginRequestToken({
        onBehalfOf: mockCredentials.user(),
        targetPluginId: 'test',
      }),
    ).resolves.toEqual({
      token: mockCredentials.service.token({
        onBehalfOf: mockCredentials.user(),
        targetPluginId: 'test',
      }),
    });

    await expect(
      auth.getPluginRequestToken({
        onBehalfOf: mockCredentials.user('user:default/other'),
        targetPluginId: 'test',
      }),
    ).resolves.toEqual({
      token: mockCredentials.service.token({
        onBehalfOf: mockCredentials.user('user:default/other'),
        targetPluginId: 'test',
      }),
    });

    await expect(
      auth.getPluginRequestToken({
        onBehalfOf: mockCredentials.service(),
        targetPluginId: 'test',
      }),
    ).resolves.toEqual({
      token: mockCredentials.service.token({
        onBehalfOf: mockCredentials.service(),
        targetPluginId: 'test',
      }),
    });

    await expect(
      auth.getPluginRequestToken({
        onBehalfOf: mockCredentials.service('external:other'),
        targetPluginId: 'test',
      }),
    ).resolves.toEqual({
      token: mockCredentials.service.token({
        onBehalfOf: mockCredentials.service('external:other'),
        targetPluginId: 'test',
      }),
    });

    await expect(
      auth.getPluginRequestToken({
        onBehalfOf: await auth.getOwnServiceCredentials(),
        targetPluginId: 'other',
      }),
    ).resolves.toEqual({
      token: mockCredentials.service.token({
        onBehalfOf: await mockCredentials.service('plugin:test'),
        targetPluginId: 'other',
      }),
    });

    await expect(
      auth.getPluginRequestToken({
        onBehalfOf: await mockCredentials.none(),
        targetPluginId: 'other',
      }),
    ).rejects.toThrow(
      `Refused to issue service token for credential type 'none'`,
    );
  });

  it('should issue limited user tokens', async () => {
    await expect(
      auth.getLimitedUserToken(mockCredentials.user()),
    ).resolves.toEqual({
      token: mockCredentials.limitedUser.token(),
      expiresAt: expect.any(Date),
    });

    await expect(
      auth.getLimitedUserToken(mockCredentials.user('user:default/other')),
    ).resolves.toEqual({
      token: mockCredentials.limitedUser.token('user:default/other'),
      expiresAt: expect.any(Date),
    });

    await expect(
      auth.getLimitedUserToken(mockCredentials.none() as any),
    ).rejects.toThrow(
      "Refused to issue limited user token for credential type 'none'",
    );

    await expect(
      auth.getLimitedUserToken(mockCredentials.service() as any),
    ).rejects.toThrow(
      "Refused to issue limited user token for credential type 'service'",
    );
  });
});
