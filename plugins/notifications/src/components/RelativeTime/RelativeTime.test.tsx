/*
 * Copyright 2026 The Backstage Authors
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
import { render, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import { RelativeTime } from './RelativeTime';

describe('RelativeTime', () => {
  it('renders an ISO string as relative text in a time element', () => {
    const created = DateTime.utc().minus({ minutes: 5 }).toISO()!;

    render(<RelativeTime value={created} className="info" />);

    const time = screen.getByText('5 minutes ago');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('dateTime', created);
    expect(time).toHaveAttribute('title', created);
    expect(time).toHaveClass('info');
  });

  it('accepts a Date and normalizes the attributes to UTC', () => {
    const created = new Date(Date.now() - 2 * 60 * 60 * 1000);

    render(<RelativeTime value={created} />);

    const time = screen.getByText('2 hours ago');
    expect(time).toHaveAttribute('dateTime', created.toISOString());
    expect(time).toHaveAttribute('title', created.toISOString());
  });

  it('renders future timestamps', () => {
    const due = DateTime.utc().plus({ days: 3, minutes: 1 }).toISO()!;

    render(<RelativeTime value={due} />);

    expect(screen.getByText('in 3 days')).toBeInTheDocument();
  });

  it('renders nothing for a value that is not a valid date', () => {
    const { container } = render(<RelativeTime value="not a date" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for an invalid Date', () => {
    const { container } = render(<RelativeTime value={new Date('nope')} />);

    expect(container).toBeEmptyDOMElement();
  });
});
