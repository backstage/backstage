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
import {
  RELATION_CHILD_OF,
  RELATION_PARENT_OF,
} from '@backstage/catalog-model';
import { render } from '@testing-library/react';
import React from 'react';
import { CustomLabel } from './CustomLabel';

describe('<CustomLabel />', () => {
  test('renders label', () => {
    const { getByText } = render(
      <svg xmlns="http://www.w3.org/2000/svg">
        <CustomLabel
          edge={{
            label: 'visible',
            relations: [RELATION_PARENT_OF],
            from: 'from-id',
            to: 'to-id',
          }}
        />
      </svg>,
    );

    expect(getByText(RELATION_PARENT_OF)).toBeInTheDocument();
  });

  test('renders label with multiple relations', () => {
    const { getByText } = render(
      <svg xmlns="http://www.w3.org/2000/svg">
        <CustomLabel
          edge={{
            label: 'visible',
            relations: [RELATION_PARENT_OF, RELATION_CHILD_OF],
            from: 'from-id',
            to: 'to-id',
          }}
        />
      </svg>,
    );

    expect(getByText(RELATION_PARENT_OF)).toBeInTheDocument();
    expect(getByText(RELATION_CHILD_OF)).toBeInTheDocument();
  });
});
