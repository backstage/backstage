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
import { Link, InfoCard } from '@backstage/core-components';
import { Typography } from '@material-ui/core';
import { useRouteRef } from '@backstage/core-plugin-api';
import Cancel from '@material-ui/icons/Cancel';

import { rootRouteRef, flyteDomainRouteRef } from '../../routes';

export type FlyteIdComponentProps = {
  project: string;
  domain?: string;
  workflowName?: string;
};

export const FlyteIdComponent = ({
  project,
  domain,
  workflowName,
}: FlyteIdComponentProps) => {
  const getFlyteDomainRouteRef = useRouteRef(flyteDomainRouteRef);
  const getRootRouteRef = useRouteRef(rootRouteRef);

  return (
    <InfoCard title="Identifier">
      <Typography variant="body1">project: {project}</Typography>
      {domain && (
        <Typography variant="body1">
          {' '}
          domain: {domain}
          <Link to={getRootRouteRef()}>
            <Cancel fontSize="small" />
          </Link>
        </Typography>
      )}
      {domain && workflowName && (
        <Typography variant="body1">
          workflow: {workflowName}
          <Link
            to={getFlyteDomainRouteRef({ project: project, domain: domain })}
          >
            <Cancel fontSize="small" />
          </Link>
        </Typography>
      )}
    </InfoCard>
  );
};
