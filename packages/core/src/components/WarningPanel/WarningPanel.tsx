/*
 * Copyright 2020 Spotify AB
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

import React, { FC } from 'react';
import { Typography, withStyles, makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import ErrorOutline from '@material-ui/icons/ErrorOutline';

const errorOutlineStyles = theme => ({
  root: {
    marginRight: theme.spacing(1),
    fill: theme.palette.warningText,
  },
});
const ErrorOutlineStyled = withStyles(errorOutlineStyles)(ErrorOutline);

const useStyles = makeStyles<BackstageTheme>(theme => ({
  message: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.warningBackground,
    color: theme.palette.warningText,
    verticalAlign: 'middle',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
  },
  headerText: {
    color: theme.palette.warningText,
  },
  messageText: {
    color: theme.palette.warningText,
  },
}));

/**
 * WarningPanel. Show a user friendly error message to a user similar to ErrorPanel except that the warning panel
 * only shows the warning message to the user
 */

type Props = {
  message?: React.ReactNode;
  title?: string;
};

const WarningPanel: FC<Props> = props => {
  const classes = useStyles(props);
  const { title, message, children } = props;
  return (
    <div className={classes.message}>
      <div className={classes.header}>
        <ErrorOutlineStyled />
        <Typography className={classes.headerText} variant="subtitle1">
          {title}
        </Typography>
      </div>
      {message && (
        <Typography className={classes.messageText}>{message}</Typography>
      )}
      {children}
    </div>
  );
};

export default WarningPanel;
