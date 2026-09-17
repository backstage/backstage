/*
 * Copyright 2022 The Backstage Authors
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

/**
 * An implementation of the AnalyticsApi that can be used to forward analytics
 * events to multiple concrete implementations.
 *
 * @public
 *
 * @example
 *
 * ```jsx
 * createApiFactory({
 *   api: analyticsApiRef,
 *   deps: { configApi: configApiRef, identityApi: identityApiRef, storageApi: storageApiRef },
 *   factory: ({ configApi, identityApi, storageApi }) =>
 *     MultipleAnalyticsApi.fromApis([
 *       VendorAnalyticsApi.fromConfig(configApi, { identityApi }),
 *       CustomAnalyticsApi.fromConfig(configApi, { identityApi, storageApi }),
 *     ]),
 * });
 * ```
 */
export class MultipleAnalyticsApi implements AnalyticsApi {
  private constructor(private readonly actualApis: AnalyticsApi[]) {}

  /**
   * Create an AnalyticsApi implementation from an array of concrete
   * implementations.
   *
   * @example
   *
   * ```jsx
   * MultipleAnalyticsApi.fromApis([
   *   SomeAnalyticsApi.fromConfig(configApi),
   *   new CustomAnalyticsApi(),
   * ]);
   * ```
   */
  static fromApis(actualApis: AnalyticsApi[]) {
    return new MultipleAnalyticsApi(actualApis);
  }

  /**
   * Forward the event to all configured analytics API implementations.
   */
  captureEvent(event: AnalyticsEvent): void {
    this.actualApis.forEach(analyticsApi => {
      try {
        analyticsApi.captureEvent(event);
      } catch {
        /* ignored */
      }
    });
  }
}
