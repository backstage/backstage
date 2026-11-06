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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { deduplicateImports } from './dedupe-imports';

describe('deduplicateImports', () => {
  const mockDir = createMockDirectory();

  it('removes duplicate imports that are formatted differently', () => {
    mockDir.setContent({
      'file.ts': [
        `import { A } from './a';`,
        `import {A} from "./a"`,
        `import {`,
        `  A,`,
        `} from './a';`,
        `import { B } from './b';`,
        `import type { A } from './a';`,
        `export * from './c';`,
        `export * from "./c";`,
        ``,
        `const a: A = 1;`,
        ``,
      ].join('\n'),
    });

    deduplicateImports(mockDir.resolve('file.ts'));

    expect(mockDir.content()).toEqual({
      'file.ts': [
        `import { A } from './a';`,
        `import { B } from './b';`,
        `import type { A } from './a';`,
        `export * from './c';`,
        ``,
        `const a: A = 1;`,
        ``,
      ].join('\n'),
    });
  });
});
