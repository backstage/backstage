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
import { Notification, notificationApiRef } from '@backstage/core-plugin-api';
import { ApiProvider } from '@backstage/core-app-api';
import Observable from 'zen-observable';
import {
  renderInTestApp,
  renderWithEffects,
  TestApiProvider,
  TestApiRegistry,
} from '@backstage/test-utils';

const TEST_MESSAGE = 'TEST_MESSAGE';
const alertNotification: Notification = {
  kind: 'alert',
  metadata: {
    severity: 'info',
    message: TEST_MESSAGE,
    title: 'Alert message',
    uuid: '123',
    timestamp: 2302,
  },
};
describe('<AlertDisplay />', () => {
  it('renders without exploding', async () => {
    const apis = TestApiRegistry.from([
      notificationApiRef,
      {
        post() {},
        notification$() {
          return Observable.of({});
        },
      },
    ]);

    const { queryByText } = await renderWithEffects(
      <ApiProvider apis={apis}>
        <AlertDisplay />
      </ApiProvider>,
    );
    expect(queryByText(TEST_MESSAGE)).not.toBeInTheDocument();
  });

  it('renders with message', async () => {
    const apis = TestApiRegistry.from([
      notificationApiRef,
      {
        post() {},
        notification$() {
          return Observable.of(alertNotification);
        },
      },
    ]);
    const { queryByText } = await renderWithEffects(
      <ApiProvider apis={apis}>
        <AlertDisplay />
      </ApiProvider>,
    );

    expect(queryByText(TEST_MESSAGE)).toBeInTheDocument();
  });

  describe('with multiple messages', () => {
    const notification1: Notification = {
      kind: 'alert',
      metadata: {
        severity: 'info',
        message: 'message one',
        title: 'Alert message 1',
        uuid: '123',
        timestamp: 2302,
      },
    };
    const notification2: Notification = {
      kind: 'alert',
      metadata: {
        severity: 'info',
        message: 'message two',
        title: 'Alert message 2',
        uuid: '100',
        timestamp: 2100,
      },
    };
    const notification3: Notification = {
      kind: 'alert',
      metadata: {
        severity: 'info',
        message: 'message three',
        title: 'Alert message 3',
        uuid: '80',
        timestamp: 2000,
      },
    };
    const apis = [
      [
        notificationApiRef,
        {
          post() {},
          notification$() {
            return Observable.of(notification1, notification2, notification3);
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
