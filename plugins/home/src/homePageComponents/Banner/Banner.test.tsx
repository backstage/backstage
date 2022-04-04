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

  test('should greet user', async () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('1970-01-01T23:00:00').valueOf());

    const { getByText } = await renderInTestApp(
      <Banner
        startTime="2021-12-20"
        endTime="2022-12-31"
        info="Happyyy Holidaays for everyone"
      />,
    );

    expect(getByText(/Get some rest, Guest/)).toBeInTheDocument();
  });
});
