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

import { UserEntity } from '@backstage/catalog-model';
import { graphql } from '@octokit/graphql';
import {
  defaultUserTransformer,
  TransformerContext,
} from './defaultTransformers';
import { GithubUser } from './github';

const ctx: TransformerContext = {
  client: graphql,
  query: '',
  org: 'test-org',
};

function makeUser(overrides: Partial<GithubUser> = {}): GithubUser {
  return {
    login: 'testuser',
    avatarUrl: '',
    ...overrides,
  };
}

describe('defaultUserTransformer', () => {
  it('populates all fields correctly', async () => {
    const result = (await defaultUserTransformer(
      makeUser({
        name: 'Test User',
        email: 'test@example.com',
        bio: 'A test bio',
        avatarUrl: 'https://example.com/avatar.png',
        id: 'user-id-123',
      }),
      ctx,
    )) as UserEntity;

    expect(result.metadata.name).toBe('testuser');
    expect(result.metadata.description).toBe('A test bio');
    expect(result.metadata.annotations).toEqual({
      'github.com/user-login': 'testuser',
      'github.com/user-id': 'user-id-123',
    });
    expect(result.spec.profile).toEqual({
      displayName: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/avatar.png',
    });
    expect(result.spec.memberOf).toEqual([]);
  });

  it('prefers verified domain email over regular email', async () => {
    const result = (await defaultUserTransformer(
      makeUser({
        email: 'public@gmail.com',
        organizationVerifiedDomainEmails: ['corp@company.com'],
      }),
      ctx,
    )) as UserEntity;

    expect(result.spec.profile!.email).toBe('corp@company.com');
  });

  it('strips plus-addressed tag from verified domain email', async () => {
    const result = (await defaultUserTransformer(
      makeUser({
        organizationVerifiedDomainEmails: ['amckay+2jc29kv2@spotify.com'],
      }),
      ctx,
    )) as UserEntity;

    expect(result.spec.profile!.email).toBe('amckay@spotify.com');
  });

  it('uses verified domain email when regular email is absent', async () => {
    const result = (await defaultUserTransformer(
      makeUser({
        organizationVerifiedDomainEmails: ['corp@company.com'],
      }),
      ctx,
    )) as UserEntity;

    expect(result.spec.profile!.email).toBe('corp@company.com');
  });

  it('falls back to regular email when verified array is empty', async () => {
    const result = (await defaultUserTransformer(
      makeUser({
        email: 'public@gmail.com',
        organizationVerifiedDomainEmails: [],
      }),
      ctx,
    )) as UserEntity;

    expect(result.spec.profile!.email).toBe('public@gmail.com');
  });

  it('falls back to regular email when verified array is undefined', async () => {
    const result = (await defaultUserTransformer(
      makeUser({
        email: 'public@gmail.com',
      }),
      ctx,
    )) as UserEntity;

    expect(result.spec.profile!.email).toBe('public@gmail.com');
  });

  it('sets no email when both are absent', async () => {
    const result = (await defaultUserTransformer(
      makeUser(),
      ctx,
    )) as UserEntity;

    expect(result.spec.profile!.email).toBeUndefined();
  });
});
