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

import React from 'react';
import {
  createExtensionBlueprint,
  coreExtensionData,
} from '@backstage/frontend-plugin-api';
import IconButton from '@material-ui/core/IconButton';
import { IconComponent } from '@backstage/core-plugin-api';
import Tooltip from '@material-ui/core/Tooltip';

/** @alpha */
export const EntityHeaderActionBlueprint = createExtensionBlueprint({
  kind: 'entity-header-action',
  attachTo: { id: 'entity-header:catalog', input: 'actions' },
  output: [coreExtensionData.reactElement],
  dataRefs: {
    element: coreExtensionData.reactElement,
  },
  *factory(params: {
    tooltip: string;
    getContext: () => object;
    onClick: (options: object) => void;
    render?: (options: {
      element: JSX.Element;
      context: object;
    }) => JSX.Element;
    icon: IconComponent;
  }) {
    const { getContext: useContext, onClick, render } = params;
    const Component = () => {
      const context = useContext();
      const element = (
        <Tooltip title={params.tooltip}>
          <IconButton onClick={() => onClick(context)}>
            <params.icon />
          </IconButton>
        </Tooltip>
      );
      return render?.({ context, element }) ?? element;
    };
    yield coreExtensionData.reactElement(<Component />);
  },
});
