/*
 * Copyright 2023 The Backstage Authors
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

import { AksClusterLinksFormatter } from './AksClusterLinksFormatter';
import { ClusterLinksFormatter } from '../../types';
import { EksClusterLinksFormatter } from './EksClusterLinksFormatter';
import { GkeClusterLinksFormatter } from './GkeClusterLinksFormatter';
import { StandardClusterLinksFormatter } from './StandardClusterLinksFormatter';
import { OpenshiftClusterLinksFormatter } from './OpenshiftClusterLinksFormatter';
import { RancherClusterLinksFormatter } from './RancherClusterLinksFormatter';
import { HeadlampClusterLinksFormatter } from './HeadlampClusterLinksFormatter';
import { ProfileInfoApi } from '@backstage/core-plugin-api';

export {
  StandardClusterLinksFormatter,
  AksClusterLinksFormatter,
  EksClusterLinksFormatter,
  GkeClusterLinksFormatter,
  OpenshiftClusterLinksFormatter,
  RancherClusterLinksFormatter,
  HeadlampClusterLinksFormatter,
};

/** @public */
export const DEFAULT_FORMATTER_NAME = 'standard';

/** @public */
export function getDefaultFormatters(deps: {
  googleAuthApi: ProfileInfoApi;
}): Record<string, ClusterLinksFormatter> {
  return {
    standard: new StandardClusterLinksFormatter(),
    aks: new AksClusterLinksFormatter(),
    eks: new EksClusterLinksFormatter(),
    gke: new GkeClusterLinksFormatter(deps.googleAuthApi),
    openshift: new OpenshiftClusterLinksFormatter(),
    rancher: new RancherClusterLinksFormatter(),
    headlamp: new HeadlampClusterLinksFormatter(),
  };
}
