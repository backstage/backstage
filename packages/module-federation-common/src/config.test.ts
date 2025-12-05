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

import { getConfiguredHostSharedDependencies } from './config';
import { mockApis } from '@backstage/test-utils';

describe('getConfiguredHostSharedDependencies', () => {
  it('should return empty object when parent config is undefined', () => {
    expect(getConfiguredHostSharedDependencies(mockApis.config({}))).toEqual(
      {},
    );
  });

  it('should return empty object when parent config is null', () => {
    expect(
      getConfiguredHostSharedDependencies(
        mockApis.config({
          data: {
            app: {
              moduleFederation: null,
            },
          },
        }),
      ),
    ).toEqual({});
  });

  it('should return empty object when sharedDependencies is not defined', () => {
    expect(
      getConfiguredHostSharedDependencies(
        mockApis.config({
          data: {
            app: {
              moduleFederation: {},
            },
          },
        }),
      ),
    ).toEqual({});
  });

  it('should return configured shared dependencies', () => {
    expect(
      getConfiguredHostSharedDependencies(
        mockApis.config({
          data: {
            app: {
              moduleFederation: {
                sharedDependencies: {
                  react: {
                    singleton: true,
                    eager: false,
                  },
                },
              },
            },
          },
        }),
      ),
    ).toEqual({
      react: {
        singleton: true,
        eager: false,
      },
    });
  });

  it('should return an error when the parent config is not an object', () => {
    expect(() =>
      getConfiguredHostSharedDependencies(
        mockApis.config({
          data: {
            app: {
              moduleFederation: 'not an object',
            },
          },
        }),
      ),
    ).toThrow(
      "Invalid type in config for key 'app.moduleFederation' in 'mock-config', got string, wanted object",
    );
  });
});
