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
import { renderInTestApp } from '@backstage/test-utils';
import { DatePicker } from './DatePicker';
import userEvent from '@testing-library/user-event';

describe('DatePicker', () => {
  it('should render', async () => {
    const label = 'label';
    const rendered = await renderInTestApp(<DatePicker label={label} />);
    expect(rendered.getByText(label)).toBeInTheDocument();
  });

  it('should accept a date', async () => {
    const label = 'label';
    const callback = jest.fn();
    const rendered = await renderInTestApp(
      <DatePicker label={label} onDateChange={callback} />,
    );
    const input = rendered.getByLabelText(label);

    userEvent.type(input, '2020-02-02');
    expect(callback).toBeCalledWith('2020-02-02');
  });

  it('should not accept non date', async () => {
    const label = 'label';
    const callback = jest.fn();
    const rendered = await renderInTestApp(
      <DatePicker label={label} onDateChange={callback} />,
    );
    const input = rendered.getByLabelText(label);

    userEvent.type(input, 'test');
    expect(callback).not.toHaveBeenCalled();
  });
});
