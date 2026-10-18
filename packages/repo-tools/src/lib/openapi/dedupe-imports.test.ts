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
import {
  deduplicateImports,
  deduplicateImportsInDirectory,
} from './dedupe-imports';

const duplicated = `import { ErrorResponse } from '../models/ErrorResponse.model';

export type GetAlpha = {
  response: ErrorResponse;
};
import { ErrorResponse } from '../models/ErrorResponse.model';

export type GetBeta = {
  response: ErrorResponse;
};
`;

const deduplicated = `import { ErrorResponse } from '../models/ErrorResponse.model';

export type GetAlpha = {
  response: ErrorResponse;
};

export type GetBeta = {
  response: ErrorResponse;
};
`;

describe('deduplicateImports', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockDir.clear();
  });

  it('removes repeated import statements from a file', () => {
    mockDir.setContent({ 'Api.server.ts': duplicated });

    deduplicateImports(mockDir.resolve('Api.server.ts'));

    expect(mockDir.content()).toEqual({ 'Api.server.ts': deduplicated });
  });

  it('keeps distinct multi-line imports', () => {
    const content = `import {
  A,
  B,
} from './a';
import {
  A,
  C,
} from './a';
`;
    mockDir.setContent({ 'index.ts': content });

    deduplicateImports(mockDir.resolve('index.ts'));

    expect(mockDir.content()).toEqual({ 'index.ts': content });
  });
});

describe('deduplicateImportsInDirectory', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockDir.clear();
  });

  it('processes TypeScript files in nested directories', () => {
    mockDir.setContent({
      'index.ts': duplicated,
      apis: {
        'Api.server.ts': duplicated,
        nested: { 'Other.ts': duplicated },
      },
      docs: { 'README.md': duplicated },
    });

    deduplicateImportsInDirectory(mockDir.path);

    expect(mockDir.content()).toEqual({
      'index.ts': deduplicated,
      apis: {
        'Api.server.ts': deduplicated,
        nested: { 'Other.ts': deduplicated },
      },
      docs: { 'README.md': duplicated },
    });
  });
});
