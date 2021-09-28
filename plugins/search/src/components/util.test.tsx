/*
 * Copyright 2021 The Backstage Authors
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
import { wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import { useNavigateToQuery } from './util';
import { Routes, Route } from 'react-router-dom';
import { rootRouteRef } from '../plugin';
import { act } from 'react-dom/test-utils';

const navigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

describe('util', () => {
  describe('useNavigateToQuery', () => {
    it('navigates to query', async () => {
      const MyComponent = () => {
        const navigateToQuery = useNavigateToQuery();
        navigateToQuery({ query: 'test' });
        return <div>test</div>;
      };

      await act(async () => {
        await render(
          wrapInTestApp(
            <Routes>
              <Route element={<MyComponent />} />
            </Routes>,
            {
              mountedRoutes: {
                '/search': rootRouteRef,
              },
            },
          ),
        );

        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith('/search?query=test');
      });
    });
  });
});
