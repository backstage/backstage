/*
 * Copyright 2020 Spotify AB
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
import { EscalationPolicy } from './EscalationPolicy';
import { wrapInTestApp } from '@backstage/test-utils';
import { User } from '../types';

const escalations: User[] = [
  {
    name: 'person1',
    id: 'p1',
    summary: 'person1',
    email: 'person1@example.com',
    html_url: 'http://a.com/id1',
  },
];

describe('Escalation', () => {
  it('render emptyState', () => {
    const { getByText } = render(
      wrapInTestApp(<EscalationPolicy users={[]} />),
    );
    expect(getByText('Empty escalation policy')).toBeInTheDocument();
  });

  it('render escalation list', () => {
    const { getByText } = render(
      wrapInTestApp(<EscalationPolicy users={escalations} />),
    );
    expect(getByText('person1')).toBeInTheDocument();
    expect(getByText('person1@example.com')).toBeInTheDocument();
  });
});
