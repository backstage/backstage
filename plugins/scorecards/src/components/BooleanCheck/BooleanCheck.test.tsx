/*
 * Copyright 2021 The Backstage Authors
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
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { BooleanCheck } from './BooleanCheck';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import mockCheckValue from '../../api/mocks/checks-value-mock.json';
import { entityMock } from '../../api/mocks/entity-mock';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';

describe('BooleanCheck', () => {
  it('should render check named simpleTestCheck', async () => {
    const checks: CheckResult[] = [...mockCheckValue];
    const doc = await render(
      <ThemeProvider theme={lightTheme}>
        <EntityProvider entity={entityMock}>
          <BooleanCheck checkResult={checks[0]} />
        </EntityProvider>
      </ThemeProvider>,
    );
    expect(await doc.findByText('simpleTestCheck')).toBeInTheDocument();
  });
});
