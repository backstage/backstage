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
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useEffect } from 'react';
import {
  scaffolderApiRef,
  SecretsContextProvider,
} from '@backstage/plugin-scaffolder-react';
import { DryRunProvider, useDryRun } from '../DryRunContext';
import { DryRunResults } from './DryRunResults';
import { formDecoratorsApiRef } from '../../../api';

function DryRunRemote({
  execute,
  remove,
}: {
  execute?: boolean;
  remove?: boolean;
}) {
  const dryRun = useDryRun();

  useEffect(() => {
    if (execute) {
      dryRun.execute({
        templateContent: '',
        values: {},
        files: [],
      });
    }
    if (remove) {
      if (dryRun.selectedResult) {
        dryRun.deleteResult(dryRun.selectedResult.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute, remove]);

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

describe('DryRunResults', () => {
  it('renders without exploding', async () => {
    await renderInTestApp(
      <TestApiProvider apis={mockApis}>
        <SecretsContextProvider>
          <DryRunProvider>
            <DryRunResults />
          </DryRunProvider>
        </SecretsContextProvider>
      </TestApiProvider>,
    );
    expect(screen.getByText('Dry-run results')).toBeInTheDocument();
  });

  it('expands when dry-run result is added and toggles on click, and disappears when results are gone', async () => {
    const { rerender } = await renderInTestApp(
      <TestApiProvider apis={mockApis}>
        <SecretsContextProvider>
          <DryRunProvider>
            <DryRunRemote />
            <DryRunResults />
          </DryRunProvider>
        </SecretsContextProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText('Files')).not.toBeVisible();

    await act(async () => {
      rerender(
        <TestApiProvider apis={mockApis}>
          <SecretsContextProvider>
            <DryRunProvider>
              <DryRunRemote execute />
              <DryRunResults />
            </DryRunProvider>
          </SecretsContextProvider>
        </TestApiProvider>,
      );
    });

    expect(screen.getByText('Files')).toBeVisible();

    await userEvent.click(screen.getByText('Dry-run results'));
    await waitFor(() => expect(screen.getByText('Files')).not.toBeVisible());

    await userEvent.click(screen.getByText('Dry-run results'));
    expect(screen.getByText('Files')).toBeVisible();

    await act(async () => {
      rerender(
        <TestApiProvider apis={mockApis}>
          <SecretsContextProvider>
            <DryRunProvider>
              <DryRunRemote remove />
              <DryRunResults />
            </DryRunProvider>
          </SecretsContextProvider>
        </TestApiProvider>,
      );
    });

    await waitFor(() => expect(screen.getByText('Files')).not.toBeVisible());
  });
});
