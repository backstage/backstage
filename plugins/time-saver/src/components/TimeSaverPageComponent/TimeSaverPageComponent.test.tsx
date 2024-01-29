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
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimeSaverPageComponent } from './TimeSaverPageComponent';

describe('TimeSaverPageComponent', () => {
  it('should render the page title', () => {
    render(<TimeSaverPageComponent />);
    expect(screen.getByText('Backstage TS plugin!')).toBeInTheDocument();
  });

  it('should render the page subtitle', () => {
    render(<TimeSaverPageComponent />);
    expect(
      screen.getByText('Check saved time with TS plugin!'),
    ).toBeInTheDocument();
  });

  it('should render the All Stats tab by default', () => {
    render(<TimeSaverPageComponent />);
    expect(screen.getByText('All Stats')).toBeInTheDocument();
  });

  it('should render the By Team tab', () => {
    render(<TimeSaverPageComponent />);
    expect(screen.getByText('By Team')).toBeInTheDocument();
  });

  it('should render the By Template tab', () => {
    render(<TimeSaverPageComponent />);
    expect(screen.getByText('By Template')).toBeInTheDocument();
  });
});
