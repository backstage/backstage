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
  AppRootWrapperBlueprint,
  coreExtensionData,
  createExtension,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import React, { Fragment } from 'react';

// TODO: move to app/layout?
export const AppRoot = createExtension({
  namespace: 'app',
  name: 'root',
  attachTo: { id: 'app', input: 'root' },
  inputs: {
    children: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
    }),
    elements: createExtensionInput([coreExtensionData.reactElement]),
    wrappers: createExtensionInput([
      AppRootWrapperBlueprint.dataRefs.component,
    ]),
  },
  output: [coreExtensionData.reactElement],
  factory({ inputs }) {
    let content: React.ReactNode = (
      <>
        {inputs.elements.map(el => (
          <Fragment key={el.node.spec.id}>
            {el.get(coreExtensionData.reactElement)}
          </Fragment>
        ))}
        {inputs.children.get(coreExtensionData.reactElement)}
      </>
    );

    for (const wrapper of inputs.wrappers) {
      const Component = wrapper.get(AppRootWrapperBlueprint.dataRefs.component);
      content = <Component>{content}</Component>;
    }

    return [coreExtensionData.reactElement(content)];
  },
});
