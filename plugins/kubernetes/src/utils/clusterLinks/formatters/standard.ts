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

const KindMappings: Record<string, string> = {
  deployment: 'deployment',
  ingress: 'ingress',
  service: 'service',
  horizontalpodautoscaler: 'deployment',
};

export function standardFormatter(options: ClusterLinksFormatterOptions) {
  const result = new URL(options.dashboardUrl.href);
  const name = options.object.metadata?.name;
  const namespace = options.object.metadata?.namespace;
  const validKind = KindMappings[options.kind.toLocaleLowerCase()];
  if (namespace) {
    result.searchParams.set('namespace', namespace);
  }
  if (validKind && name && namespace) {
    result.hash = `/${validKind}/${namespace}/${name}`;
  } else if (namespace) {
    result.hash = '/workloads';
  }
  return result;
}
