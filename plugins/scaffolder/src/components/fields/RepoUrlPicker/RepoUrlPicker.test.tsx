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
import React from 'react';
import { RepoUrlPicker } from './RepoUrlPicker';
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
  ScaffolderApi,
  useTemplateSecrets,
  ScaffolderRJSFField,
} from '@backstage/plugin-scaffolder-react';
import { act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('RepoUrlPicker', () => {
  const mockScaffolderApi: Partial<ScaffolderApi> = {
    getIntegrationsList: async () => ({
      integrations: [
        { host: 'github.com', type: 'github', title: 'github.com' },
        { host: 'dev.azure.com', type: 'azure', title: 'dev.azure.com' },
        {
          host: 'server.bitbucket.org',
          type: 'bitbucketServer',
          title: 'server.bitbucket.org',
        },
        {
          host: 'gitlab.example.com',
          type: 'gitlab',
          title: 'gitlab.example.com',
        },
      ],
    }),
  };

  const mockIntegrationsApi: Partial<ScmIntegrationsApi> = {
    byHost: () => ({ type: 'github' }),
  };

  const mockIntegrationsApiAzure: Partial<ScmIntegrationsApi> = {
    byHost: () => ({ type: 'azure' }),
  };

  let mockScmAuthApi: Partial<ScmAuthApi>;

  beforeEach(() => {
    mockScmAuthApi = {
      getCredentials: jest.fn().mockResolvedValue({ token: 'abc123' }),
    };
  });

  describe('happy path rendering', () => {
    it('should render the repo url picker with minimal props', async () => {
      const onSubmit = jest.fn();
      const { getAllByRole, getByRole } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, {}],
            [scaffolderApiRef, mockScaffolderApi],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{ 'ui:field': 'RepoUrlPicker' }}
              fields={{
                RepoUrlPicker: RepoUrlPicker as ScaffolderRJSFField<string>,
              }}
              onSubmit={onSubmit}
            />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      const [ownerInput, repoInput] = getAllByRole('textbox');
      const submitButton = getByRole('button');

      act(() => {
        ownerInput.focus();
        fireEvent.change(ownerInput, { target: { value: 'backstage' } });
        ownerInput.blur();

        repoInput.focus();
        fireEvent.change(repoInput, { target: { value: 'repo123' } });
        repoInput.blur();
      });

      fireEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: 'github.com?owner=backstage&repo=repo123',
        }),
        expect.anything(),
      );
    });

    it('should disable the picker when ui:disabled', async () => {
      const onSubmit = jest.fn();
      const { getAllByRole } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, {}],
            [scaffolderApiRef, mockScaffolderApi],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{ 'ui:field': 'RepoUrlPicker', 'ui:disabled': true }}
              fields={{
                RepoUrlPicker: RepoUrlPicker as ScaffolderRJSFField<string>,
              }}
              onSubmit={onSubmit}
            />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      const [ownerInput, repoInput] = getAllByRole('textbox');

      expect(ownerInput).toBeDisabled();
      expect(repoInput).toBeDisabled();
    });

    it('should render properly with allowedHosts', async () => {
      const { getByRole } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApiAzure],
            [scmAuthApiRef, {}],
            [scaffolderApiRef, mockScaffolderApi],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{
                'ui:field': 'RepoUrlPicker',
                'ui:options': { allowedHosts: ['dev.azure.com'] },
              }}
              fields={{
                RepoUrlPicker: RepoUrlPicker as ScaffolderRJSFField<string>,
              }}
            />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      expect(
        getByRole('option', { name: 'dev.azure.com' }),
      ).toBeInTheDocument();
    });

    it('should render properly with allowedProject', async () => {
      const { getByRole } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApiAzure],
            [scmAuthApiRef, {}],
            [scaffolderApiRef, mockScaffolderApi],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{
                'ui:field': 'RepoUrlPicker',
                'ui:options': {
                  allowedHosts: ['dev.azure.com'],
                  allowedProjects: ['Backstage'],
                },
              }}
              fields={{
                RepoUrlPicker: RepoUrlPicker as ScaffolderRJSFField<string>,
              }}
            />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      expect(getByRole('option', { name: 'Backstage' })).toBeInTheDocument();
    });

    it('should render properly with title and description', async () => {
      const { getByText } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, {}],
            [scaffolderApiRef, mockScaffolderApi],
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
                'ui:field': 'RepoUrlPicker',
              }}
              fields={{
                RepoUrlPicker: RepoUrlPicker as ScaffolderRJSFField<string>,
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
            [scaffolderApiRef, mockScaffolderApi],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{
                'ui:field': 'RepoUrlPicker',
                'ui:options': {
                  requestUserCredentials: {
                    secretsKey,
                    additionalScopes: { github: ['workflow'] },
                  },
                },
              }}
              fields={{
                RepoUrlPicker: RepoUrlPicker as ScaffolderRJSFField<string>,
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
            [scaffolderApiRef, mockScaffolderApi],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{
                'ui:field': 'RepoUrlPicker',
                'ui:options': {
                  allowedHosts: ['gitlab.example.com'],
                  requestUserCredentials: {
                    secretsKey: 'testKey',
                  },
                },
              }}
              fields={{
                RepoUrlPicker: RepoUrlPicker as ScaffolderRJSFField<string>,
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

    it('should call the scmAuthApi with the new host when the host is changed', async () => {
      const secretsKey = 'testKey';

      const SecretsComponent = () => {
        const { secrets } = useTemplateSecrets();
        const secret = secrets[secretsKey];
        return secret ? <div>{secret}</div> : null;
      };
      const allowedHosts = ['github.com', 'gitlab.example.com'];

      (mockScmAuthApi.getCredentials as jest.Mock).mockImplementation(
        ({ url }) => {
          let token = '';
          if (url === `https://${allowedHosts[0]}`) {
            token = 'abc123';
          } else if (url === `https://${allowedHosts[1]}`) {
            token = 'def456';
          }
          return Promise.resolve({ token });
        },
      );
      const secondHost = allowedHosts[1];

      const { getAllByRole, getByText } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, mockScmAuthApi],
            [scaffolderApiRef, mockScaffolderApi],
          ]}
        >
          <SecretsContextProvider>
            <Form
              validator={validator}
              schema={{ type: 'string' }}
              uiSchema={{
                'ui:field': 'RepoUrlPicker',
                'ui:options': {
                  allowedHosts,
                  requestUserCredentials: {
                    secretsKey,
                  },
                },
              }}
              fields={{
                RepoUrlPicker: RepoUrlPicker as ScaffolderRJSFField<string>,
              }}
            />
            <SecretsComponent />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      await act(async () => {
        // need to wait for the debounce to finish to fetch credentials for the first selected host
        await new Promise(resolve => setTimeout(resolve, 600));
      });
      expect(getByText('abc123')).toBeInTheDocument();

      await act(async () => {
        // Select the second host
        const hostInput = getAllByRole('combobox')[0];
        await userEvent.selectOptions(hostInput, secondHost);

        // need to wait for the debounce to finish
        await new Promise(resolve => setTimeout(resolve, 600));
      });
      expect(getByText('def456')).toBeInTheDocument();
      expect(mockScmAuthApi.getCredentials).toHaveBeenCalledWith({
        url: `https://${secondHost}`,
        additionalScope: {
          repoWrite: true,
        },
      });
    });
  });
});
