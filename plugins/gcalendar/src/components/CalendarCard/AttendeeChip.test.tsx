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

import { screen } from '@testing-library/react';
import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { AttendeeChip } from './AttendeeChip';
import { EventAttendee, ResponseStatus } from '../../api';

describe('<AttendeeChip />', () => {
  it('renders attendee email', async () => {
    const email = 'test@test.com';
    const user: EventAttendee = {
      email,
      responseStatus: ResponseStatus.needsAction,
    };
    await renderInTestApp(<AttendeeChip user={user} />);
    expect(screen.getByText(email)).toBeInTheDocument();
  });

  it('renders accepted icon', async () => {
    const email = 'test@test.com';
    const user: EventAttendee = {
      email,
      responseStatus: ResponseStatus.accepted,
    };
    await renderInTestApp(<AttendeeChip user={user} />);
    expect(screen.getByTestId('accepted-icon')).toBeInTheDocument();
  });

  it('renders declined icon', async () => {
    const email = 'test@test.com';
    const user: EventAttendee = {
      email,
      responseStatus: ResponseStatus.declined,
    };
    await renderInTestApp(<AttendeeChip user={user} />);
    expect(screen.getByTestId('declined-icon')).toBeInTheDocument();
  });
});
