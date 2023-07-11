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
import { StepTime } from './StepTime';
import { render, act } from '@testing-library/react';

describe('StepTime', () => {
  it('should return empty when there is no start time', () => {
    const step = {
      id: 'test',
      startedAt: undefined,
      endedAt: undefined,
      name: 'test',
    };

    const { container } = render(<StepTime step={step} />);

    expect(container.querySelector('span')?.textContent).toBe('');
  });

  it('should format the time between the start and end date properly', async () => {
    const step = {
      id: 'test',
      startedAt: '2021-01-01T00:00:00Z',
      endedAt: '2021-01-01T00:00:01Z',
      name: 'test',
    };

    const { findByText } = render(<StepTime step={step} />);

    await expect(findByText('1 second')).resolves.toBeInTheDocument();
  });

  describe('updates', () => {
    beforeEach(() => {
      jest.useFakeTimers({ now: new Date('2021-01-01T00:00:00Z') });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should update the time every second', async () => {
      const step = {
        id: 'test',
        startedAt: '2021-01-01T00:00:00Z',
        endedAt: undefined,
        name: 'test',
      };

      const { findByText } = render(<StepTime step={step} />);

      await expect(findByText('0 seconds')).resolves.toBeInTheDocument();

      act(() => jest.advanceTimersByTime(1000));

      await expect(findByText('1 second')).resolves.toBeInTheDocument();

      act(() => jest.advanceTimersByTime(1000 * 60));

      await expect(
        findByText('1 minute, 1 second'),
      ).resolves.toBeInTheDocument();
    });
  });
});
