/*
 * Copyright 2023 The Backstage Authors
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
import {
  StatusOK,
  StatusError,
  StatusRunning,
  StatusWarning,
} from '@backstage/core-components';
import React from 'react';

export const Status = ({ status }: { status: string | undefined }) => {
  if (status === undefined) return null;
  const st = status.toLocaleLowerCase('en-US');
  switch (status) {
    case 'succeeded':
    case 'enabled':
    case 'complete':
      return (
        <>
          <StatusOK /> {st}
        </>
      );
    case 'scheduled':
    case 'running':
      return (
        <>
          <StatusRunning /> {st}
        </>
      );
    case 'failed':
    case 'error':
      return (
        <>
          <StatusError /> {st}
        </>
      );
    default:
      return (
        <>
          <StatusWarning /> {st}
        </>
      );
  }
};
