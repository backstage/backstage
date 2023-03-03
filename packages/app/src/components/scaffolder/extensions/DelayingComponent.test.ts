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
import {
  renderExtension,
  renderInForm,
} from '@backstage/scaffolder-test-utils/alpha';
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
  it('should render the extension without breaking', async () => {
    const { getByLabelText, validate } = await renderExtension(
      DelayingComponent,
    );

    await act(async () => {
      fireEvent.input(getByLabelText(/DelayingComponent/), {
        target: { value: 'pass' },
      });
    });

    const { errors, formData } = await validate();
    expect(errors).toHaveLength(0);
    expect(formData).toEqual({ DelayingComponent: 'pass' });
  });

  it('should throw an error if the input is not valid', async () => {
    const { getByLabelText, validate } = await renderExtension(
      DelayingComponent,
    );

    await act(async () => {
      fireEvent.input(getByLabelText(/DelayingComponent/), {
        target: { value: 'fail' },
      });
    });

    const { errors, formData } = await validate();
    expect(formData).toEqual({ DelayingComponent: 'fail' });
    expect(errors).toContain('value was not equal to pass');
  });
});
