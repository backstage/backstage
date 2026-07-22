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
import { entityNoTags } from '@backstage/plugin-golden-paths-react';

import { GoldenPathTitle } from './GoldenPathTitle';

const TEXT = 'Middle-Earth';

jest.mock('@backstage/plugin-catalog-react', () => ({
  catalogApiRef: jest.fn(),
  starredEntitiesApiRef: jest.fn(),
  CatalogFilterLayout: jest.fn(),
  EntityDisplayName: jest.fn(),
  FavoriteEntity: jest.fn(),
}));

jest.mock('./GoldenPathTitle.styles', () => ({
  TitleContainer: () => <div>{TEXT}</div>,
  TextContainer: jest.fn(),
}));

describe('GoldenPathTitle', () => {
  it('should render properly', async () => {
    const { getByText } = await renderInTestApp(
      <GoldenPathTitle entity={entityNoTags} />,
    );

    expect(getByText(TEXT)).toBeInTheDocument();
  });
});
