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

import React from 'react';
import { MicDrop } from './MicDrop';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';

describe('<MicDrop/>', () => {
  it('should render with default svg', async () => {
    const { getByAltText } = await renderInTestApp(<MicDrop />);
    expect(
      getByAltText(/Girl dropping mic from her hands/i),
    ).toBeInTheDocument();
  });

  it('should render with svg-url from app-config', async () => {
    const dummySvg = 'branded-mic-drop.svg';
    const { getByAltText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            configApiRef,
            new ConfigReader({
              app: {
                micDropSvgUrl: dummySvg,
              },
            }),
          ],
        ]}
      >
        <MicDrop />
      </TestApiProvider>,
    );
    expect(getByAltText(/Girl dropping mic from her hands/i)).toHaveAttribute(
      'src',
      expect.stringContaining(dummySvg),
    );
  });
});
