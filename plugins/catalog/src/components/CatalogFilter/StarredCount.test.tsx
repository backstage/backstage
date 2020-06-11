/*
 * Copyright 2020 Spotify AB
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

import React from 'react';
import { render } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { StarredCount } from './StarredCount';
import * as Hooks from '../../hooks/useStarredEntites';

describe('Starred Count', () => {
  it('should render the count returned from the hook', async () => {
    jest.spyOn(Hooks, 'useStarredEntities').mockReturnValue({
      starredEntities: new Set(['id1', 'id2', 'id3', 'id4']),
      isStarredEntity: () => false,
      toggleStarredEntity: () => undefined,
    });

    const { findByText } = render(wrapInTestApp(<StarredCount />));

    expect(await findByText('4')).toBeInTheDocument();
  });
});
