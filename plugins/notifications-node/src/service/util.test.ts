/*
 * Copyright 2024 The Backstage Authors
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
import { ConfigReader } from '@backstage/config';
import { getAbsoluteNotificationLink } from './util';
import { NotificationSendOptions } from './DefaultNotificationService';

describe('getAbsoluteNotificationLink', () => {
  const config = new ConfigReader({
    app: { baseUrl: 'https://demo.backstage.io' },
  });
  const notificationBase: NotificationSendOptions = {
    recipients: { type: 'broadcast' },
    payload: { title: 'Test' },
  };

  it('should work with relative links', () => {
    expect(
      getAbsoluteNotificationLink(config, {
        ...notificationBase,
        payload: { ...notificationBase.payload, link: '/catalog' },
      }),
    ).toEqual('https://demo.backstage.io/catalog');
  });

  it('should work with absolute links', () => {
    expect(
      getAbsoluteNotificationLink(config, {
        ...notificationBase,
        payload: { ...notificationBase.payload, link: 'https://example.com' },
      }),
    ).toEqual('https://example.com/');
  });

  it('should return default for empty link', () => {
    expect(getAbsoluteNotificationLink(config, notificationBase)).toEqual(
      'https://demo.backstage.io/notifications',
    );
  });

  it('should return default for invalid protocol', () => {
    expect(
      getAbsoluteNotificationLink(config, {
        ...notificationBase,
        payload: { ...notificationBase.payload, link: 'ftp://example.com' },
      }),
    ).toEqual('https://demo.backstage.io/notifications');
  });
});
