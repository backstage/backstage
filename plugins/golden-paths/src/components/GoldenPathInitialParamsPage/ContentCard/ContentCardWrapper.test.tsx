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

import { ContentCardWrapper } from './ContentCardWrapper';
import { useGoldenPathParameterSchema } from './ContentCard.utils';

const CONTENT_CARD = 'Saruman';

jest.mock('./ContentCard.utils', () => ({
  useGoldenPathParameterSchema: jest.fn(),
}));

jest.mock('./ContentCard', () => ({
  ContentCard: () => CONTENT_CARD,
}));

describe('ContentCardWrapper', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render Progress component when `loading === true`', async () => {
    (useGoldenPathParameterSchema as jest.Mock).mockReturnValue({
      loading: true,
    });
    const { getByTestId } = await renderInTestApp(<ContentCardWrapper />);

    expect(getByTestId('progress')).toBeInTheDocument();
  });

  it('should render Error panel when error is returned', async () => {
    const ERROR_MSG = 'Sauron saw you.';
    (useGoldenPathParameterSchema as jest.Mock).mockReturnValue({
      loading: false,
      error: new Error(ERROR_MSG),
    });
    const { getByText } = await renderInTestApp(<ContentCardWrapper />);

    expect(getByText(ERROR_MSG)).toBeInTheDocument();
  });

  it('should render Error panel when `manifest` is falsy', async () => {
    (useGoldenPathParameterSchema as jest.Mock).mockReturnValue({
      loading: false,
    });
    const { getByText } = await renderInTestApp(<ContentCardWrapper />);

    expect(
      getByText('Failed to load Golden Path parameters schema!'),
    ).toBeInTheDocument();
  });

  it('should render ContentCard when `manifest` is provided', async () => {
    (useGoldenPathParameterSchema as jest.Mock).mockReturnValue({
      loading: false,
      manifest: {},
    });
    const { getByText } = await renderInTestApp(<ContentCardWrapper />);

    expect(getByText(CONTENT_CARD)).toBeInTheDocument();
  });
});
