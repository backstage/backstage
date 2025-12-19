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

/* eslint-disable no-restricted-imports */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
/* eslint-enable no-restricted-imports */
import { globSync } from 'glob';
// @ts-ignore - @acemir/cssom doesn't have TypeScript types
import CSSOM from '@acemir/cssom';

describe('test-css-parsing', () => {
  // Find all CSS files in src/css/ and src/components/**/
  const srcDir = __dirname;
  const cssFilesInSrcCss = globSync('css/**/*.css', {
    cwd: srcDir,
    absolute: false,
  });
  const cssFilesInComponents = globSync('components/**/*.css', {
    cwd: srcDir,
    absolute: false,
  });

  const allCssFiles = [...cssFilesInSrcCss, ...cssFilesInComponents];

  // Test each CSS file individually
  test.each(allCssFiles.map(file => [file]))(
    'should parse %s with CSSOM',
    cssFile => {
      const filePath = join(srcDir, cssFile);

      expect(existsSync(filePath)).toBe(true);
      const cssContent = readFileSync(filePath, 'utf-8');
      expect(cssContent.length).toBeGreaterThan(0);

      expect(() => {
        CSSOM.parse(cssContent, {}, (message: unknown) => {
          throw new Error(`CSSOM parsing error in ${cssFile}: ${message}`);
        });
      }).not.toThrow();
    },
  );
});
