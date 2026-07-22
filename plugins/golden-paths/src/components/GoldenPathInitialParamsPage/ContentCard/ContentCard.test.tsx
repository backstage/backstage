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
import { GoldenPathParameterSchema } from '@backstage/plugin-golden-paths-react';

import { ContentCard } from './ContentCard';
import { useContentCard } from './ContentCard.utils';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import userEvent from '@testing-library/user-event';

const MANIFEST: GoldenPathParameterSchema = { title: 'manifest', steps: [] };
const component = <ContentCard manifest={MANIFEST} />;
const REVIEW = 'TestReviewStateComponent';
const START = 'TestStartButtonComponent';

jest.mock('./ContentCard.utils', () => ({
  useContentCard: jest.fn(),
  catalogApiRef: jest.fn(),
  starredEntitiesApiRef: jest.fn(),
  CatalogFilterLayout: jest.fn(),
}));

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: jest.fn(() => ({
    entity: {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'GoldenPath',
      metadata: { name: 'Test Name X', namespace: 'development' },
      relations: [
        { type: RELATION_OWNED_BY, targetRef: 'group:development/t00001' },
      ],
      spec: {
        owner: 'group:development/t00001',
        type: 'other',
        steps: [
          {
            template: 'template:development/dummy-template',
            id: 'dummy-template',
            name: 'Dummy Template',
          },
        ],
      },
    },
  })),
}));

const MENU = 'Rohan';

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  Form: ({
    children,
    onSubmit,
  }: PropsWithChildren<{ onSubmit: (params: any) => void }>) => (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit({});
      }}
    >
      {children}
    </form>
  ),
  ReviewState: () => <>{REVIEW}</>,
}));

jest.mock('@backstage/plugin-golden-paths-react', () => ({
  useGoldenPathContext: () => ({}),
  StartButton: () => <button>{START}</button>,
  GoldenPathContextMenu: () => <>{MENU}</>,
}));

describe('ContentCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render Header with title', async () => {
    (useContentCard as jest.Mock).mockReturnValue({});
    const { getByText } = await renderInTestApp(component);

    expect(
      getByText('Provide the following information to start'),
    ).toBeInTheDocument();
  });

  it('should render empty form by default', async () => {
    (useContentCard as jest.Mock).mockReturnValue({});
    const { getByText, queryByText, getByRole, container } =
      await renderInTestApp(component);

    expect(
      getByText('Provide the following information to start'),
    ).toBeInTheDocument();
    expect(container.querySelector('form')).toBeInTheDocument();
    expect(queryByText(REVIEW)).not.toBeInTheDocument();

    const backBtn = getByRole('button', { name: 'Back' });
    expect(backBtn).toBeInTheDocument();
    const reviewBtn = getByRole('button', { name: 'Review' });
    expect(reviewBtn).toBeInTheDocument();
  });

  it("should submit the form, when 'submit' button is clicked", async () => {
    (useContentCard as jest.Mock).mockReturnValue({ handleSubmit: jest.fn() });
    const handleSubmitSpy = jest.spyOn(
      useContentCard(MANIFEST),
      'handleSubmit',
    );

    const user = userEvent.setup();
    const { getByRole } = await renderInTestApp(component);

    const reviewBtn = getByRole('button', { name: 'Review' });
    expect(reviewBtn).toBeInTheDocument();

    await user.click(reviewBtn);
    expect(handleSubmitSpy).toHaveBeenCalled();
  });

  it("should render 'Review' component, when form is filled (isFilled === true)", async () => {
    (useContentCard as jest.Mock).mockReturnValue({ isFilled: true });
    const { getByText, getByRole, container } = await renderInTestApp(
      component,
    );

    expect(container.querySelector('form')).not.toBeInTheDocument();
    expect(getByText(REVIEW)).toBeInTheDocument();

    const backBtn = getByRole('button', { name: 'Back' });
    expect(backBtn).toBeInTheDocument();
    expect(getByText(START)).toBeInTheDocument();
  });

  it('should call `goBack`, when the button is clicked', async () => {
    (useContentCard as jest.Mock).mockReturnValue({
      goBack: jest.fn(),
      isFilled: true,
    });
    const goBackSpy = jest.spyOn(useContentCard(MANIFEST), 'goBack');

    const user = userEvent.setup();
    const { getByRole } = await renderInTestApp(component);

    const backBtn = getByRole('button', { name: 'Back' });
    expect(backBtn).toBeInTheDocument();

    await user.click(backBtn);
    expect(goBackSpy).toHaveBeenCalled();
  });
});
