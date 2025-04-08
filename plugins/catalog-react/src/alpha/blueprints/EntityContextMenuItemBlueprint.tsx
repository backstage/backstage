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
import { useEntityContextMenu } from '../../hooks/useEntityContextMenu';

/** @alpha */
export type UseProps = () =>
  | {
      title: React.ReactNode;
      href: string;
      disabled?: boolean;
    }
  | {
      title: React.ReactNode;
      onClick: () => void | Promise<void>;
      disabled?: boolean;
    };

/** @alpha */
export type EntityContextMenuItemParams = {
  useProps: UseProps;
  icon: React.JSX.Element;
};

/** @alpha */
export type ContextMenuItemComponent = (props: {}) => React.JSX.Element;

/** @alpha */
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
      return () => {
        const { onMenuClose } = useEntityContextMenu();
        const { title, ...menuItemProps } = params.useProps();
        let handleClick = undefined;

        if ('onClick' in menuItemProps) {
          handleClick = () => {
            const result = menuItemProps.onClick();
            if (result && 'finally' in result) {
              result.finally(onMenuClose);
            } else {
              onMenuClose();
            }
          };
        }

        return (
          <MenuItem {...menuItemProps} onClick={handleClick}>
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
