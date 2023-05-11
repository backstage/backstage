/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { todoPlugin, EntityTodoContent } from './plugin';
import { todoApiRef } from './api';
import { EntityProvider } from '@backstage/plugin-catalog-react';

describe('todo', () => {
  it('should export plugin', () => {
    expect(todoPlugin).toBeDefined();
  });

  it('should render EntityTodoContent', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            todoApiRef,
            {
              listTodos: async () => ({
                items: [
                  {
                    tag: 'FIXME',
                    text: 'Make sure this test works',
                  },
                ],
                limit: 10,
                offset: 0,
                totalCount: 1,
              }),
            },
          ],
        ]}
      >
        <EntityProvider
          entity={{
            apiVersion: 'backstage/v1alpha1',
            kind: 'Component',
            metadata: { name: 'Test TODO' },
          }}
        >
          <Routes>
            <Route path="/" element={<EntityTodoContent />} />
          </Routes>
        </EntityProvider>
      </TestApiProvider>,
    );

    await expect(rendered.findByText('FIXME')).resolves.toBeInTheDocument();
  });
});
