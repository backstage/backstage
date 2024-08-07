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
import React, { ComponentType, PropsWithChildren } from 'react';
import { createExtensionBlueprint } from '../wiring';
import { createRouterExtension } from './createRouterExtension';

export const RouterBlueprint = createExtensionBlueprint({
  kind: 'app-router-component',
  attachTo: { id: 'app/root', input: 'router' },
  output: [createRouterExtension.componentDataRef],
  *factory(
    {
      Component,
    }: {
      Component: ComponentType<
        PropsWithChildren<{
          inputs: typeof inputs;
          config: typeof config;
        }>
      >;
    },
    { config, inputs },
  ) {
    const Wrapper = (props: PropsWithChildren<{}>) => (
      <Component inputs={inputs} config={config}>
        {props.children}
      </Component>
    );

    yield createRouterExtension.componentDataRef(Wrapper);
  },
});
