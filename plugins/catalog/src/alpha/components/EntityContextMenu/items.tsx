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

import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { MenuItem as BuiMenuItem } from '@backstage/ui';
import type { EntityContextMenuItemData } from '@backstage/plugin-catalog-react/alpha';
import { useEntityContextMenu } from '../../../context/EntityContextMenuContext';

interface ContextMenuItemProps {
  data: EntityContextMenuItemData;
}

/** @internal */
export function MuiContextMenuItem(props: ContextMenuItemProps) {
  const { icon, title, href, onClick, disabled } = props.data;
  const { onMenuClose } = useEntityContextMenu();
  const handleClick = onClick
    ? () => {
        const result = onClick();
        if (result && 'then' in result) {
          result.then(onMenuClose, onMenuClose);
        } else {
          onMenuClose();
        }
      }
    : undefined;

  if (href) {
    return (
      <MenuItem
        component="a"
        href={href}
        disabled={disabled}
        onClick={handleClick}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </MenuItem>
    );
  }

  return (
    <MenuItem disabled={disabled} onClick={handleClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </MenuItem>
  );
}

/** @internal */
export function BuiContextMenuItem(props: ContextMenuItemProps) {
  const { icon, title, href, onClick, disabled } = props.data;
  return (
    <BuiMenuItem
      iconStart={icon}
      href={href}
      onAction={onClick ? () => void onClick() : undefined}
      isDisabled={disabled}
    >
      {title}
    </BuiMenuItem>
  );
}
