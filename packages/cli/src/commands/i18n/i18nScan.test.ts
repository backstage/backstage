/*
 * Copyright 2024 The Backstage Authors
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

import i18nScan from './i18nScan';
import { createMockDirectory } from '@backstage/backend-test-utils';
import fs from 'fs';

describe('i18nScan', () => {
  const mockDir = createMockDirectory();
  const translationKey = 'test.translationKey';
  const srcPath = `${mockDir.path}/Component.tsx`;
  const outPath = `${mockDir.path}/test-output.csv`;

  test('should something', () => {
    mockDir.setContent({
      'Component.tsx': `t('${translationKey}')`,
    });

    i18nScan({ src: srcPath, out: outPath });

    expect(fs.readFileSync(outPath, 'utf-8')).toEqual(translationKey);
  });
});
