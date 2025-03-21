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
import { render } from '@testing-library/react';
import { OverflowTooltip } from './OverflowTooltip';

describe('<OverflowTooltip />', () => {
  it('renders without exploding', async () => {
    expect(
      render(<OverflowTooltip text="Text that may overflow" />),
    ).toBeTruthy();
  });

  it('renders without exploding when the text prop is missing', async () => {
    expect(render(<OverflowTooltip text={undefined} />)).toBeTruthy();
  });
});
