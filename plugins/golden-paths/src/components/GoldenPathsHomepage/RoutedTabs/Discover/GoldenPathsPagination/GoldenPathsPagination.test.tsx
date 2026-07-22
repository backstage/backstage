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
import { renderInTestApp } from '@backstage/test-utils';
import { useEntityList } from '@backstage/plugin-catalog-react';

import { GoldenPathsPagination } from './GoldenPathsPagination';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityList: jest.fn(),
}));

describe('GoldenPathsPagination', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render nothing if there is no pagination configured', async () => {
    (useEntityList as jest.Mock).mockReturnValue({});

    const { queryByText } = await renderInTestApp(<GoldenPathsPagination />);

    const label = queryByText('Golden Paths per page:');
    expect(label).not.toBeInTheDocument();
  });

  it('should render pagination properly', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      setOffset: () => {},
      totalItems: 2,
      limit: 6,
    });

    const { getByText, getByTitle } = await renderInTestApp(
      <GoldenPathsPagination />,
    );

    const label = getByText('Golden Paths per page:');
    expect(label).toBeInTheDocument();

    const labelCount = getByText('1-2 of 2');
    expect(labelCount).toBeInTheDocument();

    const prevPage = getByTitle('Previous page');
    expect(prevPage).toBeInTheDocument();

    const nextPage = getByTitle('Next page');
    expect(nextPage).toBeInTheDocument();
  });
});
