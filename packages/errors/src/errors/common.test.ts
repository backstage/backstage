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

import * as errors from './common';

describe('common', () => {
  it('extends Error properly', () => {
    const { ForwardedError: _, ...optionalCauseErrors } = { ...errors };
    for (const [name, E] of Object.entries(optionalCauseErrors)) {
      const error = new E('abcdef');
      expect(error.name).toBe(name);
      expect(error.message).toBe('abcdef');
      expect(error.stack).toContain(__filename);
      expect(error.toString()).toContain(name);
      expect(error.toString()).toContain('abcdef');
    }
  });

  it('supports causes', () => {
    const cause = new Error('hello');
    const { ForwardedError, ...otherErrors } = { ...errors };
    for (const [name, E] of Object.entries(otherErrors)) {
      const error = new E('abcdef', cause);
      expect(error.cause).toBe(cause);
      expect(error.toString()).toContain(
        `${name}: abcdef; caused by Error: hello`,
      );
    }

    const error = new ForwardedError('abcdef', cause);
    expect(error.cause).toBe(cause);
    expect(error.toString()).toContain('Error: abcdef; caused by Error: hello');
  });

  it('avoids [object Object]', () => {
    const cause = { name: 'SillyError', message: 'oh no' };
    const error = new errors.ForwardedError('abcdef', cause);
    expect(error.cause).toBe(cause);
    expect(String(error)).toBe(
      'SillyError: abcdef; caused by SillyError: oh no',
    );
  });
});
