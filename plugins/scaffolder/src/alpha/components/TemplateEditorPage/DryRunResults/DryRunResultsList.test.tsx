/*
 * Copyright 2022 The Backstage Authors
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
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useEffect } from 'react';
import {
  scaffolderApiRef,
  SecretsContextProvider,
} from '@backstage/plugin-scaffolder-react';
import { DryRunProvider, useDryRun } from '../DryRunContext';
import { DryRunResultsList } from './DryRunResultsList';
import { formDecoratorsApiRef } from '../../../api';

function DryRunRemote({ execute }: { execute?: number }) {
  const dryRun = useDryRun();

  useEffect(() => {
    if (execute) {
      dryRun.execute({
        templateContent: '',
        values: {},
        files: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);

  return null;
}

const mockApis = [
  [
    scaffolderApiRef,
    {
      dryRun: async () => ({
        directoryContents: [],
        log: [],
        output: {},
        steps: [],
      }),
    },
  ],
  [
    formDecoratorsApiRef,
    {
      getFormDecorators: async () => [],
    },
  ],
] as const;

describe('DryRunResultsList', () => {
  it('renders without exploding', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={mockApis}>
        <SecretsContextProvider>
          <DryRunProvider>
            <DryRunResultsList />
          </DryRunProvider>
        </SecretsContextProvider>
      </TestApiProvider>,
    );
    expect(rendered.baseElement.querySelector('ul')).toBeEmptyDOMElement();
  });

  it('adds new result items and deletes them', async () => {
    const { rerender } = await renderInTestApp(
      <TestApiProvider apis={mockApis}>
        <SecretsContextProvider>
          <DryRunProvider>
            <DryRunRemote execute={1} />
            <DryRunResultsList />
          </DryRunProvider>
        </SecretsContextProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText('Result 1')).toBeInTheDocument();
    expect(screen.queryByText('Result 2')).not.toBeInTheDocument();

    await act(async () => {
      rerender(
        <TestApiProvider apis={mockApis}>
          <SecretsContextProvider>
            <DryRunProvider>
              <DryRunRemote execute={2} />
              <DryRunResultsList />
            </DryRunProvider>
          </SecretsContextProvider>
        </TestApiProvider>,
      );
    });

    expect(screen.getByText('Result 1')).toBeInTheDocument();
    expect(screen.getByText('Result 2')).toBeInTheDocument();

    await userEvent.click(screen.getAllByLabelText('delete')[0]);

    expect(screen.queryByText('Result 1')).not.toBeInTheDocument();
    expect(screen.getByText('Result 2')).toBeInTheDocument();
  });
});
