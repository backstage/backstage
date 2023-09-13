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

import React from 'react';
import {
  createExtension,
  coreExtensionData,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import { useRoutes } from 'react-router-dom';

export const CoreRoutes = createExtension({
  id: 'core.routes',
  at: 'core.layout/content',
  inputs: {
    routes: createExtensionInput({
      path: coreExtensionData.routePath,
      ref: coreExtensionData.routeRef,
      element: coreExtensionData.reactElement,
    }),
  },
  output: {
    element: coreExtensionData.reactElement,
  },
  factory({ bind, inputs }) {
    const Routes = () => {
      const element = useRoutes(
        inputs.routes.map(route => ({
          path: route.path,
          element: route.element,
        })),
      );

      return element;
    };
    bind({
      element: <Routes />,
    });
  },
});
