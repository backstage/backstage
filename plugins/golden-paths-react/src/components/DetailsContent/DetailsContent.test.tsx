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
import { PropsWithChildren } from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { useEntity } from '@backstage/plugin-catalog-react';
import { entityNoRegions, entityNoTags, entityWithRegions } from '../../mocks';

import { DetailsContent } from './DetailsContent';

const REF_LINKS = 'Saruman';
const REGIONS = 'Shire, Mordor, Rohan';
const DESCRIPTION = 'One Ring to rule them all';
const START_BUTTON = 'Start the Adventure';
const CHOOSE_BUTTON = 'Choose wisely';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: jest.fn(),
  getEntityRelations: jest.fn(() => [
    { kind: 'Group', namespace: 'development', name: 't00001' },
  ]),
  catalogApiRef: jest.fn(),
  starredEntitiesApiRef: jest.fn(),
  CatalogFilterLayout: jest.fn(),
  EntityRefLinks: () => <div>{REF_LINKS}</div>,
}));

jest.mock('./DetailsDescription', () => ({
  DetailsDescription: () => <div>{DESCRIPTION}</div>,
}));

jest.mock('../StartButton', () => ({
  StartButton: () => <button>{START_BUTTON}</button>,
}));

jest.mock('@backstage/core-components', () => ({
  OverflowTooltip: () => <div>{REGIONS}</div>,
  InfoCard: ({ children }: PropsWithChildren) => <div>{children}</div>,
  LinkButton: () => <button>{CHOOSE_BUTTON}</button>,
  Content: () => <div />,
}));

describe('DetailsContent', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render properly for entity without tags and regions', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityNoTags });
    const { getByText, getByRole, queryByText, queryByTestId } =
      await renderInTestApp(<DetailsContent />);

    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText(REF_LINKS)).toBeInTheDocument();
    expect(queryByText(REGIONS)).not.toBeInTheDocument();
    expect(getByText('1 template')).toBeInTheDocument();
    expect(getByText(DESCRIPTION)).toBeInTheDocument();
    expect(queryByTestId('golden-path-content-tags')).not.toBeInTheDocument();
  });

  it('should render tags for entity with tags', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityNoRegions });
    const { getByTestId } = await renderInTestApp(<DetailsContent />);

    expect(getByTestId('golden-path-content-tags')).toBeInTheDocument();
  });

  it('should render regions for entity with regions', async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityWithRegions });
    const { getByText } = await renderInTestApp(<DetailsContent />);

    expect(getByText(REGIONS)).toBeInTheDocument();
  });

  it("should render button 'Start Golden Path' for entity with no required parameters (spec.parameters === undefined)", async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityNoTags });
    const { getByText } = await renderInTestApp(<DetailsContent />);

    expect(getByText(START_BUTTON)).toBeInTheDocument();
  });

  it("should render button 'Start Golden Path' for entity with no required parameters (spec.parameters === [])", async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityNoRegions });
    const { getByText } = await renderInTestApp(<DetailsContent />);

    expect(getByText(START_BUTTON)).toBeInTheDocument();
  });

  it("should render button 'Choose Golden Path' for entity with required parameters", async () => {
    (useEntity as jest.Mock).mockReturnValue({ entity: entityWithRegions });
    const { getByText } = await renderInTestApp(<DetailsContent />);

    expect(getByText(CHOOSE_BUTTON)).toBeInTheDocument();
  });
});
