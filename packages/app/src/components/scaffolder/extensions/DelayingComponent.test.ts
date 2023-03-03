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
import { renderInForm } from '@backstage/scaffolder-test-utils/alpha';
import { DelayingComponent } from './DelayingComponent';
import { TemplateParameterSchema } from '@backstage/plugin-scaffolder-react';
import { act, fireEvent } from '@testing-library/react';

jest.setTimeout(30000);

const manifest: TemplateParameterSchema = {
  title: 'Test',
  steps: [
    {
      title: 'First',
      schema: {
        properties: {
          input: {
            type: 'object',
            title: 'input field',
            required: ['test'],
            'ui:field': 'DelayingComponent',
            properties: {
              test: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  ],
};

describe('DelayingComponent', () => {
  it('should render without breaking', async () => {
    const { getByLabelText, autoCompleteForm, getFormData } =
      await renderInForm({
        manifest,
        extensions: [DelayingComponent],
      });

    await act(async () => {
      fireEvent.input(getByLabelText(/input field/), {
        target: { value: 'pass' },
      });
    });

    await autoCompleteForm();

    expect(await getFormData()).toEqual({ input: { test: 'pass' } });
  });
});
