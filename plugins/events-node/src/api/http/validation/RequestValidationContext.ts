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

import { RequestRejectionDetails } from './RequestRejectionDetails';

/**
 * Passed context for the validation
 * at which rejections can be expressed.
 *
 * @public
 */
export interface RequestValidationContext {
  /**
   * Rejects the validated request
   *
   * @param details - Optional details about the rejection which will be provided to the sender.
   */
  reject(details?: Partial<RequestRejectionDetails>): void;
}
