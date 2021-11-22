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
  deployment: 'deployments',
  ingress: 'ingresses',
  service: 'services',
  horizontalpodautoscaler: 'horizontalpodautoscalers',
  persistentvolume: 'persistentvolumes',
};

export function openshiftFormatter(options: ClusterLinksFormatterOptions): URL {
  const result = new URL(options.dashboardUrl.href);
  const name = options.object.metadata?.name;
  const namespace = options.object.metadata?.namespace;
  const validKind = kindMappings[options.kind.toLocaleLowerCase('en-US')];
  if (namespace) {
    if (name && validKind) {
      result.pathname = `k8s/ns/${namespace}/${validKind}/${name}`;
    } else {
      result.pathname = `k8s/cluster/projects/${namespace}`;
    }
  } else if (validKind) {
    result.pathname = `k8s/cluster/${validKind}`;
    if (name) {
      result.pathname += `/${name}`;
    }
  }
  return result;
}
