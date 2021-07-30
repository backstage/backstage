/*
 * Copyright 2021 Spotify AB
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

interface Status {
  [key: string]: JSX.Element | undefined;
}

const statuses: Status = {
  proposed: <StatusWarning data-testid="warning">proposed</StatusWarning>,
  ongoing: <StatusOK data-testid="ok">ongoing</StatusOK>,
};

type Props = {
  status: string;
  styles?: string;
};

export const StatusTag = ({ status, styles }: Props) => {
  return (
    <div data-testid={`tag-${status}`} className={styles}>
      {statuses[status]}
    </div>
  );
};
