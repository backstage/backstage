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
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  entityNoTags,
  entityNoRegions,
  entityWithRegions,
} from '@backstage/plugin-golden-paths-react';

import { GoldenPathCardTags } from './GoldenPathCardTags';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: jest.fn(),
  CatalogFilterLayout: jest.fn(),
  catalogApiRef: jest.fn(),
  StarredEntitiesApi: jest.fn(),
  starredEntitiesApiRef: jest.fn(),
}));

describe('GoldenPathCardTags', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render nothing if there is no entity provided', async () => {
    (useEntity as jest.Mock).mockReturnValue({});

    const { container } = await renderInTestApp(<GoldenPathCardTags />);

    const tagElement = container.querySelector('[class*=MuiChip-root]');
    expect(tagElement).not.toBeInTheDocument();
  });

  it('should render nothing if there is no tags provided in entity', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityNoTags });

    const { container } = await renderInTestApp(<GoldenPathCardTags />);

    const tagElement = container.querySelector('[class*=MuiChip-root]');
    expect(tagElement).not.toBeInTheDocument();
  });

  it('should render one tag element if there is a tag provided in entity', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityNoRegions });

    const { container } = await renderInTestApp(<GoldenPathCardTags />);

    const tagElement = container.querySelectorAll('[class*=MuiChip-root]');
    expect(tagElement).toHaveLength(1);
  });

  it('should render more tag elements if there is more tags provided in entity', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityWithRegions });

    const { container } = await renderInTestApp(<GoldenPathCardTags />);

    const tagElement = container.querySelectorAll('[class*=MuiChip-root]');
    expect(tagElement).toHaveLength(2);
  });
});
