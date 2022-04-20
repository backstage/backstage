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

import { defaultUserTransformer } from './defaultUserTransformer';
import { GitLabUserResponse } from './types';

describe('defaultUserTransformer', () => {
  it('works for the happy path', () => {
    const input: GitLabUserResponse = {
      id: 1,
      state: 'not-used',
      created_at: 'not-used',
      job_title: 'not-used',
      username: 'pluto',
      name: 'Pluto',
      web_url: 'https://gitlab.com/pluto',
      avatar_url: 'https://gitlab.com/pluto.png',
      public_email: 'pluto@disney.com',
      bot: false,
    };

    const output = defaultUserTransformer(input);

    expect(output).toEqual({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'pluto',
        annotations: {
          'backstage.io/managed-by-location': 'url:https://gitlab.com/pluto',
          'backstage.io/managed-by-origin-location':
            'url:https://gitlab.com/pluto',
        },
      },
      spec: {
        profile: {
          displayName: 'Pluto',
          picture: 'https://gitlab.com/pluto.png',
          email: 'pluto@disney.com',
        },
        memberOf: [],
      },
    });
  });

  it('ignores bots', () => {
    expect(defaultUserTransformer({ bot: true } as any)).toBeUndefined();
  });
});
