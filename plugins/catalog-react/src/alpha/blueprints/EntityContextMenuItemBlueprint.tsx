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

import { JSX, ReactNode } from 'react';
import {
  coreExtensionData,
  createExtensionBlueprint,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useEntityContextMenu } from '../../hooks/useEntityContextMenu';
import {
  FilterPredicate,
  filterPredicateToFilterFunction,
  createZodV4FilterPredicateSchema,
} from '@backstage/filter-predicates';
import type { Entity } from '@backstage/catalog-model';
import {
  entityContextMenuItemDataRef,
  entityFilterFunctionDataRef,
  type EntityContextMenuItemData,
} from './extensionData';

/** @alpha */
export type UseProps = () =>
  | {
      title: ReactNode;
      href: string;
      disabled?: boolean;
    }
  | {
      title: ReactNode;
      onClick: () => void | Promise<void>;
      disabled?: boolean;
    };

/** @alpha */
export type EntityContextMenuItemParams = (
  | {
      useProps: UseProps;
    }
  | {
      title: string;
      href?: string;
      onClick?: () => void | Promise<void>;
      disabled?: boolean;
    }
) & {
  icon: JSX.Element;
  filter?: FilterPredicate | ((entity: Entity) => boolean);
};

/** @alpha */
export const EntityContextMenuItemBlueprint = createExtensionBlueprint({
  kind: 'entity-context-menu-item',
  attachTo: { id: 'page:catalog/entity', input: 'contextMenuItems' },
  output: [
    coreExtensionData.reactElement.optional(),
    entityContextMenuItemDataRef.optional(),
    entityFilterFunctionDataRef.optional(),
  ],
  dataRefs: {
    data: entityContextMenuItemDataRef,
    filterFunction: entityFilterFunctionDataRef,
  },
  configSchema: {
    filter: createZodV4FilterPredicateSchema().optional(),
  },
  *factory(params: EntityContextMenuItemParams, { node, config }) {
    if ('useProps' in params) {
      const useProps = params.useProps;
      const icon = params.icon;
      const loader = async () => {
        const Component = () => {
          const { onMenuClose } = useEntityContextMenu();
          const { title, ...menuItemProps } = useProps();
          let handleClick = undefined;

          if ('onClick' in menuItemProps) {
            handleClick = () => {
              const result = menuItemProps.onClick();
              if (result && 'then' in result) {
                result.then(onMenuClose, onMenuClose);
              } else {
                onMenuClose();
              }
            };
          }

          return (
            <MenuItem {...menuItemProps} onClick={handleClick}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </MenuItem>
          );
        };

        return <Component />;
      };

      yield coreExtensionData.reactElement(
        ExtensionBoundary.lazy(node, loader),
      );
    } else {
      const data: EntityContextMenuItemData = {
        icon: params.icon,
        title: params.title,
        href: params.href,
        onClick: params.onClick,
        disabled: params.disabled,
      };
      yield entityContextMenuItemDataRef(data);
    }

    if (config.filter) {
      yield entityFilterFunctionDataRef(
        filterPredicateToFilterFunction(config.filter),
      );
    } else if (typeof params.filter === 'function') {
      yield entityFilterFunctionDataRef(params.filter);
    } else if (params.filter) {
      yield entityFilterFunctionDataRef(
        filterPredicateToFilterFunction(params.filter),
      );
    }
  },
});
