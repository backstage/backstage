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

import { GeneratedTemplate } from './TemplateGenerationService';
import { TemplateValidator } from './TemplateValidator';

const baseTemplate = (
  overrides: Partial<GeneratedTemplate['spec']> = {},
): GeneratedTemplate => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind: 'Template',
  metadata: { name: 'demo' },
  spec: {
    owner: 'group:default/p',
    type: 'service',
    steps: [
      { id: 'fetch', action: 'fetch:template', input: { url: './skel' } },
      {
        id: 'publish',
        action: 'publish:github',
        input: { repoUrl: '${{ parameters.repoUrl }}' },
      },
    ],
    ...overrides,
  },
});

describe('TemplateValidator', () => {
  const validator = new TemplateValidator();

  it('passes a well-formed template', () => {
    const result = validator.check(baseTemplate());
    expect(result).toEqual({ ok: true, warnings: [] });
  });

  it('flags step refs that point at unknown step ids', () => {
    const tpl = baseTemplate({
      steps: [
        { id: 'fetch', action: 'fetch:template', input: { url: './skel' } },
        {
          id: 'publish',
          action: 'publish:github',
          input: {
            repoUrl: '${{ steps.MISSING.output.url }}',
          },
        },
      ],
    });
    const result = validator.check(tpl);
    expect(result.ok).toBe(false);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/references unknown step 'MISSING'/),
      ]),
    );
  });

  it('flags step refs from spec.output that point at unknown step ids', () => {
    const tpl = baseTemplate({
      output: { url: '${{ steps.MISSING.output.url }}' },
    });
    const result = validator.check(tpl);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/spec.output references unknown step 'MISSING'/),
      ]),
    );
  });

  it('warns when the first step is not a fetch:* step', () => {
    const tpl = baseTemplate({
      steps: [
        {
          id: 'register',
          action: 'catalog:register',
          input: { repoContentsUrl: 'x' },
        },
      ],
    });
    const result = validator.check(tpl);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /first step uses 'catalog:register'.*fetch:\* step/,
        ),
      ]),
    );
  });

  it('warns when catalog:register precedes publish:*', () => {
    const tpl = baseTemplate({
      steps: [
        { id: 'fetch', action: 'fetch:template', input: { url: './skel' } },
        {
          id: 'register',
          action: 'catalog:register',
          input: { repoContentsUrl: 'x' },
        },
        { id: 'publish', action: 'publish:github', input: { repoUrl: 'x' } },
      ],
    });
    const result = validator.check(tpl);
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/catalog:register appears before publish:\*/),
      ]),
    );
  });
});
