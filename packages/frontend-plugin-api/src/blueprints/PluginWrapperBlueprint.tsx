/*
 * Copyright 2024 The Backstage Authors
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

import { ReactNode } from 'react';
import {
  createExtensionBlueprint,
  createExtensionBlueprintParams,
  createExtensionDataRef,
} from '../wiring';

/**
 * A definition of a plugin wrapper. Either with or without a shared value created through `useWrapperValue`.
 *
 * @public
 */
export type PluginWrapperDefinition<TValue = unknown | never> = {
  /**
   * Creates a shared value that is forwarded as the `value` prop to the
   * component.
   *
   * @remarks
   *
   * This function obeys the rules of React hooks and is only
   * invoked in a single location in the app. Note that the hook will not be
   * called until a component from the plugin is rendered.
   * @returns
   */
  useWrapperValue?: () => TValue;
  component: (props: {
    children: ReactNode;
    value: NoInfer<TValue>;
  }) => JSX.Element | null;
};

const wrapperDataRef = createExtensionDataRef<
  () => Promise<PluginWrapperDefinition>
>().with({ id: 'core.plugin-wrapper.loader' });

/**
 * Creates extensions that wrap plugin extensions with providers.
 *
 * @public
 */
export const PluginWrapperBlueprint = createExtensionBlueprint({
  kind: 'plugin-wrapper',
  attachTo: { id: 'api:app/plugin-wrapper', input: 'wrappers' },
  output: [wrapperDataRef],
  dataRefs: {
    wrapper: wrapperDataRef,
  },
  defineParams<TValue = never>(params: {
    loader: () => Promise<PluginWrapperDefinition<TValue>>;
  }) {
    return createExtensionBlueprintParams(
      params as { loader: () => Promise<PluginWrapperDefinition> },
    );
  },
  *factory(params) {
    yield wrapperDataRef(params.loader);
  },
});
