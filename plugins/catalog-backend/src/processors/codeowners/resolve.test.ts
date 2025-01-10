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

import { normalizeCodeOwner, resolveCodeOwner } from './resolve';

const mockCodeOwnersText = () => `
*       @acme/team-foo @acme/team-bar
/docs   @acme/team-docs
`;

describe('resolveCodeOwner', () => {
  it('should parse the codeowners file', () => {
    expect(
      resolveCodeOwner(
        mockCodeOwnersText(),
        'https://github.com/can/be/tree/anything/catalog-info.yaml',
      ),
    ).toBe('team-foo');
  });
  it('should include the codeowners path into the provided pattern', () => {
    expect(
      resolveCodeOwner(
        mockCodeOwnersText(),
        'https://github.com/acme/repo/tree/main/docs/catalog-info.yaml',
      ),
    ).toBe('team-docs');
  });
  it('should match only in resource path', () => {
    expect(
      resolveCodeOwner(
        mockCodeOwnersText(),
        'https://github.com/acme/repo/tree/docs/catalog-info.yaml',
      ),
    ).toBe('team-foo');
  });
  it('should return undefined if the codeowners file contains no names', () => {
    expect(
      resolveCodeOwner(
        `*`,
        'https://github.com/acme/repo/tree/docs/catalog-info.yaml',
      ),
    ).toBe(undefined);
  });
});

describe('normalizeCodeOwner', () => {
  it('should remove the @ symbol', () => {
    expect(normalizeCodeOwner('@yoda')).toBe('User:yoda');
  });

  it('should remove org from org/team format', () => {
    expect(normalizeCodeOwner('@acme/foo')).toBe('foo');
  });

  it('should return username from email format', () => {
    expect(normalizeCodeOwner('foo@acme.com')).toBe('foo');
  });

  it.each([['acme/foo'], ['dacme/foo']])(
    'should return string everything else',
    owner => {
      expect(normalizeCodeOwner(owner)).toBe(owner);
    },
  );
});
