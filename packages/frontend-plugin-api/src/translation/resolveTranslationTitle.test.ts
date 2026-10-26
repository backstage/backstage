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

import { TestApiRegistry } from '@backstage/test-utils';
import { createTranslationRef } from './TranslationRef';
import { resolveTranslationTitle } from './resolveTranslationTitle';

it('preserves static titles, resolves defaults without an API, and rejects invalid message selections', () => {
  const apis = TestApiRegistry.from();
  const ref = createTranslationRef({
    id: 'titles',
    messages: {
      title: 'Default',
      interpolated: 'Hello {{name}}',
      nested: '$t(interpolated)',
    },
  });
  const translation = { ref, key: 'title' };
  const invalid = { ref, key: 'missing' };
  expect(resolveTranslationTitle('Plain', undefined, apis)).toEqual({
    title: 'Plain',
  });
  expect(resolveTranslationTitle('Plain', 'Configured', apis)).toEqual({
    title: 'Configured',
  });
  expect(resolveTranslationTitle(undefined, undefined, apis)).toEqual({
    title: undefined,
  });
  const resolved = resolveTranslationTitle(translation, undefined, apis);
  expect(resolved.title).toBe('Default');
  expect(resolved.source?.getSnapshot()).toBe('Default');
  const configured = resolveTranslationTitle(translation, 'Configured', apis);
  expect(configured.title).toBe('Configured');
  expect(configured.source?.getSnapshot()).toBe('Configured');
  expect(() => resolveTranslationTitle(invalid, undefined, apis)).toThrow(
    "Unknown title translation key 'missing'",
  );
  expect(() =>
    resolveTranslationTitle({ ref, key: 'interpolated' }, undefined, apis),
  ).toThrow('must not contain interpolation or nested translations');
  expect(() =>
    resolveTranslationTitle({ ref, key: 'nested' }, undefined, apis),
  ).toThrow('must not contain interpolation or nested translations');
});
