/*
 * Copyright 2021 The Backstage Authors
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

/**
 * Common analytics context attributes.
 */
export type CommonAnalyticsContext = {
  /**
   * The nearest known parent plugin where the event was captured.
   */
  pluginId: string;

  /**
   * The ID of the routeRef that was active when the event was captured.
   */
  routeRef: string;

  /**
   * The nearest known parent extension where the event was captured.
   */
  extension: string;
};

/**
 * Allow arbitrary scalar values as context attributes too.
 */
export type AnyAnalyticsContext = {
  [param in string]: string | boolean | number | undefined;
};

/**
 * Analytics context envelope.
 */
export type AnalyticsContextValue = CommonAnalyticsContext &
  AnyAnalyticsContext;
