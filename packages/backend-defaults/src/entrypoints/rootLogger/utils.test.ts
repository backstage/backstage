/*
 * Copyright 2025 The Backstage Authors
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
import { isLogMatching } from './utils';

describe('isLogMatching', () => {
  const log = {
    level: 'info',
    message: 'This is a simple log from the catalog plugin',
    plugin: 'catalog',
    status: 200,
    action: 'read',
  };

  it('should match with a simple matcher', () => {
    expect(
      isLogMatching(log, {
        plugin: 'catalog',
      }),
    ).toEqual(true);
  });

  it('should not match with a simple matcher', () => {
    expect(
      isLogMatching(log, {
        plugin: 'search',
      }),
    ).toEqual(false);
  });

  it('should match with an AND matcher', () => {
    expect(
      isLogMatching(log, {
        plugin: 'catalog',
        action: 'read',
      }),
    ).toEqual(true);
  });

  it('should not match log with an AND matcher', () => {
    expect(
      isLogMatching(log, {
        plugin: 'catalog',
        action: 'write',
      }),
    ).toEqual(false);
  });

  it('should match with an OR matcher', () => {
    expect(
      isLogMatching(log, {
        plugin: ['auth', 'catalog'],
      }),
    ).toEqual(true);
  });

  it('should not match log with an OR matcher', () => {
    expect(
      isLogMatching(log, {
        plugin: ['auth', 'search'],
      }),
    ).toEqual(false);
  });

  it('should match log with a regex matcher', () => {
    expect(
      isLogMatching(log, {
        message: '/This is a simple log/',
      }),
    ).toEqual(true);
  });

  it('should not match log with a regex matcher', () => {
    expect(
      isLogMatching(log, {
        message: '/^simple log/',
      }),
    ).toEqual(false);
  });
});
