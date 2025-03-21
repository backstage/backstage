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

import { ResponseError } from '@backstage/errors';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { CodeSnippet } from '../CodeSnippet';
import { CopyTextButton } from '../CopyTextButton';
import { ErrorPanel, ErrorPanelProps } from '../ErrorPanel';

export type ResponseErrorPanelClassKey = 'text' | 'divider';

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
  { name: 'BackstageResponseErrorPanel' },
);

/**
 * Renders a warning panel as the effect of a failed server request.
 *
 * @remarks
 * Has special treatment for ResponseError errors, to display rich
 * server-provided information about what happened.
 */
export function ResponseErrorPanel(props: ErrorPanelProps) {
  const { title, error, defaultExpanded } = props;
  const classes = useStyles();

  if (error.name !== 'ResponseError') {
    return (
      <ErrorPanel
        title={title ?? error.message}
        defaultExpanded={defaultExpanded}
        error={error}
      />
    );
  }

  const { body, cause } = error as ResponseError;
  const { request, response } = body;

  const errorString = `${response.statusCode}: ${cause.name}`;
  const requestString = request && `${request.method} ${request.url}`;
  const messageString = cause.message.replace(/\\n/g, '\n');
  const stackString = cause.stack?.replace(/\\n/g, '\n');
  const jsonString = JSON.stringify(body, undefined, 2);

  return (
    <ErrorPanel
      title={title ?? error.message}
      defaultExpanded={defaultExpanded}
      error={{ name: errorString, message: messageString, stack: stackString }}
    >
      {requestString && (
        <ListItem alignItems="flex-start">
          <ListItemText
            classes={{ secondary: classes.text }}
            primary="Request"
            secondary={request ? `${requestString}` : undefined}
          />
          <CopyTextButton text={requestString} />
        </ListItem>
      )}
      <>
        <Divider component="li" className={classes.divider} />
        <ListItem alignItems="flex-start">
          <ListItemText
            classes={{ secondary: classes.text }}
            primary="Full Error as JSON"
          />
        </ListItem>
        <CodeSnippet language="json" text={jsonString} showCopyCodeButton />
      </>
    </ErrorPanel>
  );
}
