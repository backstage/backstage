/*
 * Copyright 2020 The Backstage Authors
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

import { createApiRef } from './ApiRef';
import type { ApiRef as ApiRefType } from './types';

describe('ApiRef', () => {
  it('should be created with config', () => {
    const ref = createApiRef({ id: 'abc' });
    expect(ref.$$type).toBe('@backstage/ApiRef');
    expect(ref.id).toBe('abc');
    expect(String(ref)).toBe('apiRef{abc}');
    expect(ref.T).toBeNull();
  });

  it('should not accept pluginId with deprecated config form', () => {
    expect(createApiRef<string>({ id: 'abc' }).id).toBe('abc');

    // @ts-expect-error pluginId is only supported through .with(...)
    createApiRef<string>({ id: 'abc', pluginId: 'test' });
  });

  it('should keep the deprecated config form id wide', () => {
    const ref = createApiRef<string>({ id: 'abc' });
    const wideRef: ApiRefType<string> = ref;
    expect(wideRef.id).toBe('abc');

    // @ts-expect-error deprecated config form should not infer literal ids
    const literalRef: ApiRefType<string, 'abc'> = ref;
    expect(literalRef.id).toBe('abc');
  });

  it('should be created with builder pattern', () => {
    const ref = createApiRef<string>().with({ id: 'abc', pluginId: 'test' });
    expect(ref.$$type).toBe('@backstage/ApiRef');
    expect(ref.id).toBe('abc');
    expect(String(ref)).toBe('apiRef{abc}');
    expect(ref.T).toBeNull();
    expect((ref as { pluginId?: string }).pluginId).toBe('test');

    // @ts-expect-error pluginId is internal runtime metadata
    expect(ref.pluginId).toBe('test');
  });

  it('should infer literal ids with builder pattern', () => {
    const ref = createApiRef<string>().with({ id: 'abc', pluginId: 'test' });
    const literalRef: ApiRefType<string, 'abc'> = ref;
    expect(literalRef.id).toBe('abc');

    // @ts-expect-error builder pattern should preserve literal ids
    const wrongLiteralRef: ApiRefType<string, 'def'> = ref;
    expect(wrongLiteralRef.id).toBe('abc');
  });

  it('should validate each API ID component using the plugin ID format', () => {
    for (const id of [
      'a',
      'abc',
      'ab-c',
      'a.b.c',
      'a-b.c',
      'abc.a-b-c.abc3',
      'ab-3',
      'plugin.example-2.todos',
      'plugin.example-2-beta-3.todos',
      'plugin.Example-2.todos',
    ]) {
      expect(createApiRef({ id }).id).toBe(id);
      expect(createApiRef().with({ id }).id).toBe(id);
    }

    for (const id of [
      '123',
      'ab_c',
      'a--b',
      '-a',
      'a-',
      'a.-b',
      'a.2-b',
      'a b',
      '.',
      '2ac',
      'ab.3a',
      '.abc',
      'abc.',
      'ab..s',
      '',
      '_',
    ]) {
      const error = `API id must contain period-separated components that each match the plugin ID format (letters, digits, and dashes, starting with a letter), got '${id}'`;
      expect(() => createApiRef({ id })).toThrow(error);
      expect(() => createApiRef().with({ id })).toThrow(error);
    }
  });
});
