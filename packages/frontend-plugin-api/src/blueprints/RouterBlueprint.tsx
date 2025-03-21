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
>().with({ id: 'app.router.wrapper' });

/** @public */
export const RouterBlueprint = createExtensionBlueprint({
  kind: 'app-router-component',
  attachTo: { id: 'app/root', input: 'router' },
  output: [componentDataRef],
  dataRefs: {
    component: componentDataRef,
  },
  *factory({ Component }: { Component: ComponentType<PropsWithChildren<{}>> }) {
    yield componentDataRef(Component);
  },
});
