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

export interface Config {
  events?: {
    /**
     * Whether to use the event bus API in the events plugin backend to
     * distribute events across multiple instances when publishing and
     * subscribing to events.
     *
     * The default is 'auto', which means means that the event bus API will be
     * used if it's available, but will be disabled if the events backend
     * returns a 404.
     *
     * If set to 'never', the events service will only ever publish events
     * locally to the same instance, while if set to 'always', the event bus API
     * will never be disabled, even if the events backend returns a 404.
     */
    useEventBus?: 'never' | 'always' | 'auto';
  };
}
