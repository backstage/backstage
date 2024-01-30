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

import { AnalyticsApi, AnalyticsEvent } from '@backstage/core-plugin-api';
import {
  AnalyticsApi as NewAnalyicsApi,
  AnalyticsEvent as NewAnalyicsEvent,
} from '@backstage/frontend-plugin-api';

/**
 * Base implementation for the AnalyticsApi that does nothing.
 *
 * @public
 */
export class NoOpAnalyticsApi implements AnalyticsApi, NewAnalyicsApi {
  captureEvent(_event: AnalyticsEvent | NewAnalyicsEvent): void {}
}
