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

import { googleAuthenticator } from '@backstage/plugin-auth-backend-module-google-provider';
import { createOAuthProviderFactory } from '@backstage/plugin-auth-node';
import { google } from './provider';

jest.mock('@backstage/plugin-auth-node', () => ({
  ...jest.requireActual('@backstage/plugin-auth-node'),
  createOAuthProviderFactory: jest.fn(() => 'provider-factory'),
}));

describe('createGoogleProvider', () => {
  afterEach(() => jest.clearAllMocks());

  it('should be created', async () => {
    expect(google.create()).toBe('provider-factory');

    expect(createOAuthProviderFactory).toHaveBeenCalledWith({
      authenticator: googleAuthenticator,
    });
  });

  it('should be created with sign-in resolver', async () => {
    expect(google.create({ signIn: { resolver: jest.fn() } })).toBe(
      'provider-factory',
    );

    expect(createOAuthProviderFactory).toHaveBeenCalledWith({
      authenticator: googleAuthenticator,
      signInResolver: expect.any(Function),
    });
  });

  it('should be created with sign-in resolver and auth handler', async () => {
    expect(
      google.create({
        signIn: { resolver: jest.fn() },
        authHandler: jest.fn(),
      }),
    ).toBe('provider-factory');

    expect(createOAuthProviderFactory).toHaveBeenCalledWith({
      authenticator: googleAuthenticator,
      signInResolver: expect.any(Function),
      profileTransform: expect.any(Function),
    });
  });

  it('should have resolvers', () => {
    expect(google.resolvers).toEqual({
      emailLocalPartMatchingUserEntityName: expect.any(Function),
      emailMatchingUserEntityAnnotation: expect.any(Function),
      emailMatchingUserEntityProfileEmail: expect.any(Function),
    });
  });
});
