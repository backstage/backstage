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

import { ComponentType } from 'react';
import { createApiRef, useApi } from '@backstage/core-plugin-api';
import { ComponentRef } from '../../components';

/**
 * API for looking up components based on component refs.
 *
 * @public
 */
export interface ComponentsApi {
  // TODO: Should component refs also provide the default implementation so that we're guaranteed to get a component?
  getComponent<T extends {}>(ref: ComponentRef<T>): ComponentType<T>;
}

/**
 * The `ApiRef` of {@link ComponentsApi}.
 *
 * @public
 */
export const componentsApiRef = createApiRef<ComponentsApi>({
  id: 'core.components',
});

/**
 * @public
 * Returns the component associated with the given ref.
 */
export function useComponentRef<T extends {}>(
  ref: ComponentRef<T>,
): ComponentType<T> {
  const componentsApi = useApi(componentsApiRef);
  return componentsApi.getComponent<T>(ref);
}
