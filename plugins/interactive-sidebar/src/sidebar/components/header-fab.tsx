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

import React from 'react';

import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import { Link } from '@backstage/core-components';

import {
  useStyles,
  combineClasses,
} from '@backstage/plugin-interactive-drawers';

export interface HeaderFabProps {
  to?: string;
  icon: React.ReactElement;
  title?: string;
  className?: string;
  onClick?: (ev: React.MouseEvent<HTMLElement>) => void;
}

export const HeaderFab = ({
  to,
  icon,
  title,
  className,
  onClick,
}: HeaderFabProps) => {
  const { expandButton } = useStyles();

  const wrapLink = (children: JSX.Element) =>
    !to ? children : <Link to={to}>{children}</Link>;

  return wrapLink(
    <Tooltip title={title ?? ''}>
      <Fab
        size="small"
        color="secondary"
        className={combineClasses(className, expandButton)}
        onClick={onClick}
      >
        {icon}
      </Fab>
    </Tooltip>,
  );
};
