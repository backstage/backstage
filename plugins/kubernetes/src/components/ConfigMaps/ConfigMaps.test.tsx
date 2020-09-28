/*
 * Copyright 2020 Spotify AB
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
import { ConfigMaps } from './ConfigMaps';
import * as configmapFixture from './__fixtures__/configmap.json';
import { wrapInTestApp } from '@backstage/test-utils';

describe('ConfigMaps', () => {
  it('should render configmap', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <ConfigMaps configMaps={(configmapFixture as any).default} />,
      ),
    );

    // title
    expect(getByText('dice-roller')).toBeInTheDocument();
    expect(getByText('Config Map')).toBeInTheDocument();

    // values
    expect(getByText('Immutable')).toBeInTheDocument();
    expect(getByText('false')).toBeInTheDocument();
    expect(getByText('Data')).toBeInTheDocument();
    expect(getByText('Foo: bar')).toBeInTheDocument(); // TODO wish this wasn't upper case
  });
});
