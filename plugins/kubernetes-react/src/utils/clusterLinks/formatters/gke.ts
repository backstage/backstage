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
import { ClusterLinksFormatterOptions } from '../../../types/types';

const kindMappings: Record<string, string> = {
  deployment: 'deployment',
  pod: 'pod',
  ingress: 'ingress',
  service: 'service',
  horizontalpodautoscaler: 'deployment',
};

export function gkeFormatter(options: ClusterLinksFormatterOptions): URL {
  if (!options.dashboardParameters) {
    throw new Error('GKE dashboard requires a dashboardParameters option');
  }
  const args = options.dashboardParameters;
  if (typeof args.projectId !== 'string') {
    throw new Error(
      'GKE dashboard requires a "projectId" of type string in the dashboardParameters option',
    );
  }
  if (typeof args.region !== 'string') {
    throw new Error(
      'GKE dashboard requires a "region" of type string in the dashboardParameters option',
    );
  }
  if (typeof args.clusterName !== 'string') {
    throw new Error(
      'GKE dashboard requires a "clusterName" of type string in the dashboardParameters option',
    );
  }
  const basePath = new URL('https://console.cloud.google.com/');
  const region = encodeURIComponent(args.region);
  const clusterName = encodeURIComponent(args.clusterName);
  const name = encodeURIComponent(options.object.metadata?.name ?? '');
  const namespace = encodeURIComponent(
    options.object.metadata?.namespace ?? '',
  );
  const validKind = kindMappings[options.kind.toLocaleLowerCase('en-US')];
  let path = '';
  if (namespace && name && validKind) {
    const kindsWithDetails = ['ingress', 'pod'];
    const landingPage = kindsWithDetails.includes(validKind)
      ? 'details'
      : 'overview';
    path = `kubernetes/${validKind}/${region}/${clusterName}/${namespace}/${name}/${landingPage}`;
  } else {
    path = `kubernetes/clusters/details/${region}/${clusterName}/details`;
  }
  const result = new URL(path, basePath);
  result.searchParams.set('project', args.projectId);
  return result;
}
