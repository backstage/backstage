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
import { createScriptOptionsParser } from './optionsParser';

describe('createScriptOptionsParser', () => {
  it('parses options from a backstage-cli script path', () => {
    const parse = createScriptOptionsParser(['package', 'lint'], {
      fix: { type: 'boolean' },
      'max-warnings': { type: 'string' },
    });

    expect(parse('backstage-cli package lint --fix --max-warnings 0')).toEqual({
      fix: true,
      'max-warnings': '0',
    });
    expect(parse('backstage-cli package lint')).toEqual({});
    expect(parse('backstage-cli package build')).toBeUndefined();
    expect(parse(undefined)).toBeUndefined();
  });

  it('parses options from an exact script prefix', () => {
    const parse = createScriptOptionsParser(
      'node bin/backstage-cli-module-oxlint package lint',
      {
        fix: { type: 'boolean' },
        'max-warnings': { type: 'string' },
      },
    );

    expect(
      parse(
        'node bin/backstage-cli-module-oxlint package lint --max-warnings 0',
      ),
    ).toEqual({ 'max-warnings': '0' });
    expect(
      parse('backstage-cli package lint --max-warnings 0'),
    ).toBeUndefined();
  });

  it('ignores shell operators and quoted values are preserved', () => {
    const parse = createScriptOptionsParser(['package', 'lint'], {
      format: { type: 'string' },
    });

    expect(parse("backstage-cli package lint --format 'unix'")).toEqual({
      format: 'unix',
    });
  });
});
