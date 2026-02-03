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
import { SignalPayload } from './types';
import { JsonObject } from '@backstage/types';

/** @public */
export interface SignalsService {
  /**
   * Publishes a signal to user refs to specific topic
   * @param signal - Signal to publish
   */
  publish<TMessage extends JsonObject = JsonObject>(
    signal: SignalPayload<TMessage>,
  ): Promise<void>;
}

/**
 * @public
 * @deprecated Use `SignalsService` instead
 */
export interface SignalService extends SignalsService {}
