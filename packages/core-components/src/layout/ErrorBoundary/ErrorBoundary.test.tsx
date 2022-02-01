/* eslint-disable no-console */
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
import { ErrorBoundary } from './ErrorBoundary';
import {
  MockErrorApi,
  renderInTestApp,
  TestApiProvider,
  withLogCollector,
} from '@backstage/test-utils';
import { errorApiRef } from '@backstage/core-plugin-api';

type BombProps = {
  shouldThrow?: boolean;
  children?: React.ReactNode;
};

const Bomb = ({ shouldThrow }: BombProps) => {
  if (shouldThrow) {
    throw new Error('Bomb');
  } else {
    return <p>Working Component</p>;
  }
};

describe('<ErrorBoundary/>', () => {
  it('should render error boundary with and without error', async () => {
    const { error } = await withLogCollector(['error'], async () => {
      const errorApi = new MockErrorApi();
      const { rerender, queryByRole, getByRole, getByText } =
        await renderInTestApp(
          <TestApiProvider apis={[[errorApiRef, errorApi]]}>
            <ErrorBoundary>
              <Bomb />
            </ErrorBoundary>
          </TestApiProvider>,
        );

      expect(queryByRole('alert')).not.toBeInTheDocument();
      expect(getByText(/working component/i)).toBeInTheDocument();

      rerender(
        <TestApiProvider apis={[[errorApiRef, errorApi]]}>
          <ErrorBoundary>
            <Bomb shouldThrow />
          </ErrorBoundary>
        </TestApiProvider>,
      );

      expect(getByRole('alert')).toBeInTheDocument();
      expect(getByText(/something went wrong/i)).toBeInTheDocument();
    });

    expect(error).toEqual([
      expect.stringMatching(/^Error: Uncaught \[Error: Bomb\]/),
      expect.stringMatching(
        /^The above error occurred in the <Bomb> component:/,
      ),
      expect.stringMatching(/^ErrorBoundary/),
    ]);
    expect(error.length).toEqual(3);
  });
});
