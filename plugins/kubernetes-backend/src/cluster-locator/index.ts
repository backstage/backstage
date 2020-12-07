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

import { ClusterDetails, ClusterLocatorMethod } from '..';
import { Config } from '@backstage/config';
import { ConfigClusterLocator } from './ConfigClusterLocator';

export { ConfigClusterLocator } from './ConfigClusterLocator';

export const getCombinedClusterDetails = async (
  clusterLocatorMethods: ClusterLocatorMethod[],
  rootConfig: Config,
): Promise<ClusterDetails[]> => {
  return Promise.all(
    clusterLocatorMethods.map(clusterLocatorMethod => {
      switch (clusterLocatorMethod) {
        case 'config':
          return ConfigClusterLocator.fromConfig(
            rootConfig.getConfigArray('kubernetes.clusters'),
          ).getClusters();
        default:
          throw new Error(
            `Unsupported kubernetes.clusterLocatorMethods: "${clusterLocatorMethod}"`,
          );
      }
    }),
  )
    .then(res => {
      return res.flat();
    })
    .catch(e => {
      throw e;
    });
};
