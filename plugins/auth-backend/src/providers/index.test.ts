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

import express from 'express';
import { makeProvider, defaultRouter } from '.';
import {
  AuthProviderRouteHandlers,
  AuthProviderConfig,
  OAuthProviderHandlers,
} from './types';
import { ProviderFactories } from './factories';

class MyOAuthProvider implements AuthProviderRouteHandlers {
  // @ts-ignore
  private readonly providerConfig: AuthProviderConfig;
  constructor(providerConfig: AuthProviderConfig) {
    this.providerConfig = providerConfig;
  }
  async start(_: express.Request, res: express.Response): Promise<any> {
    res.send('start');
  }
  async frameHandler(_: express.Request, res: express.Response): Promise<any> {
    res.send('frameHandler');
  }
  async logout(_: express.Request, res: express.Response): Promise<any> {
    res.send('logout');
  }
}

class MyOAuthProviderWithRefresh extends MyOAuthProvider {
  async refresh(_: express.Request, res: express.Response): Promise<any> {
    res.send('logout');
  }
}

class MyCustomAuthProvider implements OAuthProviderHandlers {
  start(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  handler(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  refresh(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

const providerConfig = {
  provider: 'a',
  options: {
    clientID: 'somevalue',
  },
};

const providerConfigInvalid = {
  provider: 'b',
  options: {
    clientID: 'somevalue',
  },
};

describe('makeProvider', () => {
  it('makes a provider for MyOAuthProvider', () => {
    jest
      .spyOn(ProviderFactories, 'getProviderFactory')
      .mockReturnValueOnce(MyCustomAuthProvider);
    const provider = makeProvider(providerConfig);
    expect(provider.providerId).toEqual('a');
    expect(provider.providerRouter).toBeDefined();
  });

  it('throws an error when provider implementation does not exist', () => {
    expect(() => {
      makeProvider(providerConfigInvalid);
    }).toThrow('Provider Implementation missing for : b auth provider');
  });
});

describe('defaultRouter', () => {
  it('make router for auth provider without refresh', () => {
    expect(
      defaultRouter(new MyOAuthProvider({ provider: 'a', options: {} })),
    ).toBeDefined();
  });

  it('make router for auth provider with refresh', () => {
    expect(
      defaultRouter(
        new MyOAuthProviderWithRefresh({ provider: 'b', options: {} }),
      ),
    ).toBeDefined();
  });
});
