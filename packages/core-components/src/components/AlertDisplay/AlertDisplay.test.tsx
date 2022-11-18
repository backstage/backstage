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
import { screen } from '@testing-library/react';
import { AlertDisplay } from './AlertDisplay';
import { alertApiRef, AlertMessage } from '@backstage/core-plugin-api';
import { AlertApiForwarder } from '@backstage/core-app-api';
import Observable from 'zen-observable';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { act } from '@testing-library/react';

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
    await renderInTestApp(
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

    expect(screen.getByText(TEST_MESSAGE)).toBeInTheDocument();
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
      await renderInTestApp(
        <TestApiProvider apis={apis}>
          <AlertDisplay />
        </TestApiProvider>,
      );

      expect(screen.getByText('message one')).toBeInTheDocument();
    });

    it('renders a count of remaining messages', async () => {
      await renderInTestApp(
        <TestApiProvider apis={apis}>
          <AlertDisplay />
        </TestApiProvider>,
      );

      expect(screen.getByText('(2 older messages)')).toBeInTheDocument();
    });
  });

  describe('with transient message', () => {
    const apis = [
      [
        alertApiRef,
        {
          post() {},
          alert$() {
            return Observable.of<AlertMessage>({
              message: 'transient message one',
              display: 'transient',
            });
          },
        },
      ] as const,
    ] as const;

    it('renders message and then removes it', async () => {
      jest.useFakeTimers();
      const { queryByText } = await renderInTestApp(
        <TestApiProvider apis={apis}>
          <AlertDisplay />
        </TestApiProvider>,
      );

      expect(queryByText('transient message one')).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(5005);
      });
      expect(queryByText('transient message one')).not.toBeInTheDocument();
      jest.useRealTimers();
    });

    it('respects transientTimeoutMs prop', async () => {
      jest.useFakeTimers();
      const { queryByText } = await renderInTestApp(
        <TestApiProvider apis={apis}>
          <AlertDisplay transientTimeoutMs={2500} />
        </TestApiProvider>,
      );

      expect(queryByText('transient message one')).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(2505);
      });
      expect(queryByText('transient message one')).not.toBeInTheDocument();
      jest.useRealTimers();
    });
  });

  // What I'd like to do here is be able to trigger a few messages with a bit of time between each
  // Then be able to check that they close one after the other, just not sure how to set that up?
  describe('with multiple transient messages', () => {
    const apis = [
      [
        alertApiRef,
        {
          post() {},
          alert$() {
            return Observable.of<AlertMessage>(
              {
                message: 'transient message one',
                display: 'transient',
              },
              {
                message: 'transient message two',
                display: 'transient',
              },
              {
                message: 'transient message three',
                display: 'transient',
              },
            );
          },
        },
      ] as const,
    ] as const;

    it('renders message and then removes it', async () => {
      jest.useFakeTimers();
      const { queryByText } = await renderInTestApp(
        <TestApiProvider apis={apis}>
          <AlertDisplay />
        </TestApiProvider>,
      );

      expect(queryByText('transient message one')).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(5005);
      });
      expect(queryByText('transient message one')).not.toBeInTheDocument();
      jest.useRealTimers();
    });
  });
});
