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
import { scaffolderApiRef } from '../../../api';
import { DryRunProvider, useDryRun } from '../DryRunContext';
import { DryRunResultsList } from './DryRunResultsList';

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

const mockScaffolderApi = {
  dryRun: async () => ({
    directoryContents: [],
    log: [],
    output: {},
    steps: [],
  }),
};

describe('DryRunResultsList', () => {
  it('renders without exploding', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <DryRunProvider>
          <DryRunResultsList />
        </DryRunProvider>
      </TestApiProvider>,
    );
    expect(rendered.baseElement.querySelector('ul')).toBeEmptyDOMElement();
  });

  it('adds new result items and deletes them', async () => {
    const { rerender } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <DryRunProvider>
          <DryRunRemote execute={1} />
          <DryRunResultsList />
        </DryRunProvider>
      </TestApiProvider>,
    );

    expect(screen.queryByText('Result 1')).toBeInTheDocument();
    expect(screen.queryByText('Result 2')).not.toBeInTheDocument();

    await act(async () => {
      rerender(
        <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
          <DryRunProvider>
            <DryRunRemote execute={2} />
            <DryRunResultsList />
          </DryRunProvider>
        </TestApiProvider>,
      );
    });

    expect(screen.queryByText('Result 1')).toBeInTheDocument();
    expect(screen.queryByText('Result 2')).toBeInTheDocument();

    await userEvent.click(screen.getAllByLabelText('delete')[0]);

    expect(screen.queryByText('Result 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Result 2')).toBeInTheDocument();
  });
});
