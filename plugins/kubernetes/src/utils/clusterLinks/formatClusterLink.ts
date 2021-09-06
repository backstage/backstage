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

import { defaultFormatterName, clusterLinksFormatters } from './formatters';

export type FormatClusterLinkOptions = {
  dashboardUrl?: string;
  dashboardApp?: string;
  object: any;
  kind: string;
};

export function formatClusterLink(options: FormatClusterLinkOptions) {
  if (!options.dashboardUrl) {
    return undefined;
  }
  if (!options.object) {
    return options.dashboardUrl;
  }
  const app = options.dashboardApp || defaultFormatterName;
  const formatter = clusterLinksFormatters[app];
  if (!formatter) {
    throw new Error(`Could not find Kubernetes dashboard app named '${app}'`);
  }
  const url = formatter({
    dashboardUrl: new URL(options.dashboardUrl),
    object: options.object,
    kind: options.kind,
  });
  // Note that we can't rely on 'url.href' since it will put the search before the hash
  // and this won't be properly recognized by SPAs such as Angular in the standard dashboard.
  // Note also that pathname, hash and search will be properly url encoded.
  return `${url.origin}${url.pathname}${url.hash}${url.search}`;
}
