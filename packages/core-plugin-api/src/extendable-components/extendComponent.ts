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

import { useMemo, DependencyList } from 'react';

import {
  ComponentExtension,
  ExtendableComponentRef,
  ExtendableComponentSpec,
} from './types';

export function extendComponent<Props, Context>(
  componentRef: ExtendableComponentRef<Props, Context>,
  extension: ExtendableComponentSpec<Props, Context>,
): ComponentExtension<Props, Context> {
  return { ref: componentRef, spec: extension };
}

export function useExtendComponent<Props, Context>(
  componentRef: ExtendableComponentRef<Props, Context>,
  extension: ExtendableComponentSpec<Props, Context>,
  deps: DependencyList,
): ComponentExtension<Props, Context> {
  return useMemo(
    () => extendComponent(componentRef, extension),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );
}
