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

import { useApi } from '@backstage/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import React, { useState } from 'react';
import { useInterval } from 'react-use';
import { OctopusGraph } from './OctopusGraph';
import { linkerdPluginRef } from '../plugin';
import ReactFlow from 'react-flow-renderer';
import { DeploymentResponse } from '../api/types';

export const Tab = () => {
  const l5d = useApi(linkerdPluginRef);
  const { entity } = useEntity();
  const [stats, setStats] = useState<null | DeploymentResponse>(null);

  useInterval(async () => {
    setStats(await l5d.getStatsForEntity(entity));
  }, 1000);

  if (!stats) {
    return <p>Loading...</p>;
  }
  if (stats) {
    if (
      !Object.values(stats.incoming).length &&
      !Object.values(stats.outgoing).length
    ) {
      return (
        <p>
          This service doesn't look like it's tagged with the right service, or
          linkerd is not injected.
        </p>
      );
    }
  }

  return (
    <>
      <OctopusGraph stats={stats} entity={entity} />
    </>
  );
};
