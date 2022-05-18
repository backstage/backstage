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

import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import { AlertMessage, useApi, alertApiRef } from '@backstage/core-plugin-api';
import pluralize from 'pluralize';

/**
 * Displays alerts from {@link @backstage/core-plugin-api#AlertApi}
 *
 * @public
 * @remarks
 *
 * Shown as SnackBar at the center top of the page by default. Configurable with props.
 */

// TODO: improve on this and promote to a shared component for use by all apps.

export type AlertDisplayProps = {
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
};

/** @public */
export function AlertDisplay(props: AlertDisplayProps) {
  const [messages, setMessages] = useState<Array<AlertMessage>>([]);
  const alertApi = useApi(alertApiRef);

  const { anchorOrigin = { vertical: 'top', horizontal: 'center' } } = props;

  useEffect(() => {
    const subscription = alertApi
      .alert$()
      .subscribe(message => setMessages(msgs => msgs.concat(message)));

    return () => {
      subscription.unsubscribe();
    };
  }, [alertApi]);

  if (messages.length === 0) {
    return null;
  }

  const [firstMessage] = messages;

  const handleClose = () => {
    setMessages(msgs => msgs.filter(msg => msg !== firstMessage));
  };

  return (
    <Snackbar open anchorOrigin={anchorOrigin}>
      <Alert
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={handleClose}
            data-testid="error-button-close"
          >
            <CloseIcon />
          </IconButton>
        }
        severity={firstMessage.severity}
      >
        <span>
          {firstMessage.message.toString()}
          {messages.length > 1 && (
            <em>{` (${messages.length - 1} older ${pluralize(
              'message',
              messages.length - 1,
            )})`}</em>
          )}
        </span>
      </Alert>
    </Snackbar>
  );
}
