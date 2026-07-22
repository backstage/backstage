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
import { render, screen } from '@testing-library/react';
import { useApi } from '@backstage/core-plugin-api';
import { RecentlyVisitedGoldenPathCard } from './RecentlyVisitedCard';
import useAsync from 'react-use/esm/useAsync';
import { TaskSpecV1beta1 } from '@backstage/plugin-golden-paths-common';

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn(),
}));

jest.mock('@backstage/plugin-golden-paths-react', () => ({
  goldenPathsApiRef: {},
}));

jest.mock('react-use/esm/useAsync', () => jest.fn());

jest.mock('@backstage/core-components', () => ({
  Gauge: jest.fn(() => <div>Gauge</div>),
  LinkButton: jest.fn(() => <div>LinkButton</div>),
}));

const taskSpec: TaskSpecV1beta1 = {
  apiVersion: 'backstage.io/v1beta1',
  parameters: {},
  steps: [
    { id: 'step1', name: 'Step 1', template: 'template1' },
    { id: 'step2', name: 'Step 2', template: 'template2' },
  ],
  goldenPathInfo: {
    entityRef: 'example-entity-ref',
    entity: {
      metadata: {
        name: 'example-name',
        title: 'Example Title',
      },
    },
  },
};

describe('RecentlyVisitedGoldenPathCard', () => {
  const mockGoldenPathsApi = {
    listGoldenPathSteps: jest.fn(),
  };

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue(mockGoldenPathsApi);
  });

  it('renders loading state', () => {
    (useAsync as jest.Mock).mockReturnValue({ loading: true });
    render(
      <RecentlyVisitedGoldenPathCard
        id="1"
        spec={taskSpec}
        createdAt="2025-05-07T00:00:00Z"
        status="processing"
      />,
    );
    expect(screen.queryByText('Gauge')).not.toBeInTheDocument();
    expect(screen.queryByText('LinkButton')).not.toBeInTheDocument();
  });

  it('renders card with first step active when no statuses', () => {
    (useAsync as jest.Mock).mockReturnValue({
      value: { statuses: [] },
      loading: false,
    });
    render(
      <RecentlyVisitedGoldenPathCard
        id="1"
        spec={taskSpec}
        createdAt="2025-05-07T00:00:00Z"
        status="completed"
      />,
    );
    expect(screen.getByText('Example Title')).toBeInTheDocument();
    expect(screen.getByText('1. Step 1')).toBeInTheDocument();
    expect(screen.getByText('Gauge')).toBeInTheDocument();
    expect(screen.getByText('LinkButton')).toBeInTheDocument();
  });

  it('renders card with active step', () => {
    (useAsync as jest.Mock).mockReturnValue({
      value: { statuses: [{ status: 'completed' }] },
    });
    render(
      <RecentlyVisitedGoldenPathCard
        id="1"
        spec={taskSpec}
        createdAt="2025-05-07T00:00:00Z"
        status="processing"
      />,
    );

    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === 'div' &&
          content.includes('Example Title')
        );
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === 'p' && content.includes('Step 2')
        );
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Gauge')).toBeInTheDocument();
    expect(screen.getByText('LinkButton')).toBeInTheDocument();
  });

  it('renders card when status is processing', () => {
    (useAsync as jest.Mock).mockReturnValue({
      value: { statuses: [{ status: 'completed' }] },
    });
    const { container } = render(
      <RecentlyVisitedGoldenPathCard
        id="1"
        spec={taskSpec}
        createdAt="2025-05-07T00:00:00Z"
        status="processing"
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
