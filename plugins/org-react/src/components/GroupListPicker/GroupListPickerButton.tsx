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
import { makeStyles, Typography, Button } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import PeopleIcon from '@material-ui/icons/People';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  btn: {
    padding: '10px',
    width: '100%',
    cursor: 'pointer',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.5rem',
    fontStyle: 'normal',
    fontWeight: theme.typography.fontWeightBold,
    height: '32px',
    letterSpacing: '-0.25px',
    marginBottom: 0,
    marginLeft: '4px',
    textAlign: 'left',
    textTransform: 'none',
    width: '100%',
  },
  icon: {
    transform: 'scale(1.5)',
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
    <Button
      onClick={handleClick}
      data-testid="group-list-picker-button"
      aria-describedby="group-list-popover"
      startIcon={<PeopleIcon className={classes.icon} />}
      className={classes.btn}
      size="large"
      endIcon={<KeyboardArrowDownIcon className={classes.icon} />}
    >
      <Typography className={classes.title}>{group}</Typography>
    </Button>
  );
};
