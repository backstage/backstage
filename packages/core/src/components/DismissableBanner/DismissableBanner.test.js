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
// import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { renderWithEffects, wrapInTestApp } from '@backstage/test-utils';
// import { createSetting } from 'shared/apis/settings';
import DismissableBanner from './DismissableBanner';

describe('<DismissableBanner />', () => {
  it('renders the message and the popover', async () => {
    /*
    const mockSetting = createSetting({
      id: 'mockSetting',
      defaultValue: true,
    });
    */

    const rendered = await renderWithEffects(
      wrapInTestApp(
        <DismissableBanner
          variant="info"
          // setting={mockSetting}
          message="test message"
        />,
      ),
    );
    rendered.getByText('test message');

    // fireEvent.click(rendered.getByTitle('Permanently dismiss this message'));
    // await waitForElementToBeRemoved(rendered.queryByText('test message'));
  });
});
