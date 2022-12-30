/*
 * Copyright 2022 The Backstage Authors
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

import React, { useMemo } from 'react';

import { Fab, Tooltip } from '@material-ui/core';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { useLocation } from 'react-use';

import { Link } from '@backstage/core-components';

import { useStyles, combineClasses } from '../ui/styles';
import { useInteractiveLink } from '../hooks/use-interactive-link';

import { SvgIcon } from './svg-icon';
import { InteractiveLinkProps } from './types';

export function InteractiveLink(props: InteractiveLinkProps) {
  const {
    to,
    title,
    drawerIsOpen,
    supportsDrawer,
    toggleDrawer,
    DrawerButtonIcon,
  } = useInteractiveLink(props);

  const { tooltip = title } = props;

  const location = useLocation();
  const defaultSelected = useMemo(() => {
    try {
      const urlInfo = new URL(to, window.origin);
      return urlInfo.pathname === location.pathname;
    } catch (_err) {
      return false;
    }
  }, [to, location.pathname]);

  const {
    disableDrawerAction,
    actionButtons,
    selected = defaultSelected,
    icon,
    highlight,
  } = props;

  const {
    coreItem,
    pinnedItemStyle,
    itemSelected,
    itemSelectable,
    itemInDrawer,
    itemHighlight,
    expandButton,
    pinnedItemIcon,
    coreItemText,
  } = useStyles();

  return (
    <div>
      <Tooltip title={tooltip}>
        <Link to={to}>
          <div
            className={combineClasses(
              coreItem,
              pinnedItemStyle,
              highlight ? itemHighlight : '',
              drawerIsOpen ? itemInDrawer : '',
              selected ? itemSelected : itemSelectable,
            )}
          >
            <div className={pinnedItemIcon}>
              {icon ?? <SvgIcon icon={BookmarkIcon} />}
            </div>
            <div className={coreItemText}>{title}</div>
            {!supportsDrawer || disableDrawerAction ? null : (
              <Fab
                onClick={toggleDrawer}
                size="small"
                color="secondary"
                aria-label="Expand / Collapse"
                className={expandButton}
              >
                <DrawerButtonIcon />
              </Fab>
            )}
            {!actionButtons
              ? null
              : actionButtons.map((actionButton, i) => (
                  <Fab
                    key={i + actionButton.title}
                    onClick={actionButton.onClick}
                    size="small"
                    color="secondary"
                    aria-label={actionButton.title}
                    className={expandButton}
                  >
                    {actionButton.icon}
                  </Fab>
                ))}
          </div>
        </Link>
      </Tooltip>
    </div>
  );
}
