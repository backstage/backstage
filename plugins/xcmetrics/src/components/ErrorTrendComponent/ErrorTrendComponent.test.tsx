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
import { ErrorTrendComponent } from './ErrorTrendComponent';
import { renderInTestApp } from '@backstage/test-utils';
import { BuildCount } from '../../api';

describe('ErrorTrendComponent', () => {
  it('should render', async () => {
    const buildCounts: BuildCount[] = [
      { day: '2021-01-01', errors: 10, builds: 100 },
    ];
    const rendered = await renderInTestApp(
      <ErrorTrendComponent buildCounts={buildCounts} />,
    );
    expect(rendered.findAllByText('Error Rate')).toBeTruthy();
  });
});
