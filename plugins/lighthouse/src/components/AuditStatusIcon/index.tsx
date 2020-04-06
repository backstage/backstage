/* eslint-disable react/prop-types */
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
import { StatusPending, StatusError, StatusOK } from '@backstage/core';

import { Audit } from '../../api';

const AuditStatusIcon: FC<{ audit: Audit }> = ({ audit }) => {
  if (audit.status === 'FAILED') return <StatusError />;
  if (audit.status === 'COMPLETED') return <StatusOK />;
  return <StatusPending />;
};

export default AuditStatusIcon;
