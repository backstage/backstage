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

import { simpleMock } from './simpleMock';
import {
  ActionsService,
  actionsServiceRef,
} from '@backstage/backend-plugin-api/alpha';
import { actionsServiceFactory } from '@backstage/backend-defaults/alpha';

/**
 * @alpha
 */
export namespace actionsServiceMock {
  export const factory = () => actionsServiceFactory;

  export const mock = simpleMock<ActionsService>(actionsServiceRef, () => ({
    invoke: jest.fn(),
    list: jest.fn(),
  }));
}
