/*
 * Copyright 2021 Spotify AB
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
import { ChromeUXReportPeriod } from './ChromeUXReportPeriod';
import { wrapInTestApp } from '@backstage/test-utils';
import { render, waitFor } from '@testing-library/react';

describe('ChromeUXReportPeriod', () => {
  const renderWrapped = (children: React.ReactNode) =>
    render(wrapInTestApp(children));

  it('render snapshot', async () => {
    const { asFragment } = renderWrapped(<ChromeUXReportPeriod />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('render successfully', async () => {
    const { container } = renderWrapped(<ChromeUXReportPeriod />);
    const period = container.getElementsByClassName('period');

    await waitFor(async () => {
      expect(period).toHaveLength(1);
      expect(period).not.toBeNull();
    });
  });
});
