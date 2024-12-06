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
import { EventsContent } from './Events';
import { render } from '@testing-library/react';
import { Event } from 'kubernetes-models/v1';
import { DateTime } from 'luxon';

describe('EventsContent', () => {
  const oneHourAgo = DateTime.now().minus({ hours: 1 }).toISO();
  it('should show info events', () => {
    const { getByText } = render(
      <EventsContent
        events={[
          {
            type: 'Info',
            message: 'hello there',
            reason: 'something happened',
            count: 52,
            metadata: {
              creationTimestamp: oneHourAgo,
            },
          } as Event,
        ]}
      />,
    );
    expect(getByText('First event 1 hour ago (count: 52)')).toBeInTheDocument();
    expect(getByText('something happened: hello there')).toBeInTheDocument();
  });
  it('should show warning events', () => {
    const { getByText } = render(
      <EventsContent
        events={[
          {
            type: 'Warning',
            message: 'uh oh',
            reason: 'something happened',
            count: 23,
            metadata: {
              creationTimestamp: oneHourAgo,
            },
          } as Event,
        ]}
      />,
    );
    expect(getByText('First event 1 hour ago (count: 23)')).toBeInTheDocument();
    expect(getByText('something happened: uh oh')).toBeInTheDocument();
  });

  it('should only show warning events when warningEventsOnly set', () => {
    const { getByText, queryByText } = render(
      <EventsContent
        warningEventsOnly
        events={
          [
            {
              type: 'Warning',
              message: 'uh oh',
              reason: 'something happened',
              count: 23,
              metadata: {
                creationTimestamp: oneHourAgo,
              },
            },
            {
              type: 'Info',
              message: 'hello there',
              reason: 'something happened',
              count: 52,
              metadata: {
                creationTimestamp: oneHourAgo,
              },
            },
          ] as Event[]
        }
      />,
    );
    expect(queryByText('First event 1 hour ago (count: 52)')).toBeNull();
    expect(queryByText('something happened: hello there')).toBeNull();
    expect(getByText('First event 1 hour ago (count: 23)')).toBeInTheDocument();
    expect(getByText('something happened: uh oh')).toBeInTheDocument();
  });
});
