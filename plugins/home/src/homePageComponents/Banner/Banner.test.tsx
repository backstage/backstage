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
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { Banner } from './Banner';

describe('<Banner>', () => {
  afterEach(() => jest.resetAllMocks());

  test('should display the given message', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2021-12-22').valueOf());

    const { getByText } = await renderInTestApp(
      <Banner startTime="2021-12-20" endTime="2022-12-31" info="Foo Bar" />,
    );

    expect(getByText(/Foo Bar/)).toBeInTheDocument();
  });
  test('should render the passed in action component', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2021-12-22').valueOf());

    const { getByText } = await renderInTestApp(
      <Banner
        startTime="2021-12-20"
        endTime="2022-12-31"
        info="Foo Bar"
        action={<div>Rendered action</div>}
      />,
    );

    expect(getByText(/Rendered action/)).toBeInTheDocument();
  });
  test('should render when isOpen true and in the interval', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2021-12-22').valueOf());

    const { getByText } = await renderInTestApp(
      <Banner
        startTime="2021-12-20"
        endTime="2022-12-31"
        info="Foo Bar"
        isOpen
      />,
    );

    expect(getByText(/Foo Bar/)).toBeInTheDocument();
  });
});
