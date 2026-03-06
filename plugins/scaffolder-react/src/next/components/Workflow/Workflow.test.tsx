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
  mockApis,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { act, fireEvent } from '@testing-library/react';
import { Workflow } from './Workflow';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import { ScaffolderApi, scaffolderApiRef } from '../../../api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
  cancelTask: jest.fn(),
  scaffold: jest.fn(),
  getTemplateParameterSchema: jest.fn(),
  getIntegrationsList: jest.fn(),
  getTask: jest.fn(),
  streamLogs: jest.fn(),
  listActions: jest.fn(),
  listTasks: jest.fn(),
  autocomplete: jest.fn(),
};

const catalogApi = catalogApiMock.mock();

const analyticsMock = mockApis.analytics();
const apis = TestApiRegistry.from(
  [scaffolderApiRef, scaffolderApiMock],
  [catalogApiRef, catalogApi],
  [analyticsApiRef, analyticsMock],
);

const defaultSchema = {
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
  ],
  title: 'Test Template',
};

describe('<Workflow />', () => {
  describe('description card', () => {
    it('should show the description card when showDescription is true and description is provided', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue(
        defaultSchema,
      );

      const { getByText } = await renderInTestApp(
        <ApiProvider apis={apis}>
          <Workflow
            onCreate={jest.fn()}
            onError={jest.fn()}
            namespace="default"
            templateName="docs-template"
            extensions={[]}
            showDescription
            description="## My description"
            title="My Template"
          />
        </ApiProvider>,
      );

      expect(getByText('My Template')).toBeInTheDocument();
      expect(getByText('My description')).toBeInTheDocument();
    });

    it('should not show the description card when showDescription is false', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue(
        defaultSchema,
      );

      const { queryByText } = await renderInTestApp(
        <ApiProvider apis={apis}>
          <Workflow
            onCreate={jest.fn()}
            onError={jest.fn()}
            namespace="default"
            templateName="docs-template"
            extensions={[]}
            showDescription={false}
            description="## My description"
            title="My Template"
          />
        </ApiProvider>,
      );

      expect(queryByText('My description')).not.toBeInTheDocument();
    });

    it('should fall back to the manifest description when no description prop is provided', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
        ...defaultSchema,
        description: 'Description from manifest',
      });

      const { getByText } = await renderInTestApp(
        <ApiProvider apis={apis}>
          <Workflow
            onCreate={jest.fn()}
            onError={jest.fn()}
            namespace="default"
            templateName="docs-template"
            extensions={[]}
            showDescription
            title="My Template"
          />
        </ApiProvider>,
      );

      expect(getByText('Description from manifest')).toBeInTheDocument();
    });

    it('should show "No description" when neither description prop nor manifest description is provided', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue(
        defaultSchema,
      );

      const { getByText } = await renderInTestApp(
        <ApiProvider apis={apis}>
          <Workflow
            onCreate={jest.fn()}
            onError={jest.fn()}
            namespace="default"
            templateName="docs-template"
            extensions={[]}
            showDescription
            title="My Template"
          />
        </ApiProvider>,
      );

      expect(getByText('No description')).toBeInTheDocument();
    });

    it('should call onHideDescription when the hide button is clicked', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue(
        defaultSchema,
      );

      const onHideDescription = jest.fn();

      const { getByTitle } = await renderInTestApp(
        <ApiProvider apis={apis}>
          <Workflow
            onCreate={jest.fn()}
            onError={jest.fn()}
            namespace="default"
            templateName="docs-template"
            extensions={[]}
            showDescription
            description="## My description"
            title="My Template"
            onHideDescription={onHideDescription}
          />
        </ApiProvider>,
      );

      await act(async () => {
        fireEvent.click(getByTitle('Hide description'));
      });

      expect(onHideDescription).toHaveBeenCalledTimes(1);
    });
  });

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
