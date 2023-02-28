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
import { Action, Pack, StackstormApi, stackstormApiRef } from '../../api';
import { ActionsList, PackListItem } from './ActionsList';

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

const actions: Action[] = [
  {
    id: '62fe101b11935b6aaff4ff96',
    name: 'announcement',
    ref: 'core.announcement',
    pack: 'core',
    description:
      'Action that broadcasts the announcement to all stream consumers.',
    runner_type: 'broadcast',
  },
  {
    id: '62fe101b11935b6aaff4ff97',
    name: 'echo',
    ref: 'core.echo',
    pack: 'core',
    description:
      'Action that executes the Linux echo command on the localhost.',
    runner_type: 'local-shell-cmd',
  },
];

describe('ActionsList', () => {
  const mockApi: jest.Mocked<StackstormApi> = {
    getPacks: jest.fn().mockResolvedValue(packs),
    getActions: jest.fn().mockResolvedValue(actions),
    getActionUrl: jest
      .fn()
      .mockResolvedValue(
        'http://stackstorm.example.com:8080/?#/actions/core.action',
      ),
  } as any;

  it('should render all packs', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[stackstormApiRef, mockApi]]}>
        <ActionsList />
      </TestApiProvider>,
    );

    packs.forEach(p => {
      expect(getByText(p.ref)).toBeInTheDocument();
      expect(getByText(p.description)).toBeInTheDocument();
    });
  });

  it('should render all pack actions', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[stackstormApiRef, mockApi]]}>
        <PackListItem pack={packs[1]} opened onClick={() => {}} />
      </TestApiProvider>,
    );

    actions.forEach(a => {
      expect(getByText(a.name)).toBeInTheDocument();
      expect(getByText(a.runner_type)).toBeInTheDocument();
    });
  });
});
