/*
 * Copyright 2021 The Backstage Authors
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

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React, { PropsWithChildren } from 'react';
import { CopyTextButton } from '../CopyTextButton';
import { WarningPanel } from '../WarningPanel';

/** @public */
export type ErrorPanelClassKey = 'text' | 'divider';

const useStyles = makeStyles(
  theme => ({
    text: {
      fontFamily: 'monospace',
      whiteSpace: 'pre',
      overflowX: 'auto',
      marginRight: theme.spacing(2),
    },
    divider: {
      margin: theme.spacing(2),
    },
  }),
  { name: 'BackstageErrorPanel' },
);

type ErrorListProps = {
  error: string;
  message: string;
  request?: string;
  stack?: string;
  json?: string;
};

const ErrorList = ({
  error,
  message,
  stack,
  children,
}: PropsWithChildren<ErrorListProps>) => {
  const classes = useStyles();

  return (
    <List dense>
      <ListItem alignItems="flex-start">
        <ListItemText
          classes={{ secondary: classes.text }}
          primary="Error"
          secondary={error}
        />
        <CopyTextButton text={error} />
      </ListItem>

      <ListItem alignItems="flex-start">
        <ListItemText
          classes={{ secondary: classes.text }}
          primary="Message"
          secondary={message}
        />
        <CopyTextButton text={message} />
      </ListItem>

      {stack && (
        <ListItem alignItems="flex-start">
          <ListItemText
            classes={{ secondary: classes.text }}
            primary="Stack Trace"
            secondary={stack}
          />
          <CopyTextButton text={stack} />
        </ListItem>
      )}

      {children}
    </List>
  );
};

/** @public */
export type ErrorPanelProps = {
  error: Error;
  defaultExpanded?: boolean;
  titleFormat?: string;
  title?: string;
};

/**
 * Renders a warning panel as the effect of an error.
 *
 * @public
 */
export function ErrorPanel(props: PropsWithChildren<ErrorPanelProps>) {
  const { title, error, defaultExpanded, titleFormat, children } = props;
  return (
    <WarningPanel
      severity="error"
      title={title ?? error.message}
      defaultExpanded={defaultExpanded}
      titleFormat={titleFormat}
    >
      <ErrorList
        error={error.name}
        message={error.message}
        stack={error.stack}
        children={children}
      />
    </WarningPanel>
  );
}
