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

import { MicrosoftAuthProvider } from './provider';
import * as helpers from '../../lib/passport/PassportStrategyHelper';
import { OAuthResult } from '../../lib/oauth';
import { getVoidLogger } from '@backstage/backend-common';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { AuthResolverContext } from '../types';

jest.mock('../../lib/passport/PassportStrategyHelper', () => {
  return {
    executeFrameHandlerStrategy: jest.fn(),
  };
});

const mockFrameHandler = jest.spyOn(
  helpers,
  'executeFrameHandlerStrategy',
) as unknown as jest.MockedFunction<
  () => Promise<{ result: OAuthResult; privateInfo: any }>
>;

const mockResult = {
  result: {
    fullProfile: {
      emails: [
        {
          type: 'work',
          value: 'conrad@example.com',
        },
      ],
      displayName: 'Conrad',
      name: {
        familyName: 'Ribas',
        givenName: 'Francisco',
      },
      id: 'conrad',
      provider: 'microsoft',
      photos: [
        {
          value: 'some-data',
        },
      ],
    },
    params: {
      id_token: 'idToken',
      scope: 'scope',
      expires_in: 123,
    },
    accessToken: 'accessToken',
  },
  privateInfo: {
    refreshToken: 'wacka',
  },
};

const server = setupServer();
setupRequestMockHandlers(server);

const setupHandlers = () => {
  server.use(
    rest.get(
      'https://graph.microsoft.com/v1.0/me/photos/*',
      async (_, res, ctx) => {
        const imageBuffer = new Uint8Array([104, 111, 119, 100, 121]).buffer;
        return res(
          ctx.set('Content-Length', imageBuffer.byteLength.toString()),
          ctx.set('Content-Type', 'image/jpeg'),
          ctx.body(imageBuffer),
        );
      },
    ),
  );
};

describe('createMicrosoftProvider', () => {
  it('should auth', async () => {
    setupHandlers();

    const provider = new MicrosoftAuthProvider({
      logger: getVoidLogger(),
      resolverContext: {} as AuthResolverContext,
      authHandler: async ({ fullProfile }) => ({
        profile: {
          email: fullProfile.emails![0]!.value,
          displayName: fullProfile.displayName,
          picture: 'http://microsoft.com/lols',
        },
      }),
      clientId: 'mock',
      clientSecret: 'mock',
      callbackUrl: 'mock',
    });

    mockFrameHandler.mockResolvedValueOnce(mockResult);
    const { response } = await provider.handler({} as any);
    expect(response).toEqual({
      providerInfo: {
        accessToken: 'accessToken',
        expiresInSeconds: 123,
        idToken: 'idToken',
        scope: 'scope',
      },
      profile: {
        email: 'conrad@example.com',
        displayName: 'Conrad',
        picture: 'http://microsoft.com/lols',
      },
    });
  });

  it('should return the base64 encoded photo data of the profile', async () => {
    setupHandlers();
    const provider = new MicrosoftAuthProvider({
      logger: getVoidLogger(),
      resolverContext: {} as AuthResolverContext,
      authHandler: async ({ fullProfile }) => ({
        profile: {
          email: fullProfile.emails![0]!.value,
          displayName: fullProfile.displayName,
          picture: 'http://microsoft.com/lols',
        },
      }),
      clientId: 'mock',
      clientSecret: 'mock',
      callbackUrl: 'mock',
      // define resolver to return user `info` for photo validation
      signInResolver: async (info, _) => {
        return {
          id: 'user.name',
          token: 'token',
          info: info,
        };
      },
    });
    mockFrameHandler.mockResolvedValueOnce(mockResult);
    const { response } = await provider.handler({} as any);
    const overloadedIdentity = response.backstageIdentity as any;
    const photo = overloadedIdentity.info.result.fullProfile.photos[0];
    expect(photo.value).toEqual('data:image/jpeg;base64,aG93ZHk=');
  });
});
