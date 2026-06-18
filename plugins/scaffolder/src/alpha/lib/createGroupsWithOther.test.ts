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

import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { createGroupsWithOther } from './createGroupsWithOther';

const make = (type: string): TemplateEntityV1beta3 =>
  ({
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: { name: `n-${type}` },
    spec: { type, parameters: [], steps: [] },
  } as unknown as TemplateEntityV1beta3);

describe('createGroupsWithOther', () => {
  it('appends an Other group matching everything not matched by prior groups', () => {
    const groups = createGroupsWithOther(
      [{ title: 'Services', filter: e => e.spec?.type === 'service' }],
      'Other',
    );

    expect(groups).toHaveLength(2);
    expect(groups[0].title).toBe('Services');
    expect(groups[0].filter(make('service'))).toBe(true);
    expect(groups[0].filter(make('library'))).toBe(false);

    expect(groups[1].title).toBe('Other');
    expect(groups[1].filter(make('service'))).toBe(false);
    expect(groups[1].filter(make('library'))).toBe(true);
  });

  it('returns only the Other group when given no input groups', () => {
    const groups = createGroupsWithOther([], 'Other');
    expect(groups).toHaveLength(1);
    expect(groups[0].filter(make('anything'))).toBe(true);
  });
});
