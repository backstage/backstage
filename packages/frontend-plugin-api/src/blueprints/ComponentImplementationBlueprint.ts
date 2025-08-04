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
  loader:
    | (() => (props: {}) => JSX.Element | null)
    | (() => Promise<(props: {}) => JSX.Element | null>);
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
    loader: Ref extends ComponentRef<infer IInnerComponentProps, any>
      ?
          | (() => (props: IInnerComponentProps) => JSX.Element | null)
          | (() => Promise<(props: IInnerComponentProps) => JSX.Element | null>)
      : never;
  }) {
    return createExtensionBlueprintParams(params);
  },
  factory: params => [
    componentDataRef({
      ref: params.ref,
      loader: params.loader,
    }),
  ],
});
