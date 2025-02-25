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
import { Form } from '@backstage/plugin-scaffolder-react/alpha';
import validator from '@rjsf/validator-ajv8';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  scmIntegrationsApiRef,
  ScmIntegrationsApi,
  scmAuthApiRef,
  ScmAuthApi,
} from '@backstage/integration-react';

import {
  SecretsContextProvider,
  scaffolderApiRef,
  useTemplateSecrets,
  ScaffolderRJSFField,
} from '@backstage/plugin-scaffolder-react';
import { act, fireEvent, screen } from '@testing-library/react';
import { RepoBranchPicker } from './RepoBranchPicker';

describe('RepoBranchPicker', () => {
  const mockIntegrationsApi: Partial<ScmIntegrationsApi> = {
    byHost: () => ({ type: 'bitbucket' }),
  };

  let mockScmAuthApi: Partial<ScmAuthApi>;

  beforeEach(() => {
    mockScmAuthApi = {
      getCredentials: jest.fn().mockResolvedValue({ token: 'abc123' }),
    };
  });

  describe('happy path rendering', () => {
    it('should render the repo branch picker with minimal props', async () => {
      const onSubmit = jest.fn();

      const { getByRole } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, {}],
            [scaffolderApiRef, {}],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{ 'ui:field': 'RepoBranchPicker' }}
              fields={{
                RepoBranchPicker:
                  RepoBranchPicker as ScaffolderRJSFField<string>,
              }}
              onSubmit={onSubmit}
              formContext={{
                formData: {},
              }}
            />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      const input = getByRole('textbox');
      const submitButton = getByRole('button');

      fireEvent.change(input, { target: { value: 'branch1' } });

      fireEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: 'branch1',
        }),
        expect.anything(),
      );
    });

    it('should disable the picker when ui:disabled', async () => {
      const onSubmit = jest.fn();

      await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, {}],
            [scaffolderApiRef, {}],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{ 'ui:field': 'RepoBranchPicker', 'ui:disabled': true }}
              fields={{
                RepoBranchPicker:
                  RepoBranchPicker as ScaffolderRJSFField<string>,
              }}
              onSubmit={onSubmit}
              formContext={{
                formData: { repoUrl: 'github.com' },
              }}
            />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      const input = screen.getByRole('textbox');

      expect(input).toBeDisabled();
    });

    it('should render properly with title and description', async () => {
      const { getByText } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, {}],
            [scaffolderApiRef, {}],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{
                type: 'string',
                title: 'test title',
                description: 'test description',
              }}
              uiSchema={{
                'ui:field': 'RepoBranchPicker',
              }}
              fields={{
                RepoBranchPicker:
                  RepoBranchPicker as ScaffolderRJSFField<string>,
              }}
              formContext={{
                formData: {
                  repoUrl: 'bitbucket.org',
                },
              }}
            />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      expect(getByText('test title')).toBeInTheDocument();
      expect(getByText('test description')).toBeInTheDocument();
    });
  });

  describe('requestUserCredentials', () => {
    it('should call the scmAuthApi with the correct params', async () => {
      const secretsKey = 'testKey';

      const SecretsComponent = () => {
        const { secrets } = useTemplateSecrets();
        const secret = secrets[secretsKey];
        return secret ? <div>{secret}</div> : null;
      };

      const { getByText } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, mockScmAuthApi],
            [scaffolderApiRef, {}],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{
                'ui:field': 'RepoBranchPicker',
                'ui:options': {
                  requestUserCredentials: {
                    secretsKey,
                    additionalScopes: { github: ['workflow'] },
                  },
                },
              }}
              fields={{
                RepoBranchPicker:
                  RepoBranchPicker as ScaffolderRJSFField<string>,
              }}
              formContext={{
                formData: {
                  repoUrl: 'github.com',
                },
              }}
            />
            <SecretsComponent />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      await act(async () => {
        // need to wait for the debounce to finish
        await new Promise(resolve => setTimeout(resolve, 600));
      });

      expect(mockScmAuthApi.getCredentials).toHaveBeenCalledWith({
        url: 'https://github.com',
        additionalScope: {
          repoWrite: true,
          customScopes: {
            github: ['workflow'],
          },
        },
      });

      expect(getByText('abc123')).toBeInTheDocument();
    });

    it('should call the scmAuthApi with the correct params if workspace is nested', async () => {
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, mockScmAuthApi],
            [scaffolderApiRef, {}],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{
                'ui:field': 'RepoBranchPicker',
                'ui:options': {
                  allowedHosts: ['gitlab.example.com'],
                  requestUserCredentials: {
                    secretsKey: 'testKey',
                  },
                },
              }}
              fields={{
                RepoBranchPicker:
                  RepoBranchPicker as ScaffolderRJSFField<string>,
              }}
              formContext={{
                formData: {
                  repoUrl: 'gitlab.example.com',
                },
              }}
            />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      await act(async () => {
        // need to wait for the debounce to finish
        await new Promise(resolve => setTimeout(resolve, 600));
      });

      expect(mockScmAuthApi.getCredentials).toHaveBeenCalledWith({
        url: 'https://gitlab.example.com',
        additionalScope: {
          repoWrite: true,
        },
      });
    });

    it('should not call the scmAuthApi if secret is available in the state', async () => {
      const secretsKey = 'testKey';

      const SecretsComponent = () => {
        const { secrets } = useTemplateSecrets();
        const secret = secrets[secretsKey];
        return secret ? <div>{secret}</div> : null;
      };

      const { getByText } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, mockScmAuthApi],
            [scaffolderApiRef, {}],
          ]}
        >
          <SecretsContextProvider initialSecrets={{ [secretsKey]: 'abc123' }}>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{
                'ui:field': 'RepoBranchPicker',
                'ui:options': {
                  requestUserCredentials: {
                    secretsKey,
                    additionalScopes: { github: ['workflow'] },
                  },
                },
              }}
              fields={{
                RepoBranchPicker:
                  RepoBranchPicker as ScaffolderRJSFField<string>,
              }}
              formContext={{
                formData: {
                  repoUrl: 'github.com',
                },
              }}
            />
            <SecretsComponent />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      await act(async () => {
        // need to wait for the debounce to finish
        await new Promise(resolve => setTimeout(resolve, 600));
      });

      // as we already have a secret in the state, getCredentials should not be called again.
      expect(mockScmAuthApi.getCredentials).toHaveBeenCalledTimes(0);

      expect(getByText('abc123')).toBeInTheDocument();
    });
  });
});
