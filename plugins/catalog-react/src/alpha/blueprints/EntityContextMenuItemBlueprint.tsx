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
  DialogApiDialog,
  ExtensionBoundary,
  coreExtensionData,
  createExtensionBlueprint,
  dialogApiRef,
} from '@backstage/frontend-plugin-api';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

/** @alpha */
export type FactoryLoaderParams = {
  loader: () => Promise<JSX.Element>;
};

/** @alpha */
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
export type FactoryDialogParams = {
  dialogLoader: () => Promise<
    ({ dialog }: { dialog: DialogApiDialog }) => JSX.Element
  >;
  title: string;
  icon: JSX.Element;
};

/** @alpha */
export type EntityContextMenuItemParams =
  | FactoryLoaderParams
  | FactoryHrefParams
  | FactoryDialogParams;

/** @alpha */
export const EntityContextMenuItemBlueprint = createExtensionBlueprint({
  kind: 'entity-context-menu-item',
  attachTo: { id: 'page:catalog/entity', input: 'contextMenuItems' },
  output: [coreExtensionData.reactElement],
  *factory(params: EntityContextMenuItemParams, { node, apis }) {
    const loaderFactory = () => {
      if ('loader' in params) {
        return params.loader;
      }

      if ('dialogLoader' in params) {
        const dialogApi = apis.get(dialogApiRef);
        return async () => {
          const Dialog = await params.dialogLoader();
          return (
            <MenuItem onClick={() => dialogApi?.show(Dialog)}>
              <ListItemIcon>{params.icon}</ListItemIcon>
              <ListItemText primary={params.title} />
            </MenuItem>
          );
        };
      }

      const useHref = 'useHref' in params ? params.useHref : () => params.href;

      return async () => {
        const href = useHref();

        return (
          <MenuItem component="a" href={href}>
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
