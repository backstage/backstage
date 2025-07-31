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
import { ComponentRef } from '../components';
import {
  createExtensionBlueprint,
  createExtensionBlueprintParams,
  createExtensionDataRef,
} from '../wiring';

export const componentDataRef = createExtensionDataRef<{
  ref: ComponentRef;
  component:
    | ((props: {}) => JSX.Element | null)
    | (() => Promise<(props: {}) => JSX.Element | null>);
  type: 'sync' | 'async';
}>().with({ id: 'core.component.component' });

export const ComponentImplementationBlueprint = createExtensionBlueprint({
  kind: 'component',
  attachTo: { id: 'api:app/components', input: 'components' },
  output: [componentDataRef],
  dataRefs: {
    component: componentDataRef,
  },
  defineParams<Ref extends ComponentRef<any>>(params: {
    ref: Ref;
    component: Ref extends ComponentRef<
      infer IInnerComponentProps,
      any,
      infer IMode
    >
      ? IMode extends 'sync'
        ? (props: IInnerComponentProps) => JSX.Element
        : IMode extends 'async'
        ? () => Promise<(props: IInnerComponentProps) => JSX.Element>
        : never
      : never;
  }) {
    return createExtensionBlueprintParams(params);
  },
  *factory(params) {
    yield componentDataRef({
      ref: params.ref,
      component: params.component,
      type: params.ref.mode,
    });
  },
});
