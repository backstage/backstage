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

import { ConflictError } from '@backstage/errors';
import { createSecretProviderRegistry } from './SecretProviderRegistry';
import type { SecretProvider } from './types';

const provider = (id: string): SecretProvider => ({
  id,
  async resolve() {
    return { value: `${id}-value` };
  },
});

describe('createSecretProviderRegistry', () => {
  it('looks providers up by id and rejects duplicates', () => {
    const registry = createSecretProviderRegistry([
      provider('a'),
      provider('b'),
    ]);

    expect(registry.getProvider('a')?.id).toBe('a');
    expect(registry.getProvider('b')?.id).toBe('b');
    expect(registry.getProvider('missing')).toBeUndefined();

    expect(() =>
      createSecretProviderRegistry([provider('dup'), provider('dup')]),
    ).toThrow(ConflictError);
  });
});
