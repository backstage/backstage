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
import { createLogMatcher } from './utils';

describe('createLogMatcher', () => {
  const log = {
    level: 'info',
    message: 'This is a simple log from the catalog plugin',
    plugin: 'catalog',
    status: 200,
    action: 'read',
  };

  it('should match with a simple matcher', () => {
    const matcher = createLogMatcher({ plugin: 'catalog' });
    expect(matcher(log)).toEqual(true);
  });

  it('should not match with a simple matcher', () => {
    const matcher = createLogMatcher({ plugin: 'search' });
    expect(matcher(log)).toEqual(false);
  });

  it('should match with an AND matcher', () => {
    const matcher = createLogMatcher({
      plugin: 'catalog',
      action: 'read',
    });
    expect(matcher(log)).toEqual(true);
  });

  it('should not match log with an AND matcher', () => {
    const matcher = createLogMatcher({
      plugin: 'catalog',
      action: 'write',
    });
    expect(matcher(log)).toEqual(false);
  });

  it('should match with an OR matcher', () => {
    const matcher = createLogMatcher({
      plugin: ['auth', 'catalog'],
    });
    expect(matcher(log)).toEqual(true);
  });

  it('should not match log with an OR matcher', () => {
    const matcher = createLogMatcher({
      plugin: ['auth', 'search'],
    });
    expect(matcher(log)).toEqual(false);
  });

  it('should match log with a regex matcher', () => {
    const matcher = createLogMatcher({
      message: '/This is a simple log/',
    });
    expect(matcher(log)).toEqual(true);
  });

  it('should not match log with a regex matcher', () => {
    const matcher = createLogMatcher({
      message: '/^simple log/',
    });
    expect(matcher(log)).toEqual(false);
  });
});
