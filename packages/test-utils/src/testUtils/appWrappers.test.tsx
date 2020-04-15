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
import { wrapInTestApp } from './appWrappers';
import { Route } from 'react-router';

describe('wrapInTestApp', () => {
  it('should provide routing', () => {
    const rendered = render(
      wrapInTestApp(
        <>
          <Route path="/route1">Route 1</Route>
          <Route path="/route2">Route 2</Route>
        </>,
        ['/route2'],
      ),
    );
    expect(rendered.getByText('Route 2')).toBeInTheDocument();
  });
});
