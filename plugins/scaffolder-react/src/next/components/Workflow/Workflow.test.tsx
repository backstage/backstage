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

import { ApiProvider } from '@backstage/core-app-api';
import {
  MockAnalyticsApi,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { act, fireEvent } from '@testing-library/react';
import React from 'react';
import { Workflow } from './Workflow';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import { ScaffolderApi, scaffolderApiRef } from '../../../api';

const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
  cancelTask: jest.fn(),
  scaffold: jest.fn(),
  getTemplateParameterSchema: jest.fn(),
  getIntegrationsList: jest.fn(),
  getTask: jest.fn(),
  streamLogs: jest.fn(),
  listActions: jest.fn(),
  listTasks: jest.fn(),
};

const analyticsMock = new MockAnalyticsApi();
const apis = TestApiRegistry.from(
  [scaffolderApiRef, scaffolderApiMock],
  [analyticsApiRef, analyticsMock],
);

describe('<Workflow />', () => {
  it('should complete a workflow', async () => {
    const onCreate = jest.fn();
    const onError = jest.fn();
    scaffolderApiMock.scaffold.mockResolvedValue({ taskId: 'xyz' });

    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
      steps: [
        {
          title: 'Step 1',
          schema: {
            properties: {
              name: {
                type: 'string',
              },
            },
          },
        },
        {
          title: 'Step 2',
          schema: {
            properties: {
              age: {
                type: 'string',
              },
            },
          },
        },
      ],
      title: 'React JSON Schema Form Test',
    });

    const { getByRole, getAllByRole, getByText } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <Workflow
          title="Different title than template"
          description={`
      ## This is markdown
      - overriding the template description
            `}
          onCreate={onCreate}
          onError={onError}
          namespace="default"
          templateName="docs-template"
          initialState={{
            name: 'prefilled-name',
            age: '53',
          }}
          components={{
            ReviewStateComponent: () => (
              <h1>This is a different wrapper for the review page</h1>
            ),
            reviewButtonText: <i>Onwards</i>,
            createButtonText: <b>Make</b>,
          }}
          extensions={[]}
        />
      </ApiProvider>,
    );

    // Test template title is overriden
    expect(getByRole('heading', { level: 2 }).innerHTML).toBe(
      'Different title than template',
    );

    const nameInput = getByRole('textbox', {
      name: 'name',
    }) as HTMLInputElement;

    expect(nameInput).toBeInTheDocument();

    expect(nameInput.value).toBe('prefilled-name');

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    const ageInput = getByRole('textbox', { name: 'age' }) as HTMLInputElement;

    expect(ageInput.value).toBe('53');

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Onwards' }));
    });

    expect(
      getByText('This is a different wrapper for the review page'),
    ).toBeDefined();

    await act(async () => {
      fireEvent.click(getAllByRole('button')[1] as HTMLButtonElement);
    });

    expect(onCreate).toHaveBeenCalledWith({
      name: 'prefilled-name',
      age: '53',
    });
  });
});
