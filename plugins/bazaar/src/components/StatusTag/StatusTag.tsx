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

import React from 'react';
import { StatusOK, StatusWarning } from '@backstage/core-components';
import { Status } from '../../util/types';

interface StatusComponent {
  [key: string]: JSX.Element | undefined;
}

const statuses: StatusComponent = {
  proposed: <StatusWarning>proposed</StatusWarning>,
  ongoing: <StatusOK>ongoing</StatusOK>,
};

type Props = {
  status: Status;
  styles?: string;
};

export const StatusTag = ({ status, styles }: Props) => {
  return <div className={styles}>{statuses[status]}</div>;
};
