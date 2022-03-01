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

/** @public */
export interface AggregatedError {
  aggregation_key: string;
  total_count: number;
  severity: string;
  latest_errors: ErrorInstance[];
}

/** @public */
export interface ErrorInstance {
  error: Error;
  uuid: string;
  timestamp: number;
  severity: string;
  http_context: HttpContext;
}

/** @public */
export interface Error {
  class: string;
  message: string;
  stacktrace?: string[];
  cause?: Error | null;
}

/** @public */
export interface HttpContext {
  request_method: string;
  request_url: string;
  request_headers: RequestHeaders;
  request_body: string;
}

/** @public */
export interface RequestHeaders {
  [k: string]: string;
}

/** @public */
export interface NotFoundInInstance {
  body: string;
}
