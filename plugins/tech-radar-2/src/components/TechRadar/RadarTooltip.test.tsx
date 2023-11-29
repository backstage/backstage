/*
 * Copyright 2023 The Backstage Authors
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

import { act, fireEvent, render } from '@testing-library/react';

import RadarTooltip from './RadarTooltip';

describe('RadarTooltip', () => {
  it('does not explode on render', () => {
    render(
      <RadarTooltip title="foo">
        <React.Fragment />
      </RadarTooltip>,
    );
  });

  it('should not display tooltip until hovered', async () => {
    const { queryByText } = render(
      <RadarTooltip title="foo">
        <a href="/bar">Link</a>
      </RadarTooltip>,
    );
    const tooltip = await queryByText('foo');
    expect(tooltip).toBeNull();
  });

  it('displays a tooltip on hover', async () => {
    const { getByText, findByText } = render(
      <RadarTooltip title="foo">
        <a href="/bar">Link</a>
      </RadarTooltip>,
    );
    const link = getByText('Link');

    act(() => {
      fireEvent(link, new MouseEvent('mouseover', { bubbles: true }));
    });

    const tooltip = await findByText('foo');
    expect(tooltip).toBeInTheDocument();
  });
});
