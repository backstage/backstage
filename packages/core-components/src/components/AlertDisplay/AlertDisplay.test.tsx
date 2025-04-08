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

import { AlertMessage, alertApiRef } from '@backstage/core-plugin-api';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { fireEvent, screen } from '@testing-library/react';

import { AlertApiForwarder } from '@backstage/core-app-api';
import { AlertDisplay } from './AlertDisplay';
import Observable from 'zen-observable';
import React from 'react';
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

  describe('with multiple transient messages', () => {
    const alert$ = () =>
      new Observable<AlertMessage>(subscriber => {
        subscriber.next({
          message: 'transient message one',
          display: 'transient',
        });
        setTimeout(() => {
          subscriber.next({
            message: 'transient message two',
            display: 'transient',
          });
        }, 1000);
        setTimeout(() => {
          subscriber.next({
            message: 'transient message three',
            display: 'transient',
          });
        }, 2000);
      });

    const apis = [
      [
        alertApiRef,
        {
          post() {},
          alert$,
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
      // Validate adding messages
      expect(queryByText('transient message one')).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(queryByText('transient message one')).toBeInTheDocument();
      expect(queryByText('(1 older message)')).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(queryByText('transient message one')).toBeInTheDocument();
      expect(queryByText('(2 older messages)')).toBeInTheDocument();

      // Validate removing messages
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(queryByText('transient message two')).toBeInTheDocument();
      expect(queryByText('(1 older message)')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(queryByText('transient message three')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(queryByText('transient message')).not.toBeInTheDocument();
      jest.useRealTimers();
    });

    it('renders 3 different messages with overlapping timeout', async () => {
      jest.useFakeTimers();
      const { queryByText } = await renderInTestApp(
        <TestApiProvider apis={apis}>
          <AlertDisplay transientTimeoutMs={1500} />
        </TestApiProvider>,
      );

      // 3 messages stacked with 1.5s each, display times: 0-1.5, 1.5-3, 3-4.5

      // 0s in, only message 1
      expect(queryByText('transient message one')).toBeInTheDocument();

      // 1s in, message 1 still shown, message 2 added in background
      act(() => jest.advanceTimersByTime(1000));
      expect(queryByText('transient message one')).toBeInTheDocument();
      expect(queryByText('(1 older message)')).toBeInTheDocument();

      // 2s in, message 2 now shown, message 3 added
      act(() => jest.advanceTimersByTime(1000));
      expect(queryByText('transient message two')).toBeInTheDocument();
      expect(queryByText('(1 older message)')).toBeInTheDocument();

      // 3.5s in, message 3 now shown
      act(() => jest.advanceTimersByTime(1500));
      expect(queryByText('transient message three')).toBeInTheDocument();

      // 5s in, all messages gone
      act(() => jest.advanceTimersByTime(1500));
      expect(queryByText('transient message three')).not.toBeInTheDocument();
      jest.useRealTimers();
    });

    it('renders 3 different messages with overlapping timeout and manual removal', async () => {
      jest.useFakeTimers();
      const { queryByText } = await renderInTestApp(
        <TestApiProvider apis={apis}>
          <AlertDisplay transientTimeoutMs={1500} />
        </TestApiProvider>,
      );

      // 3 messages stacked with 1.5s each, display times: 0-1.5, 1.5-3, 3-4.5

      // 0s in, only message 1
      expect(queryByText('transient message one')).toBeInTheDocument();

      // 1s in, message 1 still shown, message 2 added in background
      act(() => jest.advanceTimersByTime(1000));
      expect(queryByText('transient message one')).toBeInTheDocument();
      expect(queryByText('(1 older message)')).toBeInTheDocument();

      // manually remove message 1
      fireEvent.click(screen.getByTestId('error-button-close'));
      expect(screen.getByText('transient message two')).toBeInTheDocument();

      // 2s in, message 2 now shown, message 3 added
      act(() => jest.advanceTimersByTime(1000));
      expect(queryByText('transient message two')).toBeInTheDocument();
      expect(queryByText('(1 older message)')).toBeInTheDocument();

      // 3s in, message 3 now shown
      act(() => jest.advanceTimersByTime(1500));
      expect(queryByText('transient message three')).toBeInTheDocument();

      // 4s in, all messages gone
      act(() => jest.advanceTimersByTime(1500));
      expect(queryByText('transient message three')).not.toBeInTheDocument();
      jest.useRealTimers();
    });
  });

  describe('with multiple messages of mixed display', () => {
    const alert$ = () =>
      new Observable<AlertMessage>(subscriber => {
        subscriber.next({
          message: 'transient message one',
          display: 'transient',
        });
        setTimeout(() => {
          subscriber.next({
            message: 'permanent message',
            display: 'permanent',
          });
        }, 1000);
        setTimeout(() => {
          subscriber.next({
            message: 'transient message three',
            display: 'transient',
          });
        }, 2000);
      });

    const apis = [
      [
        alertApiRef,
        {
          post() {},
          alert$,
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
      // Validate adding messages
      expect(queryByText('transient message one')).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(queryByText('transient message one')).toBeInTheDocument();
      expect(queryByText('(1 older message)')).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(queryByText('transient message one')).toBeInTheDocument();
      expect(queryByText('(2 older messages)')).toBeInTheDocument();

      // Validate removing messages
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(queryByText('permanent message')).toBeInTheDocument();
      expect(queryByText('(1 older message)')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('error-button-close'));
      expect(queryByText('transient message three')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(queryByText('transient message')).not.toBeInTheDocument();
      jest.useRealTimers();
    });
  });
});
