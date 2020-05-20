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

import passport from 'passport';
import express from 'express';
import { makeProvider } from '.';
import { AuthProvider, AuthProviderRouteHandlers } from './types';

class MyAuthProvider implements AuthProvider, AuthProviderRouteHandlers {
  strategy(): passport.Strategy {
    return new passport.Strategy();
  }
  start(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<any> {
    return new Promise((res, rej) => res());
  }
  frameHandler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): express.Response<any> {
    return res.send('frameHandler');
  }
  logout(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): express.Response<any> {
    return res.send('logout');
  }
}

const providerFactories = {
  a: MyAuthProvider,
};

const providerConfig = {
  provider: 'a',
  options: {
    somekey: 'somevalue',
  },
};

const providerConfigInvalid = {
  provider: 'b',
  options: {
    somekey: 'somevalue',
  },
};

describe('makeProvider', () => {
  it('makes a provider for Myauthprovider', () => {
    const provider = makeProvider(providerFactories, providerConfig);
    expect(provider.providerId).toEqual('a');
    expect(provider.strategy).toBeDefined();
    expect(provider.providerRouter).toBeDefined();
  });

  it('throws an error when provider implementation does not exist', () => {
    expect(() => {
      makeProvider(providerFactories, providerConfigInvalid);
    }).toThrow('Provider Implementation missing for : b auth provider');
  });
});
