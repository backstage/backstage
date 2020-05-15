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

import React, { FC, useEffect, useState } from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import { alertApiRef, useApi, AlertMessage } from '../../api';

type Props = {};

export const AlertDisplay: FC<Props> = () => {
  const [messages, setMessages] = useState<Array<AlertMessage>>([]);
  const alertApi = useApi(alertApiRef);

  useEffect(() => {
    alertApi.alert$().subscribe((message) => {
      setMessages((msgs) => msgs.concat(message));
    });
  }, [alertApi]);

  if (messages.length === 0) {
    return null;
  }

  const [firstMessage] = messages;

  const handleClose = () => {
    setMessages((msgs) => msgs.filter((msg) => msg !== firstMessage));
  };

  return (
    <Snackbar
      open
      message={firstMessage.message.toString()}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
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
        {firstMessage.message.toString()}
      </Alert>
    </Snackbar>
  );
};
