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
import Form from '@rjsf/core';
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
} from '@backstage/plugin-scaffolder-react';
import { act, fireEvent } from '@testing-library/react';

describe('RepoUrlPicker', () => {
  const mockScaffolderApi: Partial<ScaffolderApi> = {
    getIntegrationsList: async () => ({
      integrations: [
        { host: 'github.com', type: 'github', title: 'github.com' },
        { host: 'dev.azure.com', type: 'azure', title: 'dev.azure.com' },
      ],
    }),
  };

  const mockIntegrationsApi: Partial<ScmIntegrationsApi> = {
    byHost: () => ({ type: 'github' }),
  };

  const mockScmAuthApi: Partial<ScmAuthApi> = {
    getCredentials: jest.fn().mockResolvedValue({ token: 'abc123' }),
  };

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
              schema={{ type: 'string' }}
              uiSchema={{ 'ui:field': 'RepoUrlPicker' }}
              fields={{ RepoUrlPicker: RepoUrlPicker }}
              onSubmit={onSubmit}
            />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      const [ownerInput, repoInput] = getAllByRole('textbox');
      const submitButton = getByRole('button');

      fireEvent.change(ownerInput, { target: { value: 'backstage' } });
      fireEvent.change(repoInput, { target: { value: 'repo123' } });

      fireEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: 'github.com?owner=backstage&repo=repo123',
        }),
        expect.anything(),
      );
    });

    it('should render properly with allowedHosts', async () => {
      const { getByRole } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, {}],
            [scaffolderApiRef, mockScaffolderApi],
          ]}
        >
          <SecretsContextProvider>
            <Form
              schema={{ type: 'string' }}
              uiSchema={{
                'ui:field': 'RepoUrlPicker',
                'ui:options': { allowedHosts: ['dev.azure.com'] },
              }}
              fields={{ RepoUrlPicker: RepoUrlPicker }}
            />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      expect(
        getByRole('option', { name: 'dev.azure.com' }),
      ).toBeInTheDocument();
    });
  });

  describe('requestUserCredentials', () => {
    it('should call the scmAuthApi with the correct params', async () => {
      const SecretsComponent = () => {
        const { secrets } = useTemplateSecrets();
        return (
          <div data-testid="current-secrets">{JSON.stringify({ secrets })}</div>
        );
      };
      const { getAllByRole, getByTestId } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, mockIntegrationsApi],
            [scmAuthApiRef, mockScmAuthApi],
            [scaffolderApiRef, mockScaffolderApi],
          ]}
        >
          <SecretsContextProvider>
            <Form
              schema={{ type: 'string' }}
              uiSchema={{
                'ui:field': 'RepoUrlPicker',
                'ui:options': {
                  requestUserCredentials: {
                    secretsKey: 'testKey',
                    additionalScopes: { github: ['workflow'] },
                  },
                },
              }}
              fields={{ RepoUrlPicker: RepoUrlPicker }}
            />
            <SecretsComponent />
          </SecretsContextProvider>
        </TestApiProvider>,
      );

      const [ownerInput, repoInput] = getAllByRole('textbox');

      await act(async () => {
        fireEvent.change(ownerInput, { target: { value: 'backstage' } });
        fireEvent.change(repoInput, { target: { value: 'repo123' } });

        // need to wait for the debounce to finish
        await new Promise(resolve => setTimeout(resolve, 600));
      });

      expect(mockScmAuthApi.getCredentials).toHaveBeenCalledWith({
        url: 'https://github.com/backstage/repo123',
        additionalScope: {
          repoWrite: true,
          customScopes: {
            github: ['workflow'],
          },
        },
      });

      const currentSecrets = JSON.parse(
        getByTestId('current-secrets').textContent!,
      );

      expect(currentSecrets).toEqual({
        secrets: { testKey: 'abc123' },
      });
    });
  });
});
