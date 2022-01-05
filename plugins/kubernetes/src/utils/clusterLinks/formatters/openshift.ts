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
  if (!options.dashboardUrl) {
    throw new Error('OpenShift dashboard requires a dashboardUrl option');
  }
  const basePath = new URL(options.dashboardUrl.href);
  const name = encodeURIComponent(options.object.metadata?.name ?? '');
  const namespace = encodeURIComponent(
    options.object.metadata?.namespace ?? '',
  );
  const validKind = kindMappings[options.kind.toLocaleLowerCase('en-US')];
  if (!basePath.pathname.endsWith('/')) {
    // a dashboard url with a path should end with a slash otherwise
    // the new combined URL will replace the last segment with the appended path!
    // https://foobar.com/abc/def + k8s/cluster/projects/test  --> https://foobar.com/abc/k8s/cluster/projects/test
    // https://foobar.com/abc/def/ + k8s/cluster/projects/test --> https://foobar.com/abc/def/k8s/cluster/projects/test
    basePath.pathname += '/';
  }
  let path = '';
  if (namespace) {
    if (name && validKind) {
      path = `k8s/ns/${namespace}/${validKind}/${name}`;
    } else {
      path = `k8s/cluster/projects/${namespace}`;
    }
  } else if (validKind) {
    path = `k8s/cluster/${validKind}`;
    if (name) {
      path += `/${name}`;
    }
  }
  return new URL(path, basePath);
}
