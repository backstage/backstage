/*
 * Copyright 2025 The Backstage Authors
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

import { setupServer } from 'msw/node';
import {
  decodeOAuthState,
  encodeOAuthState,
} from '@backstage/plugin-auth-node';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { http, HttpResponse } from 'msw';
import { openshiftAuthenticator } from './authenticator';
import { ConfigReader } from '@backstage/config';
import {
  OAuthState,
  OAuthAuthenticatorStartInput,
  OAuthAuthenticatorAuthenticateInput,
} from '@backstage/plugin-auth-node';
import express from 'express';

describe('openshiftAuthenticator', () => {
  let implementation: any;
  let oauthState: OAuthState;

  const mswServer = setupServer();
  registerMswTestHooks(mswServer);

  beforeEach(() => {
    mswServer.use(
      http.post('https://openshift.test/oauth/token', () => {
        return HttpResponse.json({
          access_token: 'accessToken',
          scope: 'user:full',
          expires_in: 60 * 60 * 24,
        });
      }),
      http.get(
        'https://api.openshift.test/apis/user.openshift.io/v1/users/~',
        async () => {
          return HttpResponse.json({
            kind: 'User',
            apiVersion: 'user.openshift.io/v1',
            metadata: {
              name: 'alice',
              uid: 'ca993628-8817-4a3b-9811-be4a34c60bf4',
              resourceVersion: '1',
              creationTimestamp: '2022-01-11T13:10:45Z',
              managedFields: [],
            },
            fullName: 'Alice Adams',
            identities: ['SSO:id'],
            groups: ['system:authenticated', 'system:authenticated:oauth'],
          });
        },
      ),
    );

    implementation = openshiftAuthenticator.initialize({
      callbackUrl: 'https://backstage.test/callback',
      config: new ConfigReader({
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        authorizationUrl: 'https://openshift.test/oauth/authorize',
        tokenUrl: 'https://openshift.test/oauth/token',
        openshiftApiServerUrl: 'https://api.openshift.test',
      }),
    });

    oauthState = {
      nonce: 'nonce',
      env: 'env',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#start', () => {
    let fakeSession: Record<string, any>;
    let startRequest: OAuthAuthenticatorStartInput;

    beforeEach(() => {
      fakeSession = {};
      startRequest = {
        state: encodeOAuthState(oauthState),
        req: {
          method: 'GET',
          url: 'test',
          session: fakeSession,
        },
      } as unknown as OAuthAuthenticatorStartInput;
    });

    it('initiates authorization code grant', async () => {
      const startResponse = await openshiftAuthenticator.start(
        startRequest,
        implementation,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('response_type')).toBe('code');
    });

    it('passes client ID from config', async () => {
      const startResponse = await openshiftAuthenticator.start(
        startRequest,
        implementation,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('client_id')).toBe('clientId');
    });

    it('passes callback URL from config', async () => {
      const startResponse = await openshiftAuthenticator.start(
        startRequest,
        implementation,
      );
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('redirect_uri')).toBe(
        'https://backstage.test/callback',
      );
    });

    it('encodes OAuth state in query param', async () => {
      const startResponse = await openshiftAuthenticator.start(
        startRequest,
        implementation,
      );
      const { searchParams } = new URL(startResponse.url);
      const stateParam = searchParams.get('state');
      const decodedState = decodeOAuthState(stateParam!);

      expect(decodedState).toMatchObject(oauthState);
    });
  });

  describe('#authenticate', () => {
    let handlerRequest: OAuthAuthenticatorAuthenticateInput;

    beforeEach(() => {
      handlerRequest = {
        req: {
          method: 'GET',
          query: {
            code: 'authorization_code',
            state: encodeOAuthState(oauthState),
          },
          session: {
            'oauth2:openshift': {
              state: encodeOAuthState(oauthState),
            },
          },
        } as unknown as express.Request,
      };
    });

    it('exchanges authorization code for access token', async () => {
      const authenticatorResult = await openshiftAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );
      const accessToken = authenticatorResult.session.accessToken;

      expect(accessToken).toEqual('accessToken');
    });

    it('returns granted scope', async () => {
      const authenticatorResult = await openshiftAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );
      const responseScope = authenticatorResult.session.scope;

      expect(responseScope).toEqual('user:full');
    });

    it('returns a default session.tokentype field', async () => {
      const authenticatorResult = await openshiftAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );
      const tokenType = authenticatorResult.session.tokenType;

      expect(tokenType).toEqual('bearer');
    });

    it('returns displayName', async () => {
      const authenticatorResult = await openshiftAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );

      expect(authenticatorResult).toMatchObject({
        fullProfile: {
          displayName: 'alice',
        },
      });
    });

    it('should store access token as refresh token', async () => {
      const authenticatorResult = await openshiftAuthenticator.authenticate(
        handlerRequest,
        implementation,
      );

      expect(authenticatorResult.session.refreshToken).toBe(
        authenticatorResult.session.accessToken,
      );
    });
  });
});
