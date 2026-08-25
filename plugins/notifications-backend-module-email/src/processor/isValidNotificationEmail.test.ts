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

import { isValidNotificationEmail } from './isValidNotificationEmail';

describe('isValidNotificationEmail', () => {
  it('accepts a single unquoted local@domain and rejects address-list forms', () => {
    expect(isValidNotificationEmail('user@example.com')).toBe(true);
    expect(isValidNotificationEmail('user+tag@example.com')).toBe(true);
    expect(isValidNotificationEmail('User.Name@Example.COM')).toBe(true);

    expect(isValidNotificationEmail('')).toBe(false);
    expect(isValidNotificationEmail(' user@example.com')).toBe(false);
    expect(isValidNotificationEmail('user@example.com ')).toBe(false);
    expect(isValidNotificationEmail('has spaces@example.com')).toBe(false);
    expect(
      isValidNotificationEmail('"attacker@evil.com x"@internal.domain'),
    ).toBe(false);
    expect(isValidNotificationEmail('alice@mycompany.com,evil@x.com')).toBe(
      false,
    );
    expect(isValidNotificationEmail('Name <user@example.com>')).toBe(false);
    expect(isValidNotificationEmail('<user@example.com>')).toBe(false);
    expect(isValidNotificationEmail('user@example.com;evil@x.com')).toBe(false);
    expect(isValidNotificationEmail('not-an-email')).toBe(false);
    expect(isValidNotificationEmail('user@@example.com')).toBe(false);
    expect(isValidNotificationEmail('@example.com')).toBe(false);
    expect(isValidNotificationEmail('user@')).toBe(false);
  });
});
