/*
 * Copyright 2026 The Backstage Authors
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

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getReadmeBaseUrl,
  isAllowedReadmeImage,
  resolveReadmeUrl,
} from './readmeUrls';

describe('readmeUrls', () => {
  it('builds the base address from the package name and version', () => {
    assert.equal(
      getReadmeBaseUrl('@backstage/plugin-catalog', '2.0.7'),
      'https://unpkg.com/@backstage/plugin-catalog@2.0.7/',
    );
  });

  it('resolves relative addresses against the package and leaves others alone', () => {
    const base = getReadmeBaseUrl('@backstage/plugin-catalog', '2.0.7');
    const resolve = (url: string) => resolveReadmeUrl(url, base);

    assert.equal(
      resolve('docs/screenshot.png'),
      'https://unpkg.com/@backstage/plugin-catalog@2.0.7/docs/screenshot.png',
    );
    assert.equal(
      resolve('./docs/screenshot.png'),
      'https://unpkg.com/@backstage/plugin-catalog@2.0.7/docs/screenshot.png',
    );
    assert.equal(
      resolve('/docs/screenshot.png'),
      'https://unpkg.com/@backstage/plugin-catalog@2.0.7/docs/screenshot.png',
    );
    assert.equal(
      resolve('docs/overview.md#setup'),
      'https://unpkg.com/@backstage/plugin-catalog@2.0.7/docs/overview.md#setup',
    );
    assert.equal(
      resolve('https://example.com/a.png'),
      'https://example.com/a.png',
    );
    assert.equal(resolve('//example.com/a.png'), 'https://example.com/a.png');
    assert.equal(resolve('mailto:team@example.com'), 'mailto:team@example.com');
    assert.equal(resolve('#installation'), '#installation');
    assert.equal(resolve(''), '');
  });

  it('only loads images from https on the allowed hosts', () => {
    for (const url of [
      'https://unpkg.com/@backstage/plugin-catalog@2.0.7/docs/a.png',
      'https://raw.githubusercontent.com/backstage/backstage/master/a.png',
      'https://github.com/user-attachments/assets/1234',
      'https://img.shields.io/npm/v/@backstage/plugin-catalog.svg',
    ]) {
      assert.equal(isAllowedReadmeImage(url), true, url);
    }
    for (const url of [
      'http://unpkg.com/a.png',
      'https://example.com/tracker.png',
      'https://github.com/backstage/backstage/raw/master/a.png',
      'https://unpkg.com.example.com/a.png',
      'https://unpkg.com:8443/a.png',
      'data:image/png;base64,AAAA',
      'docs/a.png',
      '',
    ]) {
      assert.equal(isAllowedReadmeImage(url), false, url);
    }
  });
});
