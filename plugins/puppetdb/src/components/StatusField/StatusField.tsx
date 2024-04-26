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

import React from 'react';
import {
  StatusPending,
  StatusRunning,
  StatusOK,
  StatusError,
} from '@backstage/core-components';

type StatusCellProps = {
  status: string;
};

/**
 * Component to display status field for Puppet reports and events.
 *
 * @public
 */
export const StatusField = (props: StatusCellProps) => {
  const { status } = props;

  const statusUC = status.toLocaleUpperCase('en-US');
  switch (status) {
    case 'failed':
      return (
        <>
          <StatusError />
          {statusUC}
        </>
      );
    case 'changed':
      return (
        <>
          <StatusRunning />
          {statusUC}
        </>
      );
    case 'unchanged':
      return (
        <>
          <StatusPending />
          {statusUC}
        </>
      );
    default:
      return (
        <>
          <StatusOK />
          {statusUC}
        </>
      );
  }
};
