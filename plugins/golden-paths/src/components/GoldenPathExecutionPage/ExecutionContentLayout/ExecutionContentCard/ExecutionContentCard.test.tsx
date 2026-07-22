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
import { ExecutionContentCard } from './ExecutionContentCard';
import { render } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import { goldenPathsApiRef } from '@backstage/plugin-golden-paths-react';
import { useGoldenPathTaskContext } from '../../useGoldenPathTaskContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@backstage/plugin-scaffolder-react', () => ({
  SecretsContextProvider: ({ children }: PropsWithChildren) => <>{children}</>,
}));

const FORM = 'Narsil';
jest.mock('./TemplateForm', () => ({
  TemplateForm: () => <>{FORM}</>,
}));

jest.mock('@backstage/plugin-permission-react', () => ({
  RequirePermission: ({ children }: PropsWithChildren) => <>{children}</>,
}));

const PROCESSING = 'Glamdring';
jest.mock('./TemplateProcessing', () => ({
  TemplateProcessing: () => <>{PROCESSING}</>,
}));

jest.mock('../../useGoldenPathTaskContext', () => ({
  useGoldenPathTaskContext: jest.fn(() => ({
    value: {
      stepPhase: 'form',
      goldenPathTask: { status: 'active', spec: { steps: [{}] } },
      stepIndex: 0,
      mappedStatuses: [{ status: 'open' }],
    },
  })),
}));

const mockGoldenPathsApi = {
  /* mock methods as needed */
};

describe('ExecutionContentCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render TemplateForm by default', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <TestApiProvider apis={[[goldenPathsApiRef, mockGoldenPathsApi]]}>
          <ExecutionContentCard />
        </TestApiProvider>
      </MemoryRouter>,
    );

    expect(getByText(FORM)).toBeInTheDocument();
  });

  it("should render TemplateProcessing when `phase === 'processing'`", () => {
    (useGoldenPathTaskContext as jest.Mock).mockReturnValue({
      value: {
        stepPhase: 'processing',
        goldenPathTask: { status: 'active', spec: { steps: [] } },
        stepIndex: 0,
        mappedStatuses: [],
      },
    });

    const { getByText } = render(
      <MemoryRouter>
        <TestApiProvider apis={[[goldenPathsApiRef, mockGoldenPathsApi]]}>
          <ExecutionContentCard />
        </TestApiProvider>
      </MemoryRouter>,
    );

    expect(getByText(PROCESSING)).toBeInTheDocument();
  });

  it('should render nothing when `phase` is other value', () => {
    (useGoldenPathTaskContext as jest.Mock).mockReturnValue({
      value: {
        stepPhase: 'other',
        goldenPathTask: { status: 'active', spec: { steps: [] } },
        stepIndex: 0,
        mappedStatuses: [],
      },
    });

    const { queryByText } = render(
      <MemoryRouter>
        <TestApiProvider apis={[[goldenPathsApiRef, mockGoldenPathsApi]]}>
          <ExecutionContentCard />
        </TestApiProvider>
      </MemoryRouter>,
    );

    expect(queryByText(FORM)).not.toBeInTheDocument();
    expect(queryByText(PROCESSING)).not.toBeInTheDocument();
  });
});
