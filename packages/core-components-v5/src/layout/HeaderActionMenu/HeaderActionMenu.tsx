/*
 * Copyright 2020 The Backstage Authors
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

import React, { Fragment, ReactElement } from 'react';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText, {
  ListItemTextProps,
} from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import MoreVert from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';

/**
 * @public
 */
export type HeaderActionMenuItem = {
  label?: ListItemTextProps['primary'];
  secondaryLabel?: ListItemTextProps['secondary'];
  icon?: ReactElement;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

const ActionItem = ({
  label,
  secondaryLabel,
  icon,
  disabled = false,
  onClick,
}: HeaderActionMenuItem) => {
  return (
    <Fragment>
      <ListItem
        data-testid="header-action-item"
        disabled={disabled}
        button
        onClick={event => {
          if (onClick) {
            onClick(event);
          }
        }}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={label} secondary={secondaryLabel} />
      </ListItem>
    </Fragment>
  );
};

/**
 * @public
 */
export type HeaderActionMenuProps = {
  actionItems: HeaderActionMenuItem[];
};

/**
 * @public
 */
export function HeaderActionMenu(props: HeaderActionMenuProps) {
  const {
    palette: {
      common: { white },
    },
  } = useTheme();
  const { actionItems } = props;
  const [open, setOpen] = React.useState(false);
  const anchorElRef = React.useRef(null);

  return (
    <Fragment>
      <IconButton
        onClick={() => setOpen(true)}
        data-testid="header-action-menu"
        ref={anchorElRef}
        style={{
          color: white,
          height: 56,
          width: 56,
          marginRight: -4,
          padding: 0,
        }}
        size="large">
        <MoreVert />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorElRef.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        onClose={() => setOpen(false)}
      >
        <List>
          {actionItems.map((actionItem, i) => {
            return (
              <ActionItem key={`header-action-menu-${i}`} {...actionItem} />
            );
          })}
        </List>
      </Popover>
    </Fragment>
  );
}
