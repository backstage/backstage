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
import { scaffolderTemplateRules } from '../rules';

describe('hasTag', () => {
  describe('apply', () => {
    it('returns false when the tag is not present', () => {
      expect(
        scaffolderTemplateRules.hasTag.apply(
          {
            'backstage:permissions': {
              tags: ['foo', 'bar'],
            },
          },
          {
            tag: 'baz',
          },
        ),
      ).toEqual(false);
    });

    it('returns false when backstage:permissions is missing', () => {
      expect(
        scaffolderTemplateRules.hasTag.apply(
          {},
          {
            tag: 'baz',
          },
        ),
      ).toEqual(false);
    });

    it('returns false when tags is an empty array', () => {
      expect(
        scaffolderTemplateRules.hasTag.apply(
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              'backstage:permissions': {
                tags: [],
              },
            },
          },
          {
            tag: 'baz',
          },
        ),
      ).toEqual(false);
    });

    it('returns true when the tag is present', () => {
      expect(
        scaffolderTemplateRules.hasTag.apply(
          {
            'backstage:permissions': {
              tags: ['foo', 'bar'],
            },
          },
          {
            tag: 'bar',
          },
        ),
      ).toEqual(true);
    });
  });
});
