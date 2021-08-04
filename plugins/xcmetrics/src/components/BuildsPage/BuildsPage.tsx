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
import { useRouteRefParams } from '@backstage/core-plugin-api';
import { buildsRouteRef } from '../../routes';
import { BuildListComponent } from '../BuildListComponent';
import { BuildDetailsComponent, withRequest } from '../BuildDetailsComponent';
import { InfoCard } from '@backstage/core-components';

export const BuildsPage = () => {
  const { '*': buildId } = useRouteRefParams(buildsRouteRef) ?? { '*': '' };

  if (buildId) {
    const BuildDetails = withRequest(BuildDetailsComponent);

    return (
      <InfoCard title="Build Details" subheader={buildId}>
        <BuildDetails buildId={buildId} showId={false} />
      </InfoCard>
    );
  }

  return <BuildListComponent />;
};
