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
  entityNoRegions,
  entityWithRegions,
} from '@backstage/plugin-golden-paths-react';

import { RegionsAndTemplates } from './RegionsAndTemplates';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: jest.fn(),
  CatalogFilterLayout: jest.fn(),
  catalogApiRef: jest.fn(),
  StarredEntitiesApi: jest.fn(),
  starredEntitiesApiRef: jest.fn(),
}));

describe('RegionsAndTemplates', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render nothing if there is no entity provided', async () => {
    (useEntity as jest.Mock).mockReturnValue({});

    const { queryByTestId } = await renderInTestApp(<RegionsAndTemplates />);

    const component = queryByTestId('golden-path-regions-and-templates');
    expect(component).not.toBeInTheDocument();
  });

  it('should render no regions if there are no regions in entity', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityNoRegions });

    const { getByTestId } = await renderInTestApp(<RegionsAndTemplates />);

    const component = getByTestId('golden-path-regions-and-templates');
    expect(component).toBeInTheDocument();

    const regions = component.firstChild;
    expect(regions).toBeInTheDocument();
    expect(regions?.hasChildNodes()).toBeFalsy();
  });

  it('should render regions, if there are regions in entity', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityWithRegions });

    const { getByTestId, getByText } = await renderInTestApp(
      <RegionsAndTemplates />,
    );

    const component = getByTestId('golden-path-regions-and-templates');
    expect(component).toBeInTheDocument();

    const regions = getByText('Poland, Netherlands, Germany');
    expect(regions).toBeInTheDocument();
  });

  it('should render proper number of templates, if there is one template in entity', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityNoRegions });

    const { getByText } = await renderInTestApp(<RegionsAndTemplates />);

    const templates = getByText('1 template');
    expect(templates).toBeInTheDocument();
  });

  it('should render proper number of templates, if there are more templates in entity', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityWithRegions });

    const { getByText } = await renderInTestApp(<RegionsAndTemplates />);

    const templates = getByText('2 templates');
    expect(templates).toBeInTheDocument();
  });
});
