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
import { wrapInThemedTestApp } from '@backstage/test-utils';
import CopyTextButton from './CopyTextButton';
import { ApiRegistry, errorApiRef, ApiProvider } from 'api';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;
    update() {}
    destroy() {}
    scheduleUpdate() {}
  };
});

const props = {
  text: 'mockText',
  tooltipDelay: 2,
  tooltipText: 'mockTooltip',
};

const apiRegistry = ApiRegistry.from([
  [
    errorApiRef,
    {
      post(error) {
        throw error;
      },
    },
  ],
]);

describe('<CopyTextButton />', () => {
  it('renders without exploding', () => {
    const { getByDisplayValue } = render(
      wrapInThemedTestApp(
        <ApiProvider apis={apiRegistry}>
          <CopyTextButton {...props} />
        </ApiProvider>,
      ),
    );
    getByDisplayValue('mockText');
  });

  it('displays tooltip on click', async () => {
    document.execCommand = jest.fn();
    const rendered = render(
      wrapInThemedTestApp(
        <ApiProvider apis={apiRegistry}>
          <CopyTextButton {...props} />
        </ApiProvider>,
      ),
    );
    const button = rendered.getByTitle('mockTooltip');
    button.click();
    expect(document.execCommand).toHaveBeenCalled();
    rendered.getByText('mockTooltip');
  });
});
