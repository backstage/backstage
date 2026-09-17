/*
 * Copyright 2026 The Backstage Authors
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

import { SwappableComponentRef } from '@backstage/frontend-plugin-api';
import {
  createExtensionBlueprint,
  createExtensionBlueprintParams,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

export const componentDataRef = createExtensionDataRef<{
  ref: SwappableComponentRef;
  loader:
    | (() => (props: {}) => JSX.Element | null)
    | (() => Promise<(props: {}) => JSX.Element | null>);
}>().with({ id: 'core.swappableComponent' });

/**
 * Blueprint for creating swappable components from a SwappableComponentRef and a loader. This blueprint is limited to use by the app plugin.
 *
 * @public
 */
export const SwappableComponentBlueprint = createExtensionBlueprint({
  kind: 'component',
  attachTo: { id: 'api:app/swappable-components', input: 'components' },
  output: [componentDataRef],
  dataRefs: {
    component: componentDataRef,
  },
  defineParams<Ref extends SwappableComponentRef<any>>(params: {
    component: Ref extends SwappableComponentRef<
      any,
      infer IExternalComponentProps
    >
      ? { ref: Ref } & ((props: IExternalComponentProps) => JSX.Element | null)
      : never;
    loader: Ref extends SwappableComponentRef<infer IInnerComponentProps, any>
      ?
          | (() => (props: IInnerComponentProps) => JSX.Element | null)
          | (() => Promise<(props: IInnerComponentProps) => JSX.Element | null>)
      : never;
  }) {
    return createExtensionBlueprintParams(params);
  },
  factory: params => [
    componentDataRef({
      ref: params.component.ref,
      loader: params.loader,
    }),
  ],
});
