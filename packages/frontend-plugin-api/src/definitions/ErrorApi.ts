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

import { ApiRef, createApiRef } from '../system';
import { Observable } from '@backstage/types';

/**
 * Mirrors the JavaScript Error class, for the purpose of
 * providing documentation and optional fields.
 *
 * @public
 */
export type ErrorApiError = {
  name: string;
  message: string;
  stack?: string;
};

/**
 * Provides additional information about an error that was posted to the application.
 *
 * @public
 */
export type ErrorApiErrorContext = {
  /**
   * If set to true, this error should not be displayed to the user.
   *
   * Hidden errors are typically not displayed in the UI, but the ErrorApi
   * implementation may still report them to error tracking services
   * or other utilities that care about all errors.
   *
   * @defaultValue false
   */
  hidden?: boolean;
};

/**
 * The error API is used to report errors to the app, and display them to the user.
 *
 * @remarks
 *
 * Plugins can use this API as a method of displaying errors to the user, but also
 * to report errors for collection by error reporting services.
 *
 * If an error can be displayed inline, e.g. as feedback in a form, that should be
 * preferred over relying on this API to display the error. The main use of this API
 * for displaying errors should be for asynchronous errors, such as a failing background process.
 *
 * Even if an error is displayed inline, it should still be reported through this API
 * if it would be useful to collect or log it for debugging purposes, but with
 * the hidden flag set. For example, an error arising from form field validation
 * should probably not be reported, while a failed REST call would be useful to report.
 *
 * @public
 */
export type ErrorApi = {
  /**
   * Post an error for handling by the application.
   */
  post(error: ErrorApiError, context?: ErrorApiErrorContext): void;

  /**
   * Observe errors posted by other parts of the application.
   */
  error$(): Observable<{
    error: ErrorApiError;
    context?: ErrorApiErrorContext;
  }>;
};

/**
 * The {@link ApiRef} of {@link ErrorApi}.
 *
 * @public
 */
export const errorApiRef: ApiRef<ErrorApi> = createApiRef({
  id: 'core.error',
});
