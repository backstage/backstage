/*
 * Copyright 2023 The Backstage Authors
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

import { FrontendFeature } from './types';

/** @alpha */
export interface CreateFrontendOptions {}

/** @alpha */
export interface Frontend {
  add(feature: FrontendFeature): void;
  init(): void;
}

export class FrontendImpl implements Frontend {
  add(feature: FrontendFeature): void {
    throw new Error('Method not implemented.');
  }
  init(): void {
    throw new Error('Method not implemented.');
  }
}

/** @alpha */
export function createFrontend(options?: CreateFrontendOptions): Frontend {
  return new FrontendAppImpl();
}
