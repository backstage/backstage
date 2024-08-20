/*
 * Copyright 2024 The Backstage Authors
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
import Strategy from 'passport-atlassian-oauth2';

describe('Strategy', () => {
  it('should be an instance of', () => {
    const strategy = new Strategy(
      {
        authorizationURL: 'https://auth.atlassian.com/authorize',
        tokenURL: 'https://auth.atlassian.com/oauth/token',
        clientID: 'my-client-id',
        clientSecret: 'my-client-secret',
        scope: ['offline_access', 'read:jira-work', 'read:jira-user'],
      },
      () => {},
    );
    expect((strategy as any).name).toBe('atlassian');
  });
});
