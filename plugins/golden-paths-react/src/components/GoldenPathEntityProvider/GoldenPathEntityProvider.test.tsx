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
import { useAsyncEntity } from '@backstage/plugin-catalog-react';

import { GoldenPathEntityProvider } from './GoldenPathEntityProvider';
import { mockedEntity } from '../../mocks';

const ENTITY_PROVIDER = 'Iluvatar';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useAsyncEntity: jest.fn(),
  EntityProvider: () => <div>{ENTITY_PROVIDER}</div>,
}));

describe('GoldenPathEntityProvider', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render loading, when entity is not yet loaded', async () => {
    (useAsyncEntity as jest.Mock).mockReturnValue({ loading: true });

    const { getByTestId } = await renderInTestApp(<GoldenPathEntityProvider />);

    expect(getByTestId('progress')).toBeInTheDocument();
  });

  it('should render error, when entity is loaded, but error occurred', async () => {
    const ERROR = 'Random error message';
    (useAsyncEntity as jest.Mock).mockReturnValue({
      loading: false,
      error: new Error(ERROR),
    });

    const { getByText } = await renderInTestApp(<GoldenPathEntityProvider />);

    expect(getByText(ERROR)).toBeInTheDocument();
  });

  it("should render 'No Golden Path' text, when there is no entity data", async () => {
    (useAsyncEntity as jest.Mock).mockReturnValue({ loading: false });

    const { getByText } = await renderInTestApp(<GoldenPathEntityProvider />);

    expect(getByText(/There is no Golden Path/)).toBeInTheDocument();
  });

  it("should render custom 'Not Found' page, when it is provided and there is no entity data", async () => {
    const NOT_FOUND = 'The third eagle was sent for Smeagol.';
    (useAsyncEntity as jest.Mock).mockReturnValue({ loading: false });

    const { getByText } = await renderInTestApp(
      <GoldenPathEntityProvider GoldenPathNotFound={NOT_FOUND} />,
    );

    expect(getByText(NOT_FOUND)).toBeInTheDocument();
  });

  it("should render 'Details' page, when entity data is provided", async () => {
    (useAsyncEntity as jest.Mock).mockReturnValue({
      loading: false,
      entity: mockedEntity,
    });

    const { getByText } = await renderInTestApp(<GoldenPathEntityProvider />);

    expect(getByText(ENTITY_PROVIDER)).toBeInTheDocument();
  });
});
