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

import OAuth2 from './OAuth2';
import {
  OAuth2Session,
  AuthConnector,
  AuthConnectorRefreshSessionOptions,
  openLoginPopup,
  OAuth2CreateOptionsWithAuthConnector,
  OAuth2Response,
} from '../../../../index';

const scopeTransform = (x: string[]) => x;

type Options = {
  /**
   * Function used to transform an auth response into the session type.
   */
  sessionTransform?(response: any): OAuth2Session | Promise<OAuth2Session>;
};

class CustomAuthConnector implements AuthConnector<OAuth2Session> {
  private readonly sessionTransform: (response: any) => Promise<OAuth2Session>;

  constructor(options: Options) {
    const { sessionTransform = id => id } = options;

    this.sessionTransform = sessionTransform;
  }

  async createSession() {
    return await this.sessionTransform(
      await openLoginPopup({ url: 'http://my-origin', name: 'myPopup' }),
    );
  }

  async refreshSession(_?: AuthConnectorRefreshSessionOptions): Promise<any> {}

  async removeSession(): Promise<void> {}
}

describe('OAuth2CustomAuthConnector', () => {
  it('should use provided auth provider', async () => {
    const popupMock = { closed: false };

    jest.spyOn(window, 'open').mockReturnValue(popupMock as Window);

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    jest.spyOn(window, 'removeEventListener');

    const customAuthConnector = new CustomAuthConnector({
      sessionTransform(res: OAuth2Response): OAuth2Session {
        return {
          ...res,
          providerInfo: {
            idToken: res.providerInfo.idToken,
            accessToken: res.providerInfo.accessToken,
            scopes: OAuth2.normalizeScopes(
              scopeTransform,
              res.providerInfo.scope,
            ),
            expiresAt: res.providerInfo.expiresInSeconds
              ? new Date(Date.now() + res.providerInfo.expiresInSeconds * 1000)
              : undefined,
          },
        };
      },
    });

    const options: OAuth2CreateOptionsWithAuthConnector = {
      scopeTransform,
      defaultScopes: ['myScope'],
      authConnector: customAuthConnector,
    };
    const oauth2 = OAuth2.create(options);

    // so that AuthConnector calls openLoginPopup synchronously (not try to refresh the token)
    const accessToken = oauth2.getAccessToken('myScope', {
      instantPopup: true,
      optional: false,
    });

    const listener = addEventListenerSpy.mock.calls[0][1] as EventListener;

    const accessTokenValue = 'myAccessToken';
    const myResponse = {
      providerInfo: {
        accessToken: accessTokenValue,
        scope: 'myScope',
        expiresInSeconds: 900,
      },
      profile: { displayName: 'John Doe' },
    };

    // A valid sessions response
    listener({
      source: popupMock,
      origin: 'http://my-origin',
      data: {
        type: 'authorization_response',
        response: myResponse,
      },
    } as MessageEvent);

    return expect(accessToken).resolves.toBe(accessTokenValue);
  });
});
