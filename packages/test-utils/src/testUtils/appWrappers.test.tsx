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

import React, { FC } from 'react';
import { render } from '@testing-library/react';
import { wrapInTestApp, renderInTestApp } from './appWrappers';
import { Route } from 'react-router';
import { withLogCollector } from '@backstage/test-utils-core';

describe('wrapInTestApp', () => {
  it('should provide routing and warn about missing act()', async () => {
    const { error } = await withLogCollector(['error'], async () => {
      const rendered = render(
        wrapInTestApp(
          <>
            <Route path="/route1">Route 1</Route>
            <Route path="/route2">Route 2</Route>
          </>,
          { routeEntries: ['/route2'] },
        ),
      );
      expect(rendered.getByText('Route 2')).toBeInTheDocument();

      // Wait for async actions to trigger the act() warnings that we assert below
      await Promise.resolve();
    });

    expect(error).toEqual([
      expect.stringMatching(
        /^Warning: An update to %s inside a test was not wrapped in act\(...\)/,
      ),
      expect.stringMatching(
        /^Warning: An update to %s inside a test was not wrapped in act\(...\)/,
      ),
    ]);
  });

  it('should render a component in a test app without warning about missing act()', async () => {
    const { error } = await withLogCollector(['error'], async () => {
      const Foo: FC<{}> = () => {
        return <p>foo</p>;
      };

      const rendered = await renderInTestApp(Foo);
      expect(rendered.getByText('foo')).toBeInTheDocument();
    });

    expect(error).toEqual([]);
  });

  it('should render a node in a test app', async () => {
    const Foo: FC<{}> = () => {
      return <p>foo</p>;
    };

    const rendered = await renderInTestApp(<Foo />);
    expect(rendered.getByText('foo')).toBeInTheDocument();
  });
});
