/*
 * Copyright 2024 The Backstage Authors
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

import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { ZoneLevel } from '@backstage/plugin-operational-zones-common';

/**
 * Props for {@link ZoneBadge}.
 *
 * @public
 */
export interface ZoneBadgeProps {
  /** The zone level to display */
  level: ZoneLevel;
  /** Optional label override. Defaults to the level name in uppercase. */
  label?: string;
}

const useStyles = makeStyles(theme => ({
  green: {
    backgroundColor: theme.palette.success?.main ?? '#4caf50',
    color: theme.palette.success?.contrastText ?? '#fff',
  },
  yellow: {
    backgroundColor: theme.palette.warning?.main ?? '#ff9800',
    color: theme.palette.warning?.contrastText ?? '#fff',
  },
  red: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

/**
 * A small colored badge that displays an operational zone level.
 *
 * @remarks
 *
 * Fully standalone — takes a level as a prop, does not call any API.
 * Consumers pass the level directly, making it reusable in any plugin UI.
 *
 * @public
 */
export function ZoneBadge(props: ZoneBadgeProps) {
  const { level, label } = props;
  const classes = useStyles();

  return (
    <Chip
      label={label ?? level.toUpperCase()}
      size="small"
      className={classes[level]}
    />
  );
}
