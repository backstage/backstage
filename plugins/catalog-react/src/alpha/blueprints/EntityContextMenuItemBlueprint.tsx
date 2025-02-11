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
  ExtensionBoundary,
  coreExtensionData,
  createExtensionBlueprint,
} from '@backstage/frontend-plugin-api';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

export type FactoryLoaderParams = {
  loader: () => Promise<JSX.Element>;
};

export type FactoryHrefParams =
  | {
      title: string;
      icon: JSX.Element;
      useHref: () => string;
    }
  | {
      title: string;
      icon: JSX.Element;
      href: string;
    };

/** @alpha */
export const EntityContextMenuItemBlueprint = createExtensionBlueprint({
  kind: 'entity-context-menu-item',
  attachTo: { id: 'page:catalog/entity', input: 'extraContextMenuItems' },
  output: [coreExtensionData.reactElement],
  *factory(params: FactoryLoaderParams | FactoryHrefParams, { node }) {
    const loaderFactory = () => {
      if ('loader' in params) {
        return params.loader;
      }

      const useHref = 'useHref' in params ? params.useHref : () => params.href;

      return async () => {
        const href = useHref();

        return (
          <MenuItem href={href}>
            <ListItemIcon>{params.icon}</ListItemIcon>
            <ListItemText primary={params.title} />
          </MenuItem>
        );
      };
    };

    yield coreExtensionData.reactElement(
      ExtensionBoundary.lazy(node, loaderFactory()),
    );
  },
});
