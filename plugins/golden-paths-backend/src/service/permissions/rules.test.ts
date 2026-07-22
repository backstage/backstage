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
import { hasTag, isTaskOwner } from './rules';
import { SerializedTask } from '../../golden-paths';

describe('hasTag', () => {
  describe('apply', () => {
    it('returns false when the tag is not present', () => {
      expect(
        hasTag.apply(
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
        hasTag.apply(
          {},
          {
            tag: 'baz',
          },
        ),
      ).toEqual(false);
    });

    it('returns false when tags is an empty array', () => {
      expect(
        hasTag.apply(
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
        hasTag.apply(
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

describe('isTaskOwner', () => {
  describe('apply', () => {
    const task: SerializedTask = {
      id: 'testId',
      spec: {
        apiVersion: 'backstage.io/v1beta1',
        steps: [
          {
            template: 'template:development/test-template',
            id: 'test-step',
            name: 'Test Step',
            input: {
              value: '${{ parameters.value}}',
            },
          },
        ],
        parameters: {
          value: 'testParameter',
        },
        goldenPathInfo: {
          entityRef: 'testEntity',
        },
      },
      status: 'processing',
      createdAt: 'now',
      createdBy: 'user-id',
    };
    it('returns false when createdBy is not matched', () => {
      expect(
        isTaskOwner.apply(task, {
          createdBy: ['not-matched'],
        }),
      ).toEqual(false);
    });
    it('returns true when createdBy matches', () => {
      expect(
        isTaskOwner.apply(task, {
          createdBy: ['user-id'],
        }),
      ).toEqual(true);
    });
  });
});
