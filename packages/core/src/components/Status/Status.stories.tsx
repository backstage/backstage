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

import React from 'react';
import {
  StatusError,
  StatusFailed,
  StatusNA,
  StatusOK,
  StatusPending,
  StatusRunning,
  StatusWarning,
} from './Status';

export default {
  title: 'Status',
  component: StatusOK,
};

export const statusOK = () => (
  <>
    <StatusOK /> Status OK
  </>
);
export const statusWarning = () => (
  <>
    <StatusWarning /> Status Warning
  </>
);
export const statusError = () => (
  <>
    <StatusError /> Status Error
  </>
);
export const statusFailed = () => (
  <>
    <StatusFailed /> Status Failed
  </>
);
export const statusPending = () => (
  <>
    <StatusPending /> Status Pending
  </>
);
export const statusRunning = () => (
  <>
    <StatusRunning /> Status Running
  </>
);
export const statusNA = () => (
  <>
    <StatusNA /> Status NA
  </>
);
