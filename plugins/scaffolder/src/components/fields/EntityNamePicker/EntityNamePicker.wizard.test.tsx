/*
 * Copyright 2026 The Backstage Authors
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
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { EmbeddableWorkflow } from '@backstage/plugin-scaffolder-react/alpha';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { EntityNamePicker } from './EntityNamePicker';
import { entityNamePickerValidation } from './validation';

it('completes a workflow with a standard first-page validator without revisiting it', async () => {
  const onCreate = jest.fn();
  const validate = jest.fn(entityNamePickerValidation);
  const manifest = {
    title: 'Standard project',
    steps: [
      {
        title: 'Project',
        schema: {
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              title: 'Project name',
              'ui:field': 'EntityNamePicker',
            },
          },
        },
      },
      {
        title: 'Environment',
        schema: { properties: { environment: { type: 'string' } } },
      },
    ],
  };
  await renderInTestApp(
    <TestApiProvider
      apis={[
        [
          scaffolderApiRef,
          { getTemplateParameterSchema: async () => manifest },
        ],
        [catalogApiRef, { getEntityByRef: async () => undefined }],
      ]}
    >
      <EmbeddableWorkflow
        namespace="default"
        templateName="project"
        onCreate={onCreate}
        onError={() => null}
        extensions={[
          {
            name: 'EntityNamePicker',
            component: EntityNamePicker,
            validation: validate,
          },
        ]}
      />
    </TestApiProvider>,
  );
  fireEvent.change(
    await screen.findByRole('textbox', { name: /Project name/ }),
    { target: { value: 'my-project' } },
  );
  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  fireEvent.change(
    await screen.findByRole('textbox', { name: 'environment' }),
    { target: { value: 'development' } },
  );
  fireEvent.click(screen.getByRole('button', { name: 'Review' }));
  await screen.findByRole('button', { name: 'Create' });
  expect(
    screen.queryByRole('textbox', { name: /Project name/ }),
  ).not.toBeInTheDocument();
  expect(validate).toHaveBeenCalledTimes(2);
  fireEvent.click(screen.getByRole('button', { name: 'Create' }));
  await waitFor(() =>
    expect(onCreate).toHaveBeenCalledWith({
      name: 'my-project',
      environment: 'development',
    }),
  );
});
