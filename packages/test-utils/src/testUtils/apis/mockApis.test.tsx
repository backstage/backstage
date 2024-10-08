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

import { mockApis } from './mockApis';

describe('mockApis', () => {
  describe('analytics', () => {
    it('can create an instance and make assertions on it', () => {
      const analytics = mockApis.analytics();
      expect(
        analytics.captureEvent({
          action: 'a',
          subject: 'b',
          context: { pluginId: 'c', extension: 'd', routeRef: 'e' },
        }),
      ).toBeUndefined();
      expect(analytics.captureEvent).toHaveBeenCalledTimes(1);
    });

    it('can create a mock and make assertions on it', async () => {
      expect.assertions(3);
      const analytics = mockApis.analytics.mock({
        captureEvent: event => {
          expect(event).toEqual({
            action: 'a',
            subject: 'b',
            context: { pluginId: 'c', extension: 'd', routeRef: 'e' },
          });
        },
      });
      expect(
        analytics.captureEvent({
          action: 'a',
          subject: 'b',
          context: { pluginId: 'c', extension: 'd', routeRef: 'e' },
        }),
      ).toBeUndefined();
      expect(analytics.captureEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('config', () => {
    const data = { backend: { baseUrl: 'http://test.com' } };

    it('can create an instance', () => {
      const empty = mockApis.config();
      expect(empty.getOptional('backend.baseUrl')).toBeUndefined();

      const notEmpty = mockApis.config({ data });
      expect(notEmpty.getOptional('backend.baseUrl')).toEqual(
        'http://test.com',
      );
    });

    it('can create a mock and make assertions on it', async () => {
      const mock = mockApis.config.mock({ getString: () => 'replaced' });
      expect(mock.getString('a')).toEqual('replaced');
      expect(mock.getString).toHaveBeenCalledTimes(1);
    });
  });

  describe('identity', () => {
    it('can create an instance and make assertions on it', async () => {
      const empty = mockApis.identity();
      await expect(empty.getBackstageIdentity()).resolves.toEqual({
        type: 'user',
        userEntityRef: 'user:default/test',
        ownershipEntityRefs: ['user:default/test'],
      });
      await expect(empty.getCredentials()).resolves.toEqual({});
      await expect(empty.getProfileInfo()).resolves.toEqual({});
      await expect(empty.signOut()).resolves.toBeUndefined();
      expect(empty.getBackstageIdentity).toHaveBeenCalledTimes(1);
      expect(empty.getCredentials).toHaveBeenCalledTimes(1);
      expect(empty.getProfileInfo).toHaveBeenCalledTimes(1);
      expect(empty.signOut).toHaveBeenCalledTimes(1);

      const notEmpty = mockApis.identity({
        userEntityRef: 'a',
        ownershipEntityRefs: ['b'],
        token: 'c',
        email: 'd',
        displayName: 'e',
        picture: 'f',
      });
      await expect(notEmpty.getBackstageIdentity()).resolves.toEqual({
        type: 'user',
        userEntityRef: 'a',
        ownershipEntityRefs: ['b'],
      });
      await expect(notEmpty.getCredentials()).resolves.toEqual({ token: 'c' });
      await expect(notEmpty.getProfileInfo()).resolves.toEqual({
        email: 'd',
        displayName: 'e',
        picture: 'f',
      });
      await expect(notEmpty.signOut()).resolves.toBeUndefined();
      expect(notEmpty.getBackstageIdentity).toHaveBeenCalledTimes(1);
      expect(notEmpty.getCredentials).toHaveBeenCalledTimes(1);
      expect(notEmpty.getProfileInfo).toHaveBeenCalledTimes(1);
      expect(notEmpty.signOut).toHaveBeenCalledTimes(1);
    });

    it('can create a mock and make assertions on it', async () => {
      const empty = mockApis.identity.mock();
      expect(empty.getBackstageIdentity()).toBeUndefined();
      expect(empty.getCredentials()).toBeUndefined();
      expect(empty.getProfileInfo()).toBeUndefined();
      expect(empty.signOut()).toBeUndefined();
      expect(empty.getBackstageIdentity).toHaveBeenCalledTimes(1);
      expect(empty.getCredentials).toHaveBeenCalledTimes(1);
      expect(empty.getProfileInfo).toHaveBeenCalledTimes(1);
      expect(empty.signOut).toHaveBeenCalledTimes(1);

      const notEmpty = mockApis.identity.mock({
        getBackstageIdentity: async () => ({
          type: 'user',
          userEntityRef: 'a',
          ownershipEntityRefs: ['b'],
        }),
        getCredentials: async () => ({ token: 'c' }),
        getProfileInfo: async () => ({
          email: 'd',
          displayName: 'e',
          picture: 'f',
        }),
        signOut: async () => undefined,
      });
      await expect(notEmpty.getBackstageIdentity()).resolves.toEqual({
        type: 'user',
        userEntityRef: 'a',
        ownershipEntityRefs: ['b'],
      });
      await expect(notEmpty.getCredentials()).resolves.toEqual({ token: 'c' });
      await expect(notEmpty.getProfileInfo()).resolves.toEqual({
        email: 'd',
        displayName: 'e',
        picture: 'f',
      });
      await expect(notEmpty.signOut()).resolves.toBeUndefined();
      expect(notEmpty.getBackstageIdentity).toHaveBeenCalledTimes(1);
      expect(notEmpty.getCredentials).toHaveBeenCalledTimes(1);
      expect(notEmpty.getProfileInfo).toHaveBeenCalledTimes(1);
      expect(notEmpty.signOut).toHaveBeenCalledTimes(1);
    });
  });
});
