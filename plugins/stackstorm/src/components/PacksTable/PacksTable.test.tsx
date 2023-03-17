/*
 * Copyright 2023 The Backstage Authors
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
import React from 'react';
import { Pack, StackstormApi, stackstormApiRef } from '../../api';
import { PacksTable } from './PacksTable';

const packs: Pack[] = [
  {
    ref: 'chatops',
    description: 'ChatOps integration pack',
    version: '3.7.0',
  },
  {
    ref: 'core',
    description: 'Basic core actions.',
    version: '3.7.1',
  },
];

describe('PacksTable', () => {
  const mockApi: jest.Mocked<StackstormApi> = {
    getPacks: jest.fn().mockResolvedValue(packs),
  } as any;

  it('should render all packs', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[stackstormApiRef, mockApi]]}>
        <PacksTable />
      </TestApiProvider>,
    );

    packs.forEach(p => {
      expect(getByText(p.ref)).toBeInTheDocument();
      expect(getByText(p.description)).toBeInTheDocument();
      expect(getByText(p.version)).toBeInTheDocument();
    });
  });
});
