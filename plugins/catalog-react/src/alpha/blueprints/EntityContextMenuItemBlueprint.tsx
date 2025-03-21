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
  createExtensionDataRef,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

/** @alpha */
export type FactoryHrefParams =
  | {
      useTitle: () => string;
      icon: React.JSX.Element;
      useHref: () => string;
      useIsDisabled?: () => boolean;
    }
  | {
      useTitle: () => string;
      icon: React.JSX.Element;
      href: string;
      useIsDisabled?: () => boolean;
    };

/** @alpha */
export type FactoryDialogParams = {
  useOnClick: () => React.MouseEventHandler<HTMLLIElement>;
  useTitle: () => string;
  icon: React.JSX.Element;
  useIsDisabled?: () => boolean;
};

/** @alpha */
export type EntityContextMenuItemParams =
  | FactoryHrefParams
  | FactoryDialogParams;

export type ContextMenuItemProps = {
  onClose: () => void;
};

export type ContextMenuItemComponent = (
  props: ContextMenuItemProps,
) => React.JSX.Element;

export const contextMenuItemComponentDataRef =
  createExtensionDataRef<ContextMenuItemComponent>().with({
    id: 'catalog.contextMenuItemComponent',
  });

/** @alpha */
export const EntityContextMenuItemBlueprint = createExtensionBlueprint({
  kind: 'entity-context-menu-item',
  attachTo: { id: 'page:catalog/entity', input: 'contextMenuItems' },
  output: [contextMenuItemComponentDataRef],
  *factory(params: EntityContextMenuItemParams, { node }) {
    const loader = async (): Promise<ContextMenuItemComponent> => {
      if ('useOnClick' in params) {
        return ({ onClose }) => {
          const onClick = params.useOnClick();
          const title = params.useTitle();
          const disabled = params.useIsDisabled?.() ?? false;

          return (
            <MenuItem
              disabled={disabled}
              onClick={e => {
                onClose();
                onClick(e);
              }}
            >
              <ListItemIcon>{params.icon}</ListItemIcon>
              <ListItemText primary={title} />
            </MenuItem>
          );
        };
      }

      const useHref = 'useHref' in params ? params.useHref : () => params.href;

      return () => {
        const href = useHref();
        const title = params.useTitle();
        const disabled = params.useIsDisabled?.() ?? false;

        return (
          <MenuItem disabled={disabled} component="a" href={href}>
            <ListItemIcon>{params.icon}</ListItemIcon>
            <ListItemText primary={title} />
          </MenuItem>
        );
      };
    };

    yield contextMenuItemComponentDataRef(
      ExtensionBoundary.lazyComponent(node, loader),
    );
  },
});
