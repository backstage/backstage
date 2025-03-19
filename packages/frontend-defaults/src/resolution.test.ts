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

import {
  createFrontendFeatureLoader,
  createFrontendPlugin,
  FrontendFeatureLoader,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { CreateAppFeatureLoader } from './createApp';
import { resolveAsyncFeatures } from './resolution';
import { mockApis } from '@backstage/test-utils';

describe('resolveAsyncFeatures', () => {
  it('returns empty array when no features are provided', async () => {
    const { features } = await resolveAsyncFeatures({
      config: mockApis.config(),
    });

    expect(features).toEqual([]);
  });

  it('returns expected array when features are directly provided', async () => {
    const { features } = await resolveAsyncFeatures({
      config: mockApis.config(),
      features: [
        createFrontendPlugin({
          id: 'test-feature',
          extensions: [
            PageBlueprint.make({
              params: {
                defaultPath: '/',
                loader: () => new Promise(() => {}),
              },
            }),
          ],
        }),
      ],
    });

    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'test-feature',
        version: 'v1',
        extensions: [
          {
            $$type: '@backstage/Extension',
            id: 'page:test-feature',
            version: 'v2',
            attachTo: {
              id: 'app/routes',
              input: 'routes',
            },
          },
        ],
      },
    ]);
  });

  it('supports deprecated feature loaders', async () => {
    const loader: CreateAppFeatureLoader = {
      getLoaderName() {
        return 'test-loader';
      },
      async load() {
        return {
          features: [
            createFrontendPlugin({
              id: 'test',
              extensions: [
                PageBlueprint.make({
                  params: {
                    defaultPath: '/',
                    loader: () => new Promise(() => {}),
                  },
                }),
              ],
            }),
          ],
        };
      },
    };

    const { features } = await resolveAsyncFeatures({
      config: mockApis.config(),
      features: [loader],
    });

    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'test',
        version: 'v1',
        extensions: [
          {
            $$type: '@backstage/Extension',
            id: 'page:test',
            version: 'v2',
            attachTo: {
              id: 'app/routes',
              input: 'routes',
            },
          },
        ],
      },
    ]);
  });

  it('should propagate errors thrown by deprecated feature loaders', async () => {
    const loader: CreateAppFeatureLoader = {
      getLoaderName() {
        return 'test-loader';
      },
      async load() {
        throw new TypeError('boom');
      },
    };

    await expect(() =>
      resolveAsyncFeatures({
        config: mockApis.config(),
        features: [loader],
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to read frontend features from loader 'test-loader', TypeError: boom"`,
    );
  });

  it('supports feature loaders', async () => {
    const loader: FrontendFeatureLoader = createFrontendFeatureLoader({
      async loader({ config: _ }) {
        return [
          createFrontendPlugin({
            id: 'test',
            extensions: [
              PageBlueprint.make({
                params: {
                  defaultPath: '/',
                  loader: () => new Promise(() => {}),
                },
              }),
            ],
          }),
        ];
      },
    });

    const { features } = await resolveAsyncFeatures({
      config: mockApis.config(),
      features: [loader],
    });

    expect(features).toMatchObject([
      {
        $$type: '@backstage/FrontendPlugin',
        id: 'test',
        version: 'v1',
        extensions: [
          {
            $$type: '@backstage/Extension',
            id: 'page:test',
            version: 'v2',
            attachTo: {
              id: 'app/routes',
              input: 'routes',
            },
          },
        ],
      },
    ]);
  });

  it('should propagate errors thrown by feature loaders', async () => {
    const loader: FrontendFeatureLoader = createFrontendFeatureLoader({
      async loader({ config: _ }) {
        throw new TypeError('boom');
      },
    });

    await expect(() =>
      resolveAsyncFeatures({
        config: mockApis.config(),
        features: [loader],
      }),
    ).rejects.toThrow(
      /^Failed to read frontend features from loader created at .*: TypeError: boom$/,
    );
  });
});
