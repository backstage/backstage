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

import {
  CoreBootErrorPageComponent,
  CoreErrorBoundaryFallbackComponent,
  CoreNotFoundErrorPageComponent,
  CoreProgressComponent,
} from '../types';

/** @public */
export type ComponentRef<T> = {
  id: string;
  T: T;
};

/** @public */
export function createComponentRef<T>(options: {
  id: string;
}): ComponentRef<T> {
  const { id } = options;
  return {
    id,
    get T(): T {
      throw new Error(`tried to read ComponentRef.T of ${id}`);
    },
  };
}

/** @public */
export const coreProgressComponentRef =
  createComponentRef<CoreProgressComponent>({ id: 'core.components.progress' });

/** @public */
export const coreBootErrorPageComponentRef =
  createComponentRef<CoreBootErrorPageComponent>({
    id: 'core.components.bootErrorPage',
  });

/** @public */
export const coreNotFoundErrorPageComponentRef =
  createComponentRef<CoreNotFoundErrorPageComponent>({
    id: 'core.components.notFoundErrorPage',
  });

/** @public */
export const coreErrorBoundaryFallbackComponentRef =
  createComponentRef<CoreErrorBoundaryFallbackComponent>({
    id: 'core.components.errorBoundaryFallback',
  });
