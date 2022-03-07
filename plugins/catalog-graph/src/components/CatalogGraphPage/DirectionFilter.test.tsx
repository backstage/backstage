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
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Direction } from '../EntityRelationsGraph';
import { DirectionFilter } from './DirectionFilter';

describe('<DirectionFilter/>', () => {
  test('should display current value', () => {
    const { getByText } = render(
      <DirectionFilter value={Direction.LEFT_RIGHT} onChange={() => {}} />,
    );

    expect(getByText('Left to right')).toBeInTheDocument();
  });

  test('should select direction', async () => {
    const onChange = jest.fn();
    const { getByText, getByTestId } = render(
      <DirectionFilter value={Direction.RIGHT_LEFT} onChange={onChange} />,
    );

    expect(getByText('Right to left')).toBeInTheDocument();

    userEvent.click(getByTestId('select'));
    userEvent.click(getByText('Top to bottom'));

    await waitFor(() => {
      expect(getByText('Top to bottom')).toBeInTheDocument();
      expect(onChange).toBeCalledWith(Direction.TOP_BOTTOM);
    });
  });
});
