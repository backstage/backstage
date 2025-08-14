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
  SecretsContextProvider,
  useTemplateSecrets,
} from '@backstage/plugin-scaffolder-react';
import { SecretInput } from './SecretInput';
import { renderInTestApp } from '@backstage/test-utils';
import { ScaffolderRJSFFormProps as FormProps } from '@backstage/plugin-scaffolder-react';
import { Form } from '@backstage/plugin-scaffolder-react/alpha';
import validator from '@rjsf/validator-ajv8';
import { fireEvent, act, waitFor } from '@testing-library/react';

describe('<SecretInput />', () => {
  const SecretsComponent = () => {
    const { secrets } = useTemplateSecrets();
    return (
      <div data-testid="current-secrets">{JSON.stringify({ secrets })}</div>
    );
  };

  it('should set the secret value to the unmasked value', async () => {
    const mockSecret = 'backstage';
    const onSubmit = jest.fn();

    const { getByLabelText, getByTestId } = await renderInTestApp(
      <SecretsContextProvider>
        <Form
          validator={validator}
          schema={{
            properties: { myKey: { type: 'string', title: 'secret' } },
          }}
          uiSchema={{
            myKey: {
              'ui:field': 'Secret',
            },
          }}
          fields={{
            Secret: SecretInput,
          }}
          onSubmit={onSubmit}
        />
        <SecretsComponent />
      </SecretsContextProvider>,
    );

    const secretInput = getByLabelText('secret');

    await act(async () => {
      fireEvent.change(secretInput, { target: { value: mockSecret } });
    });

    // Wait for the debounced update to occur
    await waitFor(
      () => {
        const { secrets } = JSON.parse(
          getByTestId('current-secrets').textContent!,
        );
        expect(secrets.myKey).toBe(mockSecret);
      },
      { timeout: 500 },
    );
  });

  describe('SecretInput description', () => {
    const description = {
      fromSchema: 'MyGroupsPicker description from schema',
      fromUiSchema: 'MyGroupsPicker description from uiSchema',
    } as { fromSchema: string; fromUiSchema: string };

    it('omits description', async () => {
      const props = {
        validator,
        schema: {
          properties: { myKey: { type: 'string', title: 'secret' } },
        },
        uiSchema: {
          myKey: {
            'ui:field': 'Secret',
          },
        },
        fields: {
          Secret: SecretInput,
        },
      } as unknown as FormProps<any>;

      const { queryByText } = await renderInTestApp(
        <SecretsContextProvider>
          <Form {...props} />
          <SecretsComponent />
        </SecretsContextProvider>,
      );
      expect(queryByText(description.fromSchema)).toBe(null);
      expect(queryByText(description.fromUiSchema)).toBe(null);
    });

    it('presents schema description', async () => {
      const props = {
        validator,
        schema: {
          properties: { myKey: { type: 'string', title: 'secret' } },
          description: description.fromSchema,
        },
        uiSchema: {
          myKey: {
            'ui:field': 'Secret',
          },
        },
        fields: {
          Secret: SecretInput,
        },
      } as unknown as FormProps<any>;

      const { getByText, queryByText } = await renderInTestApp(
        <SecretsContextProvider>
          <Form {...props} />
          <SecretsComponent />
        </SecretsContextProvider>,
      );
      expect(getByText(description.fromSchema)).toBeInTheDocument();
      expect(queryByText(description.fromUiSchema)).toBe(null);
    });

    it('presents uiSchema description', async () => {
      const props = {
        validator,
        schema: {
          properties: { myKey: { type: 'string', title: 'secret' } },
          description: description.fromSchema,
        },
        uiSchema: {
          myKey: {
            'ui:field': 'Secret',
          },
          'ui:description': description.fromUiSchema,
        },
        fields: {
          Secret: SecretInput,
        },
      } as unknown as FormProps<any>;

      const { getByText, queryByText } = await renderInTestApp(
        <SecretsContextProvider>
          <Form {...props} />
          <SecretsComponent />
        </SecretsContextProvider>,
      );
      expect(queryByText(description.fromSchema)).toBe(null);
      expect(getByText(description.fromUiSchema)).toBeInTheDocument();
    });
  });
});
