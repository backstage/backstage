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

import { resolveNotificationLink } from './utils';

describe('resolveNotificationLink', () => {
  it('resolves relative links when baseUrl has a sub-path', () => {
    expect(
      resolveNotificationLink(
        '/catalog/default/component/example',
        'https://backstage.example.com',
      ),
    ).toBe('https://backstage.example.com/catalog/default/component/example');
  });

  it('normalizes links with multiple leading slashes', () => {
    expect(
      resolveNotificationLink('///catalog', 'https://backstage.example.com'),
    ).toBe('https://backstage.example.com/catalog');
  });

  it('returns already-absolute URLs unchanged', () => {
    expect(
      resolveNotificationLink(
        'https://other.example.com/path?query=1#section',
        'https://backstage.example.com',
      ),
    ).toBe('https://other.example.com/path?query=1#section');
  });
});
