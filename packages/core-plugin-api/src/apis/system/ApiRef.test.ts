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
import { ApiHolder, ApiRef } from './types';
import { createApiRef as createFrontendApiRef } from '@backstage/frontend-plugin-api';

describe('ApiRef', () => {
  it('should be created', () => {
    const ref = createApiRef({ id: 'abc' });
    expect(ref.$$type).toBe('@backstage/ApiRef');
    expect(ref.id).toBe('abc');
    expect(String(ref)).toBe('apiRef{abc}');
    expect(ref.T).toBeNull();
  });

  it('should not accept pluginId in the core createApiRef config', () => {
    // @ts-expect-error pluginId is not supported in core-plugin-api
    createApiRef<string>({ id: 'abc', pluginId: 'test' });
  });

  it('should reject async refs in legacy API types and lookups at compile time', () => {
    const syncRef = createFrontendApiRef<string>().with({ id: 'test.sync' });
    const asyncRef = createFrontendApiRef<string>().with({
      id: 'test.async',
      loading: 'async',
    });
    const compatible: ApiRef<string> = syncRef;
    expect(compatible).toBe(syncRef);
    // @ts-expect-error Legacy API refs cannot be asynchronous.
    const incompatible: ApiRef<string> = asyncRef;
    expect(incompatible).toBe(asyncRef);

    const holder: ApiHolder = { get: () => undefined };
    const result: string | undefined = holder.get(syncRef);
    expect(result).toBeUndefined();
    // @ts-expect-error Legacy API holders cannot consume async refs.
    holder.get(asyncRef);
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
      expect(() => createApiRef({ id }).id).toThrow(
        `API id must contain period-separated components that each match the plugin ID format (letters, digits, and dashes, starting with a letter), got '${id}'`,
      );
    }
  });
});
