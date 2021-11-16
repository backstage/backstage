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
import { Observable } from '@backstage/types';
import { PublishSubject } from '../../../lib/subjects';

/**
 * Base implementation for the ErrorApi that simply forwards errors to consumers.
 *
 * @public
 */
export class ErrorApiForwarder implements ErrorApi {
  private readonly subject = new PublishSubject<{
    error: Error;
    context?: ErrorApiErrorContext;
  }>();

  post(error: ErrorApiError, context?: ErrorApiErrorContext) {
    this.subject.next({ error, context });
  }

  error$(): Observable<{ error: Error; context?: ErrorApiErrorContext }> {
    return this.subject;
  }
}
