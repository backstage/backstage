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

import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/react';
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { CalendarEvent } from './CalendarEvent';

describe('<CalendarEvent />', () => {
  const event = {
    summary: 'Test event',
    htmlLink: '/calendar-link',
    start: {
      dateTime: '2022-02-09T10:15:00',
    },
    end: {
      dateTime: '2022-02-09T10:45:00',
    },
    conferenceData: {
      entryPoints: [{ entryPointType: 'video', uri: '/zoom-link' }],
    },
    description: 'Test description',
    attendees: [
      {
        email: 'test@test.com',
      },
    ],
  };

  it('should render calendar event', async () => {
    await renderInTestApp(<CalendarEvent event={event} />);
    expect(screen.getByText(event.summary)).toBeInTheDocument();
    expect(screen.getByTestId('calendar-event-zoom-link')).toBeInTheDocument();
    expect(screen.queryByTestId('calendar-event-zoom-link')).toHaveAttribute(
      'href',
      event.conferenceData.entryPoints[0].uri,
    );
    expect(screen.getByTestId('calendar-event-time')).toBeInTheDocument();
  });

  it('should not render time for events longer than 1 day', async () => {
    const allDayEvent = {
      summary: 'Test event',
      start: {
        date: '2022-02-09',
      },
      end: {
        date: '2022-02-19',
      },
    };
    await renderInTestApp(<CalendarEvent event={allDayEvent} />);
    expect(screen.getByText(allDayEvent.summary)).toBeInTheDocument();
    expect(screen.queryByTestId('calendar-event-time')).not.toBeInTheDocument();
  });

  it('should show popover on click', async () => {
    await renderInTestApp(<CalendarEvent event={event} />);
    expect(
      screen.queryByTestId('calendar-event-popover'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('calendar-event'));
    expect(screen.getByTestId('calendar-event-popover')).toBeInTheDocument();
  });
});
