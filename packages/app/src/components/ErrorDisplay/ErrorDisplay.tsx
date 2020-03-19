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
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ErrorApi, ErrorContext } from '@spotify-backstage/core';

type SubscriberFunc = (error: Error) => void;
type Unsubscribe = () => void;

export class ErrorDisplayForwarder implements ErrorApi {
  private readonly subscribers = new Set<SubscriberFunc>();

  post(error: Error, context?: ErrorContext) {
    if (context?.hidden) {
      return;
    }

    this.subscribers.forEach(subscriber => subscriber(error));
  }

  subscribe(func: SubscriberFunc): Unsubscribe {
    this.subscribers.add(func);

    return () => {
      this.subscribers.delete(func);
    };
  }
}

type Props = {
  forwarder: ErrorDisplayForwarder;
};

const ErrorDisplay: FC<Props> = ({ forwarder }) => {
  const [errors, setErrors] = useState<Array<Error>>([]);

  useEffect(() => {
    return forwarder.subscribe(error => setErrors(errs => errs.concat(error)));
  }, [forwarder]);

  if (errors.length === 0) {
    return null;
  }

  const [firstError] = errors;

  const handleClose = () => {
    setErrors(errs => errs.filter(err => err !== firstError));
  };

  return (
    <Snackbar
      open
      message={firstError.toString()}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="error">
        {firstError.toString()}
      </Alert>
    </Snackbar>
  );
};

ErrorDisplay.propTypes = {
  forwarder: PropTypes.instanceOf(ErrorDisplayForwarder).isRequired,
};

export default ErrorDisplay;
