/*
 * Copyright 2026 The Backstage Authors
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

import { DefaultRootLoggerService, WinstonLogger } from './index';
import {
  DefaultRootAuditorService,
  WinstonRootAuditorService,
} from '../auditor';

jest.mock('winston', () => {
  throw new Error('Winston must not be loaded');
});
jest.mock('winston-transport', () => {
  throw new Error('winston-transport must not be loaded');
});
jest.mock('logform', () => {
  throw new Error('logform must not be loaded');
});
jest.mock('triple-beam', () => {
  throw new Error('triple-beam must not be loaded');
});

it('creates the default logger and auditor without loading Winston or logform', () => {
  const stdout = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
  DefaultRootLoggerService.create().info('hello');
  expect(stdout).toHaveBeenCalledTimes(1);
  expect(DefaultRootAuditorService.create()).toBeInstanceOf(
    DefaultRootAuditorService,
  );
  expect(WinstonLogger).toBe(DefaultRootLoggerService);
  expect(WinstonRootAuditorService).toBe(DefaultRootAuditorService);
});
