/*
 * Copyright 2023 The Backstage Authors
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
import { ConfigReader } from '@backstage/config';
import {
  createConfluenceVariables,
  getAuthorizationHeaderValue,
  getConfluenceConfig,
} from './helpers';

describe('createConfluenceVariables', () => {
  it('should return values for Confluence Url', () => {
    const url = 'https://confluence.example.com/display/SPACEKEY/Page+Title';
    const { spacekey, title, titleWithSpaces } = createConfluenceVariables(url);

    expect(spacekey).toEqual('SPACEKEY');
    expect(title).toEqual('Page+Title');
    expect(titleWithSpaces).toEqual('Page Title');
  });

  it('should return values for Confluence Cloud Url', () => {
    const url =
      'https://example.atlassian.net/wiki/spaces/CLOUDSPACEKEY/pages/1234567/Cloud+Page+Title';

    const { spacekey, title, titleWithSpaces } = createConfluenceVariables(url);

    expect(spacekey).toEqual('CLOUDSPACEKEY');
    expect(title).toEqual('Cloud+Page+Title');
    expect(titleWithSpaces).toEqual('Cloud Page Title');
  });
});

describe('getConfluenceConfig', () => {
  it('should return validate basic Confluence config', async () => {
    const config = new ConfigReader({
      confluence: {
        baseUrl: 'https://example.atlassian.net',
        auth: 'basic',
        token: 'fake_token',
      },
    });

    const validated = getConfluenceConfig(config);

    expect(validated).toEqual({
      baseUrl: 'https://example.atlassian.net',
      auth: 'basic',
      token: 'fake_token',
      email: undefined,
      username: undefined,
      password: undefined,
    });
  });

  it('should return validate bearer Confluence config', async () => {
    const config = new ConfigReader({
      confluence: {
        baseUrl: 'https://example.atlassian.net',
        auth: 'bearer',
        token: 'fake_token',
        email: 'example@example.atlassian.net',
      },
    });

    const validated = getConfluenceConfig(config);

    expect(validated).toEqual({
      baseUrl: 'https://example.atlassian.net',
      auth: 'bearer',
      token: 'fake_token',
      email: 'example@example.atlassian.net',
      username: undefined,
      password: undefined,
    });
  });

  it('should return validate userpass Confluence config', async () => {
    const config = new ConfigReader({
      confluence: {
        baseUrl: 'https://example.atlassian.net',
        auth: 'userpass',
        username: 'fake_user',
        password: 'fake_password',
      },
    });

    const validated = getConfluenceConfig(config);

    expect(validated).toEqual({
      baseUrl: 'https://example.atlassian.net',
      auth: 'userpass',
      token: undefined,
      email: undefined,
      username: 'fake_user',
      password: 'fake_password',
    });
  });
});

describe('getAuthorizationHeaderValue', () => {
  it('should return basic auth header value', async () => {
    const config = {
      baseUrl: 'https://example.atlassian.net',
      auth: 'basic',
      token: 'fake_token',
    };

    const authHeaderValue = getAuthorizationHeaderValue(config);

    expect(authHeaderValue).toEqual('Basic fake_token');
  });

  it('should return bearer auth header value', async () => {
    const config = {
      baseUrl: 'https://example.atlassian.net',
      auth: 'bearer',
      token: 'fake_token',
      email: 'example@example.atlassian.net',
    };

    const authHeaderValue = getAuthorizationHeaderValue(config);

    // Note: this is fake and just the encoded result
    expect(authHeaderValue).toEqual(
      'Bearer ZXhhbXBsZUBleGFtcGxlLmF0bGFzc2lhbi5uZXQ6ZmFrZV90b2tlbg==',
    );
  });

  it('should return userpass auth header value', async () => {
    const config = {
      baseUrl: 'https://example.atlassian.net',
      auth: 'userpass',
      username: 'fake_user',
      password: 'fake_password',
    };

    const authHeaderValue = getAuthorizationHeaderValue(config);

    // Note: this is fake and just the encoded result
    expect(authHeaderValue).toEqual('Basic ZmFrZV91c2VyOmZha2VfcGFzc3dvcmQ=');
  });
});
