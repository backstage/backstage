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
import { Typography } from '@material-ui/core';
import { InfoCard } from '@backstage/core';

type OverviewComponentProps = {
  capabilityId?: string;
  description?: string;
  createdAt?: string;
};

const OverviewComponent: FC<OverviewComponentProps> = ({
  capabilityId,
  description,
  // createdAt,
}) => (
  <InfoCard title="Summary">
    <Typography variant="body1">
      <b>Capability ID</b> - {capabilityId}
    </Typography>
    <Typography variant="body1">
      <b>Description</b> - {description}
    </Typography>
  </InfoCard>
);

export default OverviewComponent;
