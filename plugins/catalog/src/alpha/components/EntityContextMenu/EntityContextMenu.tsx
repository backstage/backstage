/*
 * Copyright 2026 The Backstage Authors
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
  type AppNode,
  ExtensionBoundary,
  IconComponent,
  useTranslationRef,
} from '@backstage/frontend-plugin-api';
import type { EntityContextMenuItemData } from '@backstage/plugin-catalog-react/alpha';
import {
  ButtonIcon,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from '@backstage/ui';
import { RiMore2Line } from '@remixicon/react';
import { catalogTranslationRef } from '../../translation';

export type EntityContextMenuItemDataWithNode = {
  data: EntityContextMenuItemData;
  node: AppNode;
};

function EntityContextMenuItemContent(props: {
  data: EntityContextMenuItemData;
}) {
  const { icon, useProps } = props.data;
  const { title, disabled, onClick, ...menuItemProps } = useProps();
  const onAction = onClick
    ? () => {
        const result = onClick();
        if (result) {
          // Prevent rejected async actions from becoming unhandled rejections.
          void result.catch(() => {});
        }
      }
    : undefined;

  if ('href' in menuItemProps) {
    return (
      <MenuItem
        iconStart={icon}
        href={menuItemProps.href}
        onAction={onAction}
        isDisabled={disabled}
      >
        {title}
      </MenuItem>
    );
  }

  return (
    <MenuItem iconStart={icon} onAction={onAction} isDisabled={disabled}>
      {title}
    </MenuItem>
  );
}

function EntityContextMenuItem(props: {
  item: EntityContextMenuItemDataWithNode;
}) {
  return (
    <ExtensionBoundary node={props.item.node}>
      <EntityContextMenuItemContent data={props.item.data} />
    </ExtensionBoundary>
  );
}

/** @alpha */
export function EntityContextMenu(props: {
  UNSTABLE_extraContextMenuItems?: {
    title: string;
    Icon: IconComponent;
    onClick: () => void;
  }[];
  contextMenuItems?: EntityContextMenuItemDataWithNode[];
}) {
  const { UNSTABLE_extraContextMenuItems, contextMenuItems } = props;
  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <MenuTrigger>
      <ButtonIcon
        variant="secondary"
        icon={<RiMore2Line />}
        aria-label={t('entityContextMenu.moreButtonAriaLabel')}
      />
      <Menu placement="bottom end">
        {UNSTABLE_extraContextMenuItems?.map((item, index) => (
          <MenuItem
            key={`${item.title}-${index}`}
            iconStart={<item.Icon />}
            onAction={() => item.onClick()}
          >
            {item.title}
          </MenuItem>
        ))}
        {UNSTABLE_extraContextMenuItems?.length && contextMenuItems?.length ? (
          <MenuSeparator />
        ) : null}
        {contextMenuItems?.map(item => (
          <EntityContextMenuItem key={item.node.spec.id} item={item} />
        ))}
      </Menu>
    </MenuTrigger>
  );
}
