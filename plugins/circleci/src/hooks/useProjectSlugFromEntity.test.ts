/*
 * Copyright 2020 The Backstage Authors
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

import { renderHook } from '@testing-library/react';
import { Entity } from '@backstage/catalog-model';
import { CIRCLECI_ANNOTATION } from '../constants';
import { useProjectSlugFromEntity } from './useProjectSlugFromEntity';
import { makeWrapper } from '../__testUtils__/testUtils';

const createDummyEntity = (annotations = {}): Entity => {
  return {
    apiVersion: '',
    kind: '',
    metadata: {
      name: 'dummy',
      annotations,
    },
  };
};

describe('useProjectSlugFromEntity', () => {
  const DUMMY_PROJECT_SLUG = 'github/my-org/dummy';

  it('should parse CircleCI annotation', () => {
    const { result } = renderHook(() => useProjectSlugFromEntity(), {
      wrapper: makeWrapper({
        entity: createDummyEntity({
          [CIRCLECI_ANNOTATION]: DUMMY_PROJECT_SLUG,
        }),
        apis: [],
      }),
    });

    expect(result.current).toEqual({
      owner: 'my-org',
      projectSlug: 'github/my-org/dummy',
      repo: 'dummy',
      vcs: 'github',
    });
  });

  it('should handle empty CircleCI annotation', () => {
    const { result } = renderHook(() => useProjectSlugFromEntity(), {
      wrapper: makeWrapper({
        entity: createDummyEntity({
          [CIRCLECI_ANNOTATION]: '',
        }),
        apis: [],
      }),
    });

    expect(result.current).toEqual({
      owner: undefined,
      projectSlug: '',
      repo: undefined,
      vcs: '',
    });
  });

  it('should handle non-existent CircleCI annotation', () => {
    const { result } = renderHook(() => useProjectSlugFromEntity(), {
      wrapper: makeWrapper({
        entity: createDummyEntity(),
        apis: [],
      }),
    });

    expect(result.current).toEqual({
      owner: undefined,
      projectSlug: '',
      repo: undefined,
      vcs: '',
    });
  });
});
