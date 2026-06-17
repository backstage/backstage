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

import { TSDocTagSyntaxKind } from '@microsoft/tsdoc';
import { getTsDocConfig } from './runApiExtraction';

describe('getTsDocConfig', () => {
  it('should load the base TSDoc config from api-extractor', async () => {
    const config = await getTsDocConfig();

    expect(config).toBeDefined();
    expect(config.filePath).toContain('tsdoc-base.json');
  });

  it('should add @ignore tag definition with ModifierTag syntax', async () => {
    const config = await getTsDocConfig();

    const ignoreTag = config.tagDefinitions.find(
      tag => tag.tagName === '@ignore',
    );
    expect(ignoreTag).toBeDefined();
    expect(ignoreTag?.tagName).toBe('@ignore');
    expect(ignoreTag?.syntaxKind).toBe(TSDocTagSyntaxKind.ModifierTag);
  });

  it('should add @config tag definition with BlockTag syntax', async () => {
    const config = await getTsDocConfig();

    const configTag = config.tagDefinitions.find(
      tag => tag.tagName === '@config',
    );
    expect(configTag).toBeDefined();
    expect(configTag?.tagName).toBe('@config');
    expect(configTag?.syntaxKind).toBe(TSDocTagSyntaxKind.BlockTag);
  });

  it('should enable support for @ignore tag', async () => {
    const config = await getTsDocConfig();

    expect(config.supportForTags.get('@ignore')).toBe(true);
  });

  it('should enable support for @config tag', async () => {
    const config = await getTsDocConfig();

    expect(config.supportForTags.get('@config')).toBe(true);
  });
});
