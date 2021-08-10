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

const KindMappings: any = {
  deployment: 'deployment',
  ingress: 'ingress',
  service: 'service',
  horizontalpodautoscaler: 'deployment',
};

export function formatClusterLink(
  dashboardUrl: string,
  object: any,
  kind: string,
) {
  if (!dashboardUrl) {
    return undefined;
  }
  if (!object) {
    return dashboardUrl;
  }
  const host = dashboardUrl.endsWith('/') ? dashboardUrl : `${dashboardUrl}/`;
  const name = object.metadata?.name;
  const namespace = object.metadata?.namespace;
  const validKind = KindMappings[kind.toLocaleLowerCase()];
  if (validKind && name && namespace) {
    return `${host}#/${validKind}/${namespace}/${name}?namespace=${namespace}`;
  }
  if (namespace) {
    return `${host}#/workloads?namespace=${namespace}`;
  }
  return dashboardUrl;
}
