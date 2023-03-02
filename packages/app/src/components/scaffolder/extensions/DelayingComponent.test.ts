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

const manifest: TemplateParameterSchema = {
  title: 'Test',
  steps: [
    {
      title: 'First',
      schema: {
        type: 'object',
        required: ['test'],
        properties: {
          test: {
            title: 'testinput',
            type: 'string',
            'ui:field': 'DelayingComponent',
          },
        },
      },
    },
  ],
};

describe('DelayingComponent', () => {
  // eslint-disable-next-line jest/expect-expect
  it('should render without breaking', async () => {
    const { getByLabelText, navigateToNextStep, debug } = await renderInForm({
      manifest,
      extensions: [DelayingComponent],
    });

    // write in the input field
    const input = getByLabelText(/testinput/);

    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } });
    });

    await navigateToNextStep();

    debug();
  });
});
