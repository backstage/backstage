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
import passport from 'passport';
import { AuthProvider, AuthProviderRouteHandlers } from './types';
import { ProviderFactories } from './factories';

class MyAuthProvider implements AuthProvider, AuthProviderRouteHandlers {
  strategy(): passport.Strategy {
    return new passport.Strategy();
  }
  start(_: express.Request, res: express.Response): Promise<any> {
    return new Promise(resolve => {
      res.send('start');
      resolve();
    });
  }
  frameHandler(_: express.Request, res: express.Response): Promise<any> {
    return new Promise(resolve => {
      res.send('frameHandler');
      resolve();
    });
  }
  logout(_: express.Request, res: express.Response): Promise<any> {
    return new Promise(resolve => {
      res.send('logout');
      resolve();
    });
  }
}

describe('getProviderFactory', () => {
  it('makes a provider for MyAuthProvider', () => {
    jest
      .spyOn(ProviderFactories, 'getProviderFactory')
      .mockReturnValueOnce(MyAuthProvider);
    const provider = ProviderFactories.getProviderFactory('a');
    expect(provider).toBeDefined();
  });

  it('throws an error when provider implementation does not exist', () => {
    expect(() => {
      ProviderFactories.getProviderFactory('b');
    }).toThrow('Provider Implementation missing for : b auth provider');
  });
});
