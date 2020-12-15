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

import { LocationSpec } from '@backstage/catalog-model';
import { toAbsoluteUrl } from './LocationEntityProcessor';
import path from 'path';

describe('LocationEntityProcessor', () => {
  describe('toAbsoluteUrl', () => {
    it('handles files', () => {
      const base: LocationSpec = {
        type: 'file',
        target: `some${path.sep}path${path.sep}catalog-info.yaml`,
      };
      expect(toAbsoluteUrl(base, `.${path.sep}c`)).toBe(
        `some${path.sep}path${path.sep}c`,
      );
      expect(toAbsoluteUrl(base, `${path.sep}c`)).toBe(`${path.sep}c`);
    });

    it('handles urls', () => {
      const base: LocationSpec = {
        type: 'url',
        target: 'http://a.com/b/catalog-info.yaml',
      };
      expect(toAbsoluteUrl(base, './c/d')).toBe('http://a.com/b/c/d');
      expect(toAbsoluteUrl(base, 'c/d')).toBe('http://a.com/b/c/d');
      expect(toAbsoluteUrl(base, 'http://b.com/z')).toBe('http://b.com/z');
    });
  });
});
