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
import { ErrorListProps } from '@rjsf/utils';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    list: {
      width: '100%',
    },
    text: {
      textWrap: 'wrap',
    },
  }),
);

/**
 * Shows a list of errors found in the form
 *
 * @public
 */
export const ErrorListTemplate = ({ errors }: ErrorListProps) => {
  const classes = useStyles();

  return (
    <Paper>
      <List dense className={classes.list}>
        {errors.map((error, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <ErrorIcon color="error" />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.text }}
              primary={error.stack}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
