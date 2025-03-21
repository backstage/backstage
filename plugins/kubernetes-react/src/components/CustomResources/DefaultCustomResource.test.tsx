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
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../hooks/test-utils';
import * as ar from './__fixtures__/analysis-run.json';
import { DefaultCustomResourceAccordions } from './DefaultCustomResource';

describe('DefaultCustomResource', () => {
  it('should render DefaultCustomResource Accordion', async () => {
    const wrapper = kubernetesProviders({}, new Set([]));

    await renderInTestApp(
      wrapper(
        <DefaultCustomResourceAccordions
          customResources={[ar] as any}
          customResourceName="AnalysisRun"
        />,
      ),
    );
    expect(screen.getByText('dice-roller-546c476497-4-1')).toBeInTheDocument();
    expect(screen.getByText('AnalysisRun')).toBeInTheDocument();
  });
});
