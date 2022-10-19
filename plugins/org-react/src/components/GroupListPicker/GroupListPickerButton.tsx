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
import { BackstageTheme } from '@backstage/theme';
import { Box, makeStyles, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import PeopleIcon from '@material-ui/icons/People';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  btn: {
    backgroundColor: 'transparent',
    border: 'none',
    margin: 0,
    padding: 0,
    width: '100%',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.5rem',
    fontStyle: 'normal',
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: '-0.25px',
    lineHeight: '32px',
    marginBottom: 0,
  },
  peopleIcon: {
    marginRight: theme.spacing(1),
  },
  arrowDownIcon: {
    marginLeft: 'auto',
  },
}));

type GroupListPickerButtonProps = {
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  group: string | undefined;
};

/** @public */
export const GroupListPickerButton = (props: GroupListPickerButtonProps) => {
  const { handleClick, group } = props;
  const classes = useStyles();

  return (
    <button
      onClick={handleClick}
      className={classes.btn}
      data-testid="group-list-picker-button"
      aria-describedby="group-list-popover"
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <PeopleIcon fontSize="large" className={classes.peopleIcon} />
        <Typography variant="h3" className={classes.title}>
          {group}
        </Typography>
        <KeyboardArrowDownIcon
          fontSize="large"
          className={classes.arrowDownIcon}
        />
      </Box>
    </button>
  );
};
