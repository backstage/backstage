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

import { errorApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AnalyzeResult, catalogImportApiRef } from '../../api/';
import { StepInitAnalyzeUrl } from './StepInitAnalyzeUrl';

describe('<StepInitAnalyzeUrl />', () => {
  const catalogImportApi: jest.Mocked<typeof catalogImportApiRef.T> = {
    analyzeUrl: jest.fn(),
    submitPullRequest: jest.fn(),
  };

  const errorApi: jest.Mocked<typeof errorApiRef.T> = {
    post: jest.fn(),
    error$: jest.fn(),
  };

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <TestApiProvider
      apis={[
        [catalogImportApiRef, catalogImportApi],
        [errorApiRef, errorApi],
      ]}
    >
      {children}
    </TestApiProvider>
  );

  const location = {
    target: 'url',
    entities: [
      {
        kind: 'component',
        namespace: 'default',
        name: 'name',
      },
    ],
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without exploding', async () => {
    render(<StepInitAnalyzeUrl onAnalysis={() => undefined} />, {
      wrapper: Wrapper,
    });

    expect(screen.getByRole('textbox', { name: /URL/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /URL/i })).toHaveValue('');
  });

  it('should use default analysis url', async () => {
    render(
      <StepInitAnalyzeUrl
        onAnalysis={() => undefined}
        analysisUrl="https://default"
      />,
      {
        wrapper: Wrapper,
      },
    );

    expect(screen.getByRole('textbox', { name: /URL/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /URL/i })).toHaveValue(
      'https://default',
    );
  });

  it('should not analyze without url', async () => {
    const onAnalysisFn = jest.fn();

    render(<StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />, {
      wrapper: Wrapper,
    });

    await act(async () => {
      try {
        await userEvent.click(screen.getByRole('button', { name: /Analyze/i }));
      } catch {
        return;
      }
    });

    expect(catalogImportApi.analyzeUrl).toHaveBeenCalledTimes(0);
    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should not analyze invalid value', async () => {
    const onAnalysisFn = jest.fn();

    render(<StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />, {
      wrapper: Wrapper,
    });

    await act(async () => {
      await userEvent.type(
        screen.getByRole('textbox', { name: /URL/i }),
        'http:/',
      );
      await userEvent.click(screen.getByRole('button', { name: /Analyze/i }));
    });

    expect(catalogImportApi.analyzeUrl).toHaveBeenCalledTimes(0);
    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(errorApi.post).toHaveBeenCalledTimes(0);
    expect(
      screen.getByText('Must start with http:// or https://.'),
    ).toBeInTheDocument();
  });

  it('should analyze single location', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'locations',
      locations: [location],
    } as AnalyzeResult;

    render(<StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />, {
      wrapper: Wrapper,
    });

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await act(async () => {
      await userEvent.type(
        screen.getByRole('textbox', { name: /URL/i }),
        'https://my-repository',
      );
      await userEvent.click(screen.getByRole('button', { name: /Analyze/i }));
    });

    expect(onAnalysisFn).toHaveBeenCalledTimes(1);
    expect(onAnalysisFn.mock.calls[0]).toMatchObject([
      'single-location',
      'https://my-repository',
      analyzeResult,
      { prepareResult: analyzeResult },
    ]);
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should analyze multiple locations', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'locations',
      locations: [location, location],
    } as AnalyzeResult;

    render(<StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />, {
      wrapper: Wrapper,
    });

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await act(async () => {
      await userEvent.type(
        screen.getByRole('textbox', { name: /URL/i }),
        'https://my-repository-1',
      );
      await userEvent.click(screen.getByRole('button', { name: /Analyze/i }));
    });

    expect(onAnalysisFn).toHaveBeenCalledTimes(1);
    expect(onAnalysisFn.mock.calls[0]).toMatchObject([
      'multiple-locations',
      'https://my-repository-1',
      analyzeResult,
    ]);
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should not analyze with no locations', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'locations',
      locations: [],
    } as AnalyzeResult;

    render(<StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />, {
      wrapper: Wrapper,
    });

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await act(async () => {
      await userEvent.type(
        screen.getByRole('textbox', { name: /URL/i }),
        'https://my-repository-1',
      );
      await userEvent.click(screen.getByRole('button', { name: /Analyze/i }));
    });

    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(
      screen.getByText('There are no entities at this location'),
    ).toBeInTheDocument();
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should analyze repository', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'repository',
      url: 'https://my-repository-2',
      integrationType: 'github',
      generatedEntities: [
        {
          apiVersion: '1',
          kind: 'component',
          metadata: {
            name: 'component-a',
          },
        },
      ],
    } as AnalyzeResult;

    render(<StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />, {
      wrapper: Wrapper,
    });

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await act(async () => {
      await userEvent.type(
        screen.getByRole('textbox', { name: /URL/i }),
        'https://my-repository-2',
      );
      await userEvent.click(screen.getByRole('button', { name: /Analyze/i }));
    });

    expect(onAnalysisFn).toHaveBeenCalledTimes(1);
    expect(onAnalysisFn.mock.calls[0]).toMatchObject([
      'no-location',
      'https://my-repository-2',
      analyzeResult,
    ]);
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should not analyze repository without entities', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'repository',
      url: 'https://my-repository-2',
      integrationType: 'github',
      generatedEntities: [],
    } as AnalyzeResult;

    render(<StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />, {
      wrapper: Wrapper,
    });

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await act(async () => {
      await userEvent.type(
        screen.getByRole('textbox', { name: /URL/i }),
        'https://my-repository-2',
      );
      await userEvent.click(screen.getByRole('button', { name: /Analyze/i }));
    });

    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(
      screen.getByText("Couldn't generate entities for your repository"),
    ).toBeInTheDocument();
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should not analyze repository if disabled', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'repository',
      url: 'https://my-repository-2',
      integrationType: 'github',
      generatedEntities: [
        {
          apiVersion: '1',
          kind: 'component',
          metadata: {
            name: 'component-a',
          },
        },
      ],
    } as AnalyzeResult;

    render(
      <StepInitAnalyzeUrl onAnalysis={onAnalysisFn} disablePullRequest />,
      {
        wrapper: Wrapper,
      },
    );

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await act(async () => {
      await userEvent.type(
        screen.getByRole('textbox', { name: /URL/i }),
        'https://my-repository-2',
      );
      await userEvent.click(screen.getByRole('button', { name: /Analyze/i }));
    });

    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(
      screen.getByText("Couldn't generate entities for your repository"),
    ).toBeInTheDocument();
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should report unknown type to the errorapi', async () => {
    const onAnalysisFn = jest.fn();

    render(<StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />, {
      wrapper: Wrapper,
    });

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve({ type: 'unknown' } as any as AnalyzeResult),
    );

    await act(async () => {
      await userEvent.type(
        screen.getByRole('textbox', { name: /URL/i }),
        'https://my-repository-2',
      );
      await userEvent.click(screen.getByRole('button', { name: /Analyze/i }));
    });

    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(
      screen.getByText(
        'Received unknown analysis result of type unknown. Please contact the support team.',
      ),
    ).toBeInTheDocument();
    expect(errorApi.post).toHaveBeenCalledTimes(1);
    expect(errorApi.post.mock.calls[0][0]).toMatchObject(
      new Error(
        'Received unknown analysis result of type unknown. Please contact the support team.',
      ),
    );
  });
});
