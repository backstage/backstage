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

import { PassportHelpers } from './PassportHelpers';
import { PassportProfile } from './types';

const email = 'user@example.com';

type TestPassportProfile = Partial<Omit<PassportProfile, 'emails'>> & {
  emails?: Array<{
    value: string;
    type?: string;
    verified?: boolean;
  }>;
  _json?: unknown;
};

function createProfile(profile: TestPassportProfile): PassportProfile {
  return {
    provider: 'test',
    id: 'user',
    displayName: 'User',
    ...profile,
  };
}

function createIdToken(claims: Record<string, unknown>): string {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');

  return `${encode({ alg: 'none' })}.${encode(claims)}.signature`;
}

describe('PassportHelpers', () => {
  describe('transformProfile', () => {
    it('preserves emails from non-OIDC provider profiles', () => {
      expect(
        PassportHelpers.transformProfile(
          createProfile({ emails: [{ value: email }] }),
        ).email,
      ).toBe(email);
      expect(
        PassportHelpers.transformProfile(
          createProfile({
            emails: [{ value: email }],
            _json: { user_id: 'legacy-user' },
          }),
        ).email,
      ).toBe(email);
    });

    it('ignores malformed profile containers', () => {
      expect(
        PassportHelpers.transformProfile(
          createProfile({
            emails: 'not-an-array',
            email,
          } as unknown as TestPassportProfile),
        ).email,
      ).toBe(email);
      expect(
        PassportHelpers.transformProfile(
          createProfile({
            emails: [{ value: email }],
            _json: 'not-an-object',
          }),
        ).email,
      ).toBe(email);
      expect(
        PassportHelpers.transformProfile(
          createProfile({
            emails: [{ value: email }],
            _json: null,
          }),
        ).email,
      ).toBe(email);
    });

    it('keeps provider profile emails independent of ID token metadata', () => {
      const transform = (claims: Record<string, unknown>) =>
        PassportHelpers.transformProfile(
          createProfile({ emails: [{ value: email }] }),
          createIdToken(claims),
        ).email;

      expect(transform({ email })).toBe(email);
      expect(transform({ email, email_verified: true })).toBe(email);
      expect(transform({ email, email_verified: false })).toBe(email);
    });

    it('omits profile emails with matching negative verification', () => {
      const transform = (profile: TestPassportProfile, idToken?: string) =>
        PassportHelpers.transformProfile(createProfile(profile), idToken).email;

      expect(
        transform({
          emails: [{ value: email }],
          _json: { sub: 'user', email, email_verified: true },
        }),
      ).toBe(email);
      expect(
        transform({
          emails: [{ value: email }],
          _json: { sub: 'user', email, email_verified: false },
        }),
      ).toBeUndefined();
      expect(
        transform({
          emails: [{ value: email }],
          _json: { sub: 'user', email },
        }),
      ).toBe(email);
      expect(
        transform({
          emails: [{ value: email }],
          _json: { sub: 'user', email_verified: true },
        }),
      ).toBe(email);
      expect(
        transform({
          emails: [{ value: email }],
          _json: {
            sub: 'user',
            email: 'different@example.com',
            email_verified: true,
          },
        }),
      ).toBe(email);
      expect(
        transform({
          emails: [{ value: email }],
          _json: {
            sub: 'user',
            email: 'different@example.com',
            email_verified: false,
          },
        }),
      ).toBe(email);
      expect(
        transform({
          emails: [{ value: email, verified: true }],
        }),
      ).toBe(email);
      expect(
        transform({
          emails: [{ value: email, verified: false }],
        }),
      ).toBeUndefined();
      expect(
        transform({
          emails: [{ value: email, verified: true }],
          _json: {
            sub: 'user',
            email: 'different@example.com',
            email_verified: true,
          },
        }),
      ).toBe(email);
      expect(
        transform(
          {
            emails: [{ value: email }],
            _json: { sub: 'user', email, email_verified: false },
          },
          createIdToken({ email, email_verified: true }),
        ),
      ).toBeUndefined();
    });

    it('omits ID token emails with negative verification', () => {
      const transform = (claims: Record<string, unknown>) =>
        PassportHelpers.transformProfile(
          createProfile({}),
          createIdToken(claims),
        ).email;

      expect(transform({ email, email_verified: true })).toBe(email);
      expect(transform({ email, email_verified: false })).toBeUndefined();
      expect(transform({ email })).toBe(email);
    });

    it('keeps non-email profile data available when an email is rejected', () => {
      const result = PassportHelpers.transformProfile(
        createProfile({
          emails: [{ value: email }],
          photos: [{ value: 'https://example.com/avatar.png' }],
          _json: { sub: 'user', email, email_verified: false },
        }),
        'not-a-jwt',
      );

      expect(result).toEqual({
        email: undefined,
        picture: 'https://example.com/avatar.png',
        displayName: 'User',
      });
    });
  });
});
