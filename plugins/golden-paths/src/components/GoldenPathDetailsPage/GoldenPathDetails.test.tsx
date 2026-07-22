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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  catalogApiRef,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  entityNoTags,
  GoldenPathContextMenu,
  DetailsContent,
} from '@backstage/plugin-golden-paths-react';

import { GoldenPathDetails } from './GoldenPathDetails';
import { GoldenPathTitle } from './GoldenPathTitle';

const MOCK_TEXT = 'Mock FavouriteEntity';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: jest.fn(),
  getEntityRelations: jest.fn(),
  CatalogFilterLayout: jest.fn(),
  catalogApiRef: jest.fn(),
  StarredEntitiesApi: jest.fn(),
  starredEntitiesApiRef: jest.fn(),
  FavoriteEntity: jest.fn(() => <button>{MOCK_TEXT}</button>),
}));

jest.mock('./GoldenPathTitle', () => ({
  GoldenPathTitle: jest.fn(),
}));

jest.mock('@backstage/plugin-golden-paths-react', () => ({
  ...jest.requireActual('@backstage/plugin-golden-paths-react'),
  DetailsContent: jest.fn(),
  GoldenPathContextMenu: jest.fn(),
  goldenPathsApiRef: () => jest.fn(),
}));

const mockCatalogApi = {
  getEntities: jest.fn().mockResolvedValue({ items: [] }),
};

describe('GoldenPathDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render 'Details' page, when entity data is provided", async () => {
    (useEntity as jest.Mock).mockReturnValue({
      entity: entityNoTags,
    });
    (getEntityRelations as jest.Mock).mockReturnValue([entityNoTags]);
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, mockCatalogApi]]}>
        <GoldenPathDetails />
      </TestApiProvider>,
    );

    expect(DetailsContent).toHaveBeenCalled();
    expect(GoldenPathTitle).toHaveBeenCalled();
    expect(GoldenPathContextMenu).toHaveBeenCalled();
  });
});
