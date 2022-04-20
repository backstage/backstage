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

import { defaultGroupTransformer } from './defaultGroupTransformer';
import { GitLabGroupResponse } from './types';

describe('defaultGroupTransformer', () => {
  it('works for the happy path', () => {
    const input: GitLabGroupResponse = {
      id: 1,
      parent_id: 2,
      path: 'not-used',
      full_name: 'not-used',
      created_at: 'not-used',
      name: 'beta',
      description: "It's us!",
      full_path: 'alpha/beta',
      web_url: 'https://our.gitlab.com/groups/alpha/beta',
      avatar_url: 'https://our.gitlab.com/avatar.jpg',
    };

    const output = defaultGroupTransformer(input, {
      groupType: 'the-type',
      pathDelimiter: '.',
    });

    expect(output).toEqual({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: 'alpha.beta',
        description: "It's us!",
        annotations: {
          'backstage.io/managed-by-location':
            'url:https://our.gitlab.com/groups/alpha/beta',
          'backstage.io/managed-by-origin-location':
            'url:https://our.gitlab.com/groups/alpha/beta',
        },
      },
      spec: {
        type: 'the-type',
        profile: {
          displayName: 'beta',
          picture: 'https://our.gitlab.com/avatar.jpg',
        },
        children: [],
        members: [],
      },
    });
  });
});
