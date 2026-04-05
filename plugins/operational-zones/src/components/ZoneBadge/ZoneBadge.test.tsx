/*
 * Copyright 2024 The Backstage Authors
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
import { ZoneBadge } from './ZoneBadge';

describe('ZoneBadge', () => {
  it('renders the level as uppercase text by default', () => {
    render(<ZoneBadge level="green" />);
    expect(screen.getByText('GREEN')).toBeInTheDocument();

    render(<ZoneBadge level="yellow" />);
    expect(screen.getByText('YELLOW')).toBeInTheDocument();

    render(<ZoneBadge level="red" />);
    expect(screen.getByText('RED')).toBeInTheDocument();
  });

  it('renders a custom label when provided', () => {
    render(<ZoneBadge level="red" label="Change Freeze" />);
    expect(screen.getByText('Change Freeze')).toBeInTheDocument();
  });
});
