/*
 * Copyright 2020 Spotify AB
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

import * as factoryMethods from './factories';
import { AuthProviderRouteHandlers } from './types';

const providerConfig = {
  provider: 'a',
  options: {
    clientID: 'TEST',
  },
};

const providerConfigInvalid = {
  provider: 'b',
  options: {
    clientID: 'TEST',
  },
};

const authProviderRouteHandlersImpl = ({
  start: jest.fn(),
  frameHandler: jest.fn(),
  logout: jest.fn(),
  refresh: jest.fn(),
} as unknown) as AuthProviderRouteHandlers;

describe('factories', () => {
  describe('createAuthProviderRouter', () => {
    it('should create a router for auth provider', () => {
      jest
        .spyOn(factoryMethods, 'createAuthProvider')
        .mockReturnValueOnce(authProviderRouteHandlersImpl);
      const providerRouter = factoryMethods.createAuthProviderRouter(
        providerConfig,
      );
      expect(providerRouter).toBeDefined();
    });

    it('should throw error if auth provider does not exist', () => {
      expect(() => {
        factoryMethods.createAuthProviderRouter(providerConfigInvalid);
      }).toThrow("No auth provider available for 'b'");
    });
  });
});
