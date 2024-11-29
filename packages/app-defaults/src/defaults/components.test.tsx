/*
 * Copyright 2020 The Backstage Authors
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
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { OptionallyWrapInRouter } from './components';

describe('OptionallyWrapInRouter', () => {
  it('should wrap with router if not yet inside a router', async () => {
    render(<OptionallyWrapInRouter>Test</OptionallyWrapInRouter>);

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should not wrap with router if already inside a router', async () => {
    render(
      <MemoryRouter>
        <OptionallyWrapInRouter>Test</OptionallyWrapInRouter>
      </MemoryRouter>,
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
