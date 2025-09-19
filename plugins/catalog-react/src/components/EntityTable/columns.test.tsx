/*
 * Copyright 2025 The Backstage Authors
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
import { render, screen } from '@testing-library/react';
import { columnFactories } from './columns';
import { mockApis, MockErrorApi, TestApiProvider } from '@backstage/test-utils';
import { errorApiRef } from '@backstage/core-plugin-api';
import { translationApiRef } from '@backstage/core-plugin-api/alpha';

describe('columns', () => {
  it('should render owner title', async () => {
    const { title } = columnFactories.createOwnerColumn();

    render(
      <TestApiProvider
        apis={[
          [errorApiRef, new MockErrorApi()],
          [translationApiRef, mockApis.translation()],
        ]}
      >
        {title}
      </TestApiProvider>,
    );

    expect(await screen.findByText('Owner')).toBeInTheDocument();
  });
});
