/*
 * Copyright 2020 Spotify AB
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
import { ErrorApi, ErrorContext, AlertApi } from '../../../';
import { PublishSubject } from './lib';
import { Observable } from '../../types';

export class ErrorApiForwarder implements ErrorApi {
  private readonly subject = new PublishSubject<{
    error: Error;
    context?: ErrorContext;
  }>();

  constructor(private readonly alertApi: AlertApi) {}

  post(error: Error, context?: ErrorContext) {
    if (!context?.hidden) {
      this.alertApi.post({ message: error.message, severity: 'error' });
    }

    this.subject.next({ error, context });
  }

  error$(): Observable<{ error: Error; context?: ErrorContext }> {
    return this.subject;
  }
}
