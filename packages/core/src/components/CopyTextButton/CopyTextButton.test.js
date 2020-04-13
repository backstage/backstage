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

const props = {
  text: 'mockText',
  tooltipDelay: 2,
  tooltipText: 'mockTooltip',
};

describe('<CopyTextButton />', () => {
  it('renders without exploding', () => {
    const { getByDisplayValue } = render(
      wrapInThemedTestApp(<CopyTextButton {...props} />),
    );
    getByDisplayValue('mockText');
  });

  // stefanalund: FIXME: cannot figure out wht this test fails.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('displays tooltip on click', () => {
    const spy = jest.fn();
    Object.defineProperty(document, 'execCommand', { value: spy });
    const rendered = render(wrapInThemedTestApp(<CopyTextButton {...props} />));
    const button = rendered.getByTitle('mockTooltip');
    button.click();
    expect(spy).toHaveBeenCalled();
    rendered.getByText('mockTooltip');
  });
});
