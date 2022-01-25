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
} from '@backstage/integration-react';
import { scaffolderApiRef } from '../../../api';
import { SecretsContextProvider } from '../../secrets/SecretsContext';
import { ScaffolderApi } from '../../..';

describe('RepoUrlPicker', () => {
  const mockScaffolderApi: Partial<ScaffolderApi> = {
    getIntegrationsList: async () => [
      { host: 'github.com', type: 'github', title: 'github.com' },
    ],
  };

  const mockIntegrationsApi: Partial<ScmIntegrationsApi> = {
    byHost: () => ({ type: 'github' }),
  };

  describe('happy path rendering', () => {
    it('should render the repo url picker', async () => {
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
              uiSchema={{ 'ui:field': 'RepoUrlPicker' }}
              fields={{ RepoUrlPicker: RepoUrlPicker }}
            />
          </SecretsContextProvider>
          ,
        </TestApiProvider>,
      );

      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log(getByRole('form'));
    });
  });
});
