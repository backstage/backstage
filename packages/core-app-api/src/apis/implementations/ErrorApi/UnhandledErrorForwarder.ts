/*
 * Copyright 2020 The Backstage Authors
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

import {
  ErrorApi,
  ErrorApiError,
  ErrorApiErrorContext,
} from '@backstage/core-plugin-api';

/**
 * Utility class that helps with error forwarding.
 *
 * @public
 */
export class UnhandledErrorForwarder {
  /**
   * Add event listener, such that unhandled errors can be forwarded using an given `ErrorApi` instance
   */
  static forward(errorApi: ErrorApi, errorContext: ErrorApiErrorContext) {
    window.addEventListener(
      'unhandledrejection',
      (e: PromiseRejectionEvent) => {
        errorApi.post(e.reason as ErrorApiError, errorContext);
      },
    );
  }
}
