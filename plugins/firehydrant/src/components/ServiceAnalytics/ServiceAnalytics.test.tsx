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
import { ServiceAnalytics } from './ServiceAnalytics';
import { renderInTestApp } from '@backstage/test-utils';

describe('ServiceAnalytics', () => {
  it('renders service analytics', async () => {
    await renderInTestApp(
      <ServiceAnalytics
        error={null}
        loading={false}
        value={{
          id: 'b20de448-7855-4fb0-8d98-d9eafe82fc2c',
          mttd: 32,
          mtta: 44,
          mttm: 33,
          mttr: 23,
          count: 0,
          total_time: 0,
        }}
      />,
    );

    expect(await screen.findByText(/32/)).toBeInTheDocument();
    expect(await screen.findByText(/44/)).toBeInTheDocument();
  });
});
