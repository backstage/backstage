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

import { readCliConfig } from './config';

describe('readCliConfig', () => {
  it('should return empty config for empty cli', () => {
    expect(readCliConfig({})).toEqual([]);
  });

  it('should return empty config for no matching keys', () => {
    expect(
      readCliConfig({
        test: '123',
      } as any),
    ).toEqual([]);
  });

  it('should return backend.baseUrl when backendUrl present in cli options', () => {
    expect(
      readCliConfig({
        backendUrl: 'http://localhost:3000',
      }),
    ).toEqual([
      {
        data: {
          backend: {
            baseUrl: 'http://localhost:3000',
          },
        },
        context: 'cli',
      },
    ]);
  });

  it('should return app.baseUrl when publicPath present in cli options', () => {
    expect(
      readCliConfig({
        publicPath: 'http://localhost:3000',
      }),
    ).toEqual([
      {
        data: {
          app: {
            baseUrl: 'http://localhost:3000',
          },
        },
        context: 'cli',
      },
    ]);
  });

  it('should return app.baseUrl and backend.baseUrl when publicPath and backendUrl present in cli options', () => {
    expect(
      readCliConfig({
        publicPath: 'http://localhost:3000',
        backendUrl: 'http://localhost:3000/api',
      }),
    ).toEqual([
      {
        data: {
          app: {
            baseUrl: 'http://localhost:3000',
          },
          backend: {
            baseUrl: 'http://localhost:3000/api',
          },
        },
        context: 'cli',
      },
    ]);
  });
});
