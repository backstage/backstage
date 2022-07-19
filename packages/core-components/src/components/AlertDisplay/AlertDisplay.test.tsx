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
import { AlertDisplay } from './AlertDisplay';
import { alertApiRef } from '@backstage/core-plugin-api';
import { AlertApiForwarder } from '@backstage/core-app-api';
import Observable from 'zen-observable';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

const TEST_MESSAGE = 'TEST_MESSAGE';

describe('<AlertDisplay />', () => {
  it('renders without exploding', async () => {
    const { queryByText } = await renderInTestApp(
      <TestApiProvider apis={[[alertApiRef, new AlertApiForwarder()]]}>
        <AlertDisplay />
      </TestApiProvider>,
    );
    expect(queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
  });

  it('renders with message', async () => {
    const { queryByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            alertApiRef,
            {
              post() {},
              alert$() {
                return Observable.of({ message: TEST_MESSAGE });
              },
            },
          ],
        ]}
      >
        <AlertDisplay />
      </TestApiProvider>,
    );

    expect(queryByText(TEST_MESSAGE)).toBeInTheDocument();
  });

  describe('with multiple messages', () => {
    const apis = [
      [
        alertApiRef,
        {
          post() {},
          alert$() {
            return Observable.of(
              { message: 'message one' },
              { message: 'message two' },
              { message: 'message three' },
            );
          },
        },
      ] as const,
    ] as const;

    it('renders first message', async () => {
      const { queryByText } = await renderInTestApp(
        <TestApiProvider apis={apis}>
          <AlertDisplay />
        </TestApiProvider>,
      );

      expect(queryByText('message one')).toBeInTheDocument();
    });

    it('renders a count of remaining messages', async () => {
      const { queryByText } = await renderInTestApp(
        <TestApiProvider apis={apis}>
          <AlertDisplay />
        </TestApiProvider>,
      );

      expect(queryByText('(2 older messages)')).toBeInTheDocument();
    });
  });
});
