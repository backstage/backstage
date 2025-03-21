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

import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { EntityNotFound } from './EntityNotFound';

describe('<EntityNotFound />', () => {
  it('renders without exploding', async () => {
    await renderInTestApp(<EntityNotFound />);
    expect(screen.getByText(/entity was not found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/getting started documentation/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/docs/i)).toBeInTheDocument();
  });
});
