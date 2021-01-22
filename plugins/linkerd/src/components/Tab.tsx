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
import { useEntity } from '@backstage/plugin-catalog';
import * as React from 'react';
import { useAsync } from 'react-use';
import { linkerdPluginRef } from '../plugin';
import ReactFlow from 'react-flow-renderer';

export const Tab = () => {
  const l5d = useApi(linkerdPluginRef);
  const { entity } = useEntity();
  const { loading, value } = useAsync(() => l5d.getStatsForEntity(entity));

  if (loading) {
    return <p>Loading...</p>;
  }

  if (value) {
    if (
      !Object.values(value.incoming).length &&
      !Object.values(value.outgoing).length
    ) {
      return (
        <p>
          This service doesn't look like it's tagged with the right service, or
          linkerd is not injected.
        </p>
      );
    }
  }

  const elements = [
    { id: '1', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
    // you can also pass a React component as a label
    {
      id: '2',
      data: { label: <div>Node 2</div> },
      position: { x: 100, y: 100 },
    },
    { id: 'e1-2', source: '1', target: '2', animated: true },
  ];

  return <ReactFlow elements={elements} />;
};
