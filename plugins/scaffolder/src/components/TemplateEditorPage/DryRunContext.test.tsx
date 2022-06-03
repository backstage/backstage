/*
 * Copyright 2022 The Backstage Authors
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

import { base64EncodeContent } from './DryRunContext';

// eslint-disable-next-line no-restricted-imports
import { TextEncoder } from 'util';

window.TextEncoder = TextEncoder;

describe('base64EncodeContent', () => {
  it('encodes text files', () => {
    expect(base64EncodeContent('abc')).toBe('YWJj');
    expect(base64EncodeContent('abc'.repeat(1000000))).toBe(
      btoa('<file too large>'),
    );
  });

  it('encodes binary files', () => {
    expect(base64EncodeContent('\x00\x01\x02')).toBe('AAEC');
    expect(base64EncodeContent('😅')).toBe('8J+YhQ==');
    // Triggers chunking
    expect(base64EncodeContent('😅'.repeat(18000))).toBe(
      '8J+YhfCfmIXwn5iF8J+YhfCfmIXwn5iF'.repeat(3000),
    );
    // Triggers size check
    expect(base64EncodeContent('😅'.repeat(1000000))).toBe(
      btoa('<file too large>'),
    );
  });
});
