/*
 * Copyright 2020 The Backstage Authors
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
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { ScmIntegrationIcon } from './ScmIntegrationIcon';

describe('<ScmIntegrationIcon />', () => {
  it('renders without exploding (github)', async () => {
    const { baseElement } = await renderInTestApp(
      <ScmIntegrationIcon type="github" />,
    );
    expect(baseElement.querySelector('svg')).toBeInTheDocument();
  });

  it('renders without exploding (unknown)', async () => {
    const { baseElement } = await renderInTestApp(
      <ScmIntegrationIcon type="unknown" />,
    );
    expect(baseElement.querySelector('svg')).toBeInTheDocument();
  });
});
