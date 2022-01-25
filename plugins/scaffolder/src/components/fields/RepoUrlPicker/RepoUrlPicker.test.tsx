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
import { render } from '@testing-library/react';
import { RepoUrlPicker } from './RepoUrlPicker';
import Form from '@rjsf/core';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  scmIntegrationsApiRef,
  scmAuthApiRef,
} from '@backstage/integration-react';
import { scaffolderApiRef } from '../../../api';
import { SecretsContextProvider } from '../../secrets/SecretsContext';

describe('RepoUrlPicker', () => {
  describe('happy path rendering', () => {
    it('should render the repo url picker', async () => {
      const { getByRole } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [scmIntegrationsApiRef, {}],
            [scmAuthApiRef, {}],
            [scaffolderApiRef, {}],
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

      console.log(getByRole('form'));
    });
  });
});
