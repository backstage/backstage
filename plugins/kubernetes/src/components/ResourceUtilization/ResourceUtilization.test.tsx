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

import React from 'react';
import { render } from '@testing-library/react';
import { ResourceUtilization } from './ResourceUtilization';
import { wrapInTestApp } from '@backstage/test-utils';

describe('ResourceUtilization', () => {
  it('should render utilization', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <ResourceUtilization
          title="some-title"
          usage="1000"
          total="10000"
          totalFormated="15%"
        />,
      ),
    );

    expect(getByText('some-title: 15%')).toBeInTheDocument();
    expect(getByText('usage: 10%')).toBeInTheDocument();
  });
  it('no usage when compressed', async () => {
    const { getByText, queryByText } = render(
      wrapInTestApp(
        <ResourceUtilization
          compressed
          title="some-title"
          usage="1000"
          total="10000"
          totalFormated="15%"
        />,
      ),
    );

    expect(getByText('some-title: 15%')).toBeInTheDocument();
    expect(queryByText('usage: 10%')).toBeNull();
  });
});
