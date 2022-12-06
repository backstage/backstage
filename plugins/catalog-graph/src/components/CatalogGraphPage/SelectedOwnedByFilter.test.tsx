/*
 * Copyright 2021 The Backstage Authors
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

import { RELATION_CHILD_OF, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { SelectedOwnedByFilter } from './SelectedOwnedByFilter';

describe('<SelectedOwnedByFilter/>', () => {
  test('should render current value', () => {
    render(
      <SelectedOwnedByFilter
        value={[RELATION_OWNED_BY, RELATION_CHILD_OF]}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText(RELATION_OWNED_BY)).toBeInTheDocument();
    expect(screen.getByText(RELATION_CHILD_OF)).toBeInTheDocument();
  });
});
