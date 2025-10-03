/*
 * Copyright 2025 The Backstage Authors
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
  BackstageInstance,
  SystemMetadataService,
} from '@backstage/backend-plugin-api';
import { Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';

/**
 * @public
 */
export class MockSystemMetadataService implements SystemMetadataService {
  #instances: BackstageInstance[];

  constructor(instances: BackstageInstance[]) {
    this.#instances = instances;
  }

  public static create(options: { instances: BackstageInstance[] }) {
    return new MockSystemMetadataService(options.instances);
  }

  instances(): Observable<BackstageInstance[]> {
    return new ObservableImpl<BackstageInstance[]>(subscriber => {
      subscriber.next(this.#instances);
      subscriber.complete();
    });
  }
}
