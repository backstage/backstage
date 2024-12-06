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

import { ComponentType, PropsWithChildren } from 'react';
import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';

const componentDataRef = createExtensionDataRef<
  ComponentType<PropsWithChildren<{}>>
>().with({ id: 'app.root.wrapper' });

/**
 * Creates a extensions that render a React wrapper at the app root, enclosing
 * the app layout. This is useful for example for adding global React contexts
 * and similar.
 *
 * @public
 */
export const AppRootWrapperBlueprint = createExtensionBlueprint({
  kind: 'app-root-wrapper',
  attachTo: { id: 'app/root', input: 'wrappers' },
  output: [componentDataRef],
  dataRefs: {
    component: componentDataRef,
  },
  *factory(params: { Component: ComponentType<PropsWithChildren<{}>> }) {
    // todo(blam): not sure that this wrapping is even necessary anymore.
    const Component = (props: PropsWithChildren<{}>) => {
      return <params.Component>{props.children}</params.Component>;
    };

    yield componentDataRef(Component);
  },
});
