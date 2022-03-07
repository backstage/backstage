/*
 * Copyright 2020 The Backstage Authors
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
import { ClusterLinksFormatter } from '../../../types/types';
import { standardFormatter } from './standard';
import { rancherFormatter } from './rancher';
import { openshiftFormatter } from './openshift';
import { aksFormatter } from './aks';
import { eksFormatter } from './eks';
import { gkeFormatter } from './gke';

export const clusterLinksFormatters: Record<string, ClusterLinksFormatter> = {
  standard: standardFormatter,
  rancher: rancherFormatter,
  openshift: openshiftFormatter,
  aks: aksFormatter,
  eks: eksFormatter,
  gke: gkeFormatter,
};
export const defaultFormatterName = 'standard';
