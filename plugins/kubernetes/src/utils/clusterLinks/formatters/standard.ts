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

export function standardFormatter(options: ClusterLinksFormatterOptions) {
  if (!options.dashboardUrl) {
    throw new Error('standard dashboard requires a dashboardUrl option');
  }
  const result = new URL(options.dashboardUrl.href);
  const name = encodeURIComponent(options.object.metadata?.name ?? '');
  const namespace = encodeURIComponent(
    options.object.metadata?.namespace ?? '',
  );
  const validKind = kindMappings[options.kind.toLocaleLowerCase('en-US')];
  if (!result.pathname.endsWith('/')) {
    result.pathname += '/';
  }
  if (validKind && name && namespace) {
    result.hash = `/${validKind}/${namespace}/${name}`;
  } else if (namespace) {
    result.hash = '/workloads';
  }
  if (namespace) {
    // Note that Angular SPA requires a hash and the query parameter should be part of it
    result.hash += `?namespace=${namespace}`;
  }
  return result;
}
