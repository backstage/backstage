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

import { resolve as resolvePath } from 'node:path';
import {
  createTranslationProject,
  extractTranslationRefsFromSourceFile,
} from './extractTranslations';

describe('extractTranslations', () => {
  it('extracts translation refs from the org plugin', () => {
    const project = createTranslationProject(
      resolvePath(__dirname, '../../../../../../tsconfig.json'),
    );

    const sourceFile = project.addSourceFileAtPath(
      resolvePath(__dirname, '../../../../../..', 'plugins/org/src/alpha.tsx'),
    );

    const refs = extractTranslationRefsFromSourceFile(
      sourceFile,
      '@backstage/plugin-org',
      './alpha',
    );

    expect(refs).toHaveLength(1);
    expect(refs[0]).toMatchObject({
      id: 'org',
      packageName: '@backstage/plugin-org',
      exportPath: './alpha',
      exportName: 'orgTranslationRef',
    });

    expect(refs[0].messages).toBeDefined();
    expect(Object.keys(refs[0].messages)).not.toHaveLength(0);

    // Verify some well-known keys exist without pinning exact wording
    expect(refs[0].messages).toHaveProperty(['groupProfileCard.groupNotFound']);
    expect(refs[0].messages).toHaveProperty(['membersListCard.title']);

    // Verify interpolation placeholders are preserved
    expect(refs[0].messages['membersListCard.subtitle']).toContain(
      '{{groupName}}',
    );
  });

  it('ignores non-TranslationRef exports', () => {
    const project = createTranslationProject(
      resolvePath(__dirname, '../../../../../../tsconfig.json'),
    );

    // The main entry of org plugin exports components but no translation ref
    const sourceFile = project.addSourceFileAtPath(
      resolvePath(__dirname, '../../../../../..', 'plugins/org/src/index.ts'),
    );

    const refs = extractTranslationRefsFromSourceFile(
      sourceFile,
      '@backstage/plugin-org',
      '.',
    );

    expect(refs).toHaveLength(0);
  });

  it('extracts from the test fixtures translation ref', () => {
    const project = createTranslationProject(
      resolvePath(__dirname, '../../../../../../tsconfig.json'),
    );

    const sourceFile = project.addSourceFileAtPath(
      resolvePath(
        __dirname,
        '../../../../../..',
        'packages/frontend-plugin-api/src/translation/__fixtures__/refs.ts',
      ),
    );

    const refs = extractTranslationRefsFromSourceFile(
      sourceFile,
      '@backstage/frontend-plugin-api',
      '.',
    );

    expect(refs).toHaveLength(2);

    const counting = refs.find(r => r.id === 'counting');
    expect(counting).toMatchObject({
      messages: {
        one: 'one',
        two: 'two',
        three: 'three',
      },
    });

    const fruits = refs.find(r => r.id === 'fruits');
    expect(fruits).toMatchObject({
      messages: {
        apple: 'apple',
        orange: 'orange',
      },
    });
  });
});
