/*
 * Copyright 2024 The Backstage Authors
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
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { ApiProvider } from '@backstage/core-app-api';
import { DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS } from '../../../extensions/default';
import { TemplateEditorToolbar } from './TemplateEditorToolbar';

describe('TemplateEditorToolbar', () => {
  const fieldExtensions = DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS;

  const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
    scaffold: jest.fn(),
    cancelTask: jest.fn(),
    getTemplateParameterSchema: jest.fn(),
    getIntegrationsList: jest.fn(),
    getTask: jest.fn(),
    streamLogs: jest.fn(),
    listActions: jest.fn(),
    listTasks: jest.fn(),
    listTemplateExtensions: jest.fn(),
    autocomplete: jest.fn(),
  };

  scaffolderApiMock.listActions.mockResolvedValue([
    {
      id: 'action:example',
      description: 'Example description',
      schema: {
        input: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              title: 'Inform the title',
              type: 'string',
            },
          },
        },
      },
    },
  ]);

  const apis = TestApiRegistry.from([scaffolderApiRef, scaffolderApiMock]);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show instructions for publishing changes', async () => {
    await renderInTestApp(<TemplateEditorToolbar />);
    await userEvent.click(screen.getByRole('button', { name: 'Publish' }));
    expect(
      screen.getByRole('heading', { name: 'Publish changes' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Follow the instructions below to create or update a template:',
      ),
    ).toBeInTheDocument();
  });

  it('should open the custom fields explorer', async () => {
    await renderInTestApp(
      <TemplateEditorToolbar fieldExtensions={fieldExtensions} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Custom Fields Explorer' }),
    );
    expect(
      screen.getByPlaceholderText('Choose Custom Field Extension'),
    ).toHaveValue('EntityPicker');
    expect(
      screen.getByRole('heading', { name: 'Template Spec' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Field Preview' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Field Options' }),
    ).toBeInTheDocument();
  });

  it('should open the installed actions documentation', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <TemplateEditorToolbar />
      </ApiProvider>,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Installed Actions Documentation' }),
    );

    expect(screen.getByLabelText('Search for an action')).toBeInTheDocument();
    expect(screen.getByText('action:example')).toBeInTheDocument();
    expect(screen.getByText('Example description')).toBeInTheDocument();
    expect(screen.getByText('Inform the title')).toBeInTheDocument();
  });

  it('should accept custom toolbar actions', async () => {
    await renderInTestApp(
      <TemplateEditorToolbar>
        <button>Custom action</button>
      </TemplateEditorToolbar>,
    );

    expect(
      screen.getByRole('button', { name: 'Custom action' }),
    ).toBeInTheDocument();
  });
});
