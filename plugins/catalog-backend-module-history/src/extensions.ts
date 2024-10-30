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

import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { HistoryConsumer } from './consumers/types';

/**
 * Allows for the management of consumers of catalog history events.
 *
 * @public
 */
export interface HistoryConsumersExtensionPoint {
  addConsumer(consumer: HistoryConsumer): void;
}

/**
 * Allows for the management of consumers of catalog history events.
 *
 * @public
 */
export const historyConsumersExtensionPoint =
  createExtensionPoint<HistoryConsumersExtensionPoint>({
    id: 'catalog.history.consumers',
  });
