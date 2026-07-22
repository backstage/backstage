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
import { getEntityRelations, useEntity } from '@backstage/plugin-catalog-react';
import {
  entityWithRegions,
  entityNoTags,
} from '@backstage/plugin-golden-paths-react';

import { GoldenPathCardActions } from './GoldenPathCardActions';

const MOCK_TEXT = 'Mock RefLinks';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: jest.fn(),
  getEntityRelations: jest.fn(),
  CatalogFilterLayout: jest.fn(),
  catalogApiRef: jest.fn(),
  StarredEntitiesApi: jest.fn(),
  starredEntitiesApiRef: jest.fn(),
  EntityRefLinks: jest.fn(() => <div>{MOCK_TEXT}</div>),
}));

describe('GoldenPathCardActions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render nothing if there is no entity provided or there are no owners of entity', async () => {
    (useEntity as jest.Mock).mockReturnValue({});
    (getEntityRelations as jest.Mock).mockReturnValue([]);

    const { container } = await renderInTestApp(<GoldenPathCardActions />);

    const cardActions = container.querySelector('[class*=MuiCardActions]');
    expect(cardActions).not.toBeInTheDocument();
  });

  it('should render all elements if there is entity provided with owners', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityWithRegions });
    (getEntityRelations as jest.Mock).mockReturnValue([entityNoTags]);

    const { container, getByRole, getByText } = await renderInTestApp(
      <GoldenPathCardActions />,
    );

    const cardActions = container.querySelector('[class*=MuiCardActions]');
    expect(cardActions).toBeInTheDocument();

    const chooseButton = getByRole('button', { name: 'Choose' });
    expect(chooseButton).toBeInTheDocument();

    const refLinks = getByText(MOCK_TEXT);
    expect(refLinks).toBeInTheDocument();
  });
});
