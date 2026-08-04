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
import './testDom';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { PluginData } from '../../pluginDirectory/manifest';
import { countMinorVersionsBehind, getNpmPackageUrl } from './healthPresentation';

const plugin: PluginData = {
  title: 'Example Plugin',
  author: 'Example Maintainers',
  authorUrl: 'https://example.com',
  category: 'Tooling',
  description: 'Adds example features to Backstage.',
  documentation: 'https://example.com/docs',
  npmPackageName: '@example/plugin-example',
  addedDate: '2026-01-20',
  status: 'active',
  slug: 'example-plugin',
  isNew: false,
};

describe('getNpmPackageUrl', () => {
  it('builds the npmjs.com package URL from the manifest package name', () => {
    assert.equal(
      getNpmPackageUrl(plugin),
      'https://www.npmjs.com/package/@example/plugin-example',
    );
  });
});

describe('countMinorVersionsBehind', () => {
  it('counts minor releases between two versions with the same major', () => {
    assert.equal(countMinorVersionsBehind('1.50.0', '1.53.1'), 3);
  });

  it('returns 0 when already on the latest version', () => {
    assert.equal(countMinorVersionsBehind('1.53.1', '1.53.1'), 0);
  });

  it('clamps to 0 instead of going negative when ahead of the latest version', () => {
    assert.equal(countMinorVersionsBehind('1.54.0', '1.53.1'), 0);
  });

  it('returns undefined for unparseable versions', () => {
    assert.equal(countMinorVersionsBehind('not-a-version', '1.53.1'), undefined);
  });
});
