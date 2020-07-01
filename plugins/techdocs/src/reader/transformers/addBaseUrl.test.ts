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

import { createTestShadowDom, FIXTURES, getSample } from '../../test-utils';
import { addBaseUrl } from '../transformers';

const DOC_STORAGE_URL = 'https://example-host.storage.googleapis.com';

describe('addBaseUrl', () => {
  it('contains relative paths', () => {
    const shadowDom = createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE);

    expect(getSample(shadowDom, 'img', 'src')).toEqual([
      'img/win-py-install.png',
      'img/initial-layout.png',
    ]);
    expect(getSample(shadowDom, 'link', 'href')).toEqual([
      'https://www.mkdocs.org/',
      'assets/images/favicon.png',
    ]);
    expect(getSample(shadowDom, 'script', 'src')).toEqual([
      'https://www.google-analytics.com/analytics.js',
      'assets/javascripts/vendor.d710d30a.min.js',
    ]);
  });

  it('contains transformed absolute paths', () => {
    const shadowDom = createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE, {
      transformers: [
        addBaseUrl({
          docStorageURL: DOC_STORAGE_URL,
          componentId: 'example-docs',
          path: '',
        }),
      ],
    });

    expect(getSample(shadowDom, 'img', 'src')).toEqual([
      'https://example-host.storage.googleapis.com/example-docs/img/win-py-install.png',
      'https://example-host.storage.googleapis.com/example-docs/img/initial-layout.png',
    ]);
    expect(getSample(shadowDom, 'link', 'href')).toEqual([
      'https://www.mkdocs.org/',
      'https://example-host.storage.googleapis.com/example-docs/assets/images/favicon.png',
    ]);
    expect(getSample(shadowDom, 'script', 'src')).toEqual([
      'https://www.google-analytics.com/analytics.js',
      'https://example-host.storage.googleapis.com/example-docs/assets/javascripts/vendor.d710d30a.min.js',
    ]);
  });

  it('includes path option without slash', () => {
    const shadowDom = createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE, {
      transformers: [
        addBaseUrl({
          docStorageURL: DOC_STORAGE_URL,
          componentId: 'example-docs',
          path: 'examplepath',
        }),
      ],
    });

    expect(getSample(shadowDom, 'img', 'src')).toEqual([
      'https://example-host.storage.googleapis.com/example-docs/examplepath/img/win-py-install.png',
      'https://example-host.storage.googleapis.com/example-docs/examplepath/img/initial-layout.png',
    ]);
    expect(getSample(shadowDom, 'link', 'href')).toEqual([
      'https://www.mkdocs.org/',
      'https://example-host.storage.googleapis.com/example-docs/examplepath/assets/images/favicon.png',
    ]);
    expect(getSample(shadowDom, 'script', 'src')).toEqual([
      'https://www.google-analytics.com/analytics.js',
      'https://example-host.storage.googleapis.com/example-docs/examplepath/assets/javascripts/vendor.d710d30a.min.js',
    ]);
  });

  it('includes path option with slash', () => {
    const shadowDom = createTestShadowDom(FIXTURES.FIXTURE_STANDARD_PAGE, {
      transformers: [
        addBaseUrl({
          docStorageURL: DOC_STORAGE_URL,
          componentId: 'example-docs',
          path: 'examplepath/',
        }),
      ],
    });

    expect(getSample(shadowDom, 'img', 'src')).toEqual([
      'https://example-host.storage.googleapis.com/example-docs/examplepath/img/win-py-install.png',
      'https://example-host.storage.googleapis.com/example-docs/examplepath/img/initial-layout.png',
    ]);
    expect(getSample(shadowDom, 'link', 'href')).toEqual([
      'https://www.mkdocs.org/',
      'https://example-host.storage.googleapis.com/example-docs/examplepath/assets/images/favicon.png',
    ]);
    expect(getSample(shadowDom, 'script', 'src')).toEqual([
      'https://www.google-analytics.com/analytics.js',
      'https://example-host.storage.googleapis.com/example-docs/examplepath/assets/javascripts/vendor.d710d30a.min.js',
    ]);
  });
});
