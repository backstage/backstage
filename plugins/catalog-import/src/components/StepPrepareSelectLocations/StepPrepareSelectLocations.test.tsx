/*
 * Copyright 2020 The Backstage Authors
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

import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AnalyzeResult } from '../../api';
import { StepPrepareSelectLocations } from './StepPrepareSelectLocations';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

describe('<StepPrepareSelectLocations />', () => {
  const analyzeResult = {
    type: 'locations',
    locations: [
      {
        target: 'url-1',
        entities: [
          {
            kind: 'component',
            namespace: 'default',
            name: 'name',
          },
        ],
      },
      {
        target: 'url-2',
        entities: [
          {
            kind: 'component',
            namespace: 'default',
            name: 'name',
          },
          {
            kind: 'api',
            namespace: 'default',
            name: 'name',
          },
        ],
      },
    ],
  } as Extract<AnalyzeResult, { type: 'locations' }>;

  const catalogApi = catalogApiMock();
  let Wrapper: React.ComponentType<React.PropsWithChildren<{}>>;

  beforeEach(() => {
    jest.resetAllMocks();
    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi }),
          ],
        ]}
      >
        {children}
      </TestApiProvider>
    );
  });

  it('renders display locations to be added', async () => {
    await renderInTestApp(
      <Wrapper>
        <StepPrepareSelectLocations
          analyzeResult={analyzeResult}
          onPrepare={() => undefined}
          onGoBack={() => undefined}
        />
      </Wrapper>,
    );

    expect(screen.getByText('url-1')).toBeInTheDocument();
    expect(screen.getByText('url-2')).toBeInTheDocument();
    expect(
      screen.getByText(/Select one or more locations/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/locations already exist/),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Review/i })).toBeDisabled();
  });

  it('should display existing locations only', async () => {
    const analyzeResultWithExistingLocation = {
      type: 'locations',
      locations: [
        {
          target: 'my-target',
          exists: true,
          entities: [
            {
              kind: 'component',
              namespace: 'default',
              name: 'name',
            },
          ],
        },
      ],
    } as Extract<AnalyzeResult, { type: 'locations' }>;

    await renderInTestApp(
      <Wrapper>
        <StepPrepareSelectLocations
          analyzeResult={analyzeResultWithExistingLocation}
          onPrepare={() => undefined}
          onGoBack={() => undefined}
        />
      </Wrapper>,
    );

    expect(screen.getByText(/my-target/)).toBeInTheDocument();
    expect(screen.getByText(/locations already exist/)).toBeInTheDocument();
    expect(
      screen.queryByText(/Select one or more locations/),
    ).not.toBeInTheDocument();
  });

  it('should select and deselect all', async () => {
    await renderInTestApp(
      <Wrapper>
        <StepPrepareSelectLocations
          analyzeResult={analyzeResult}
          onPrepare={() => undefined}
          onGoBack={() => undefined}
        />
      </Wrapper>,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(c => expect(c).not.toBeChecked());
    expect(screen.getByRole('button', { name: /Review/i })).toBeDisabled();

    await act(async () => {
      await userEvent.click(
        screen.getByRole('button', { name: /Select All/i }),
      );
    });

    checkboxes.forEach(c => expect(c).toBeChecked());
    expect(screen.getByRole('button', { name: /Review/i })).not.toBeDisabled();

    await act(async () => {
      await userEvent.click(
        screen.getByRole('button', { name: /Select All/i }),
      );
    });

    checkboxes.forEach(c => expect(c).not.toBeChecked());
    expect(screen.getByRole('button', { name: /Review/i })).toBeDisabled();
  });

  it('should preselect prepared locations', async () => {
    await renderInTestApp(
      <Wrapper>
        <StepPrepareSelectLocations
          analyzeResult={analyzeResult}
          prepareResult={{
            ...analyzeResult,
            locations: [...analyzeResult.locations.slice(0, 1)],
          }}
          onPrepare={() => undefined}
          onGoBack={() => undefined}
        />
      </Wrapper>,
    );

    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });

  it('should select items', async () => {
    await renderInTestApp(
      <Wrapper>
        <StepPrepareSelectLocations
          analyzeResult={analyzeResult}
          onPrepare={() => undefined}
          onGoBack={() => undefined}
        />
      </Wrapper>,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(c => expect(c).not.toBeChecked());

    await act(async () => {
      await userEvent.click(checkboxes[1]);
    });

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();

    await act(async () => {
      await userEvent.click(checkboxes[1]);
    });

    checkboxes.forEach(c => expect(c).not.toBeChecked());
  });

  it('should go back', async () => {
    const onGoBack = jest.fn();

    await renderInTestApp(
      <Wrapper>
        <StepPrepareSelectLocations
          analyzeResult={analyzeResult}
          onPrepare={() => undefined}
          onGoBack={onGoBack}
        />
      </Wrapper>,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Back/i }));
    });

    expect(onGoBack).toHaveBeenCalledTimes(1);
  });

  it('should submit', async () => {
    const onPrepare = jest.fn();

    await renderInTestApp(
      <Wrapper>
        <StepPrepareSelectLocations
          analyzeResult={analyzeResult}
          onPrepare={onPrepare}
          onGoBack={() => undefined}
        />
      </Wrapper>,
    );

    const checkboxes = screen.getAllByRole('checkbox');

    await act(async () => {
      await userEvent.click(checkboxes[1]);
    });

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Review/i }));
    });

    expect(onPrepare).toHaveBeenCalledTimes(1);
    expect(onPrepare.mock.calls[0][0]).toMatchObject({
      type: 'locations',
      locations: [
        {
          target: 'url-1',
          entities: [
            {
              kind: 'component',
              namespace: 'default',
              name: 'name',
            },
          ],
        },
      ],
    } as Extract<AnalyzeResult, { type: 'locations' }>);
  });
});
