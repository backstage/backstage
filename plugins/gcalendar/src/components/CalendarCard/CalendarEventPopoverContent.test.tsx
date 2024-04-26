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

import React from 'react';
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { CalendarEventPopoverContent } from './CalendarEventPopoverContent';

describe('<CalendarEventPopoverContent />', () => {
  const event = {
    summary: 'Test event',
    htmlLink: '/calendar-link',
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

  it('should render event info', async () => {
    await renderInTestApp(<CalendarEventPopoverContent event={event} />);
    expect(screen.getByText(event.summary)).toBeInTheDocument();
    expect(screen.getByText(event.description)).toBeInTheDocument();
    expect(screen.getByText(event.attendees[0].email)).toBeInTheDocument();
    expect(screen.getByText('Join Zoom Meeting')).toBeInTheDocument();
    expect(
      screen.queryByText('Join Zoom Meeting')?.closest('a'),
    ).toHaveAttribute('href', event.conferenceData.entryPoints[0].uri);
    expect(screen.queryByTestId('open-calendar-link')).toHaveAttribute(
      'href',
      event.htmlLink,
    );
    expect(screen.getByText(event.attendees[0].email)).toBeInTheDocument();
  });
});
