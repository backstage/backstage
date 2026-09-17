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

import {
  KubernetesClusterLinkFormatterApi,
  FormatClusterLinkOptions,
} from './types';
import { ClusterLinksFormatter } from '../types';

/** @public */
export class KubernetesClusterLinkFormatter
  implements KubernetesClusterLinkFormatterApi
{
  private readonly formatters: Record<string, ClusterLinksFormatter>;
  private readonly defaultFormatterName: string;

  constructor(options: {
    formatters: Record<string, ClusterLinksFormatter>;
    defaultFormatterName: string;
  }) {
    this.formatters = options.formatters;
    this.defaultFormatterName = options.defaultFormatterName;
  }
  async formatClusterLink(options: FormatClusterLinkOptions) {
    if (!options.dashboardUrl && !options.dashboardParameters) {
      return undefined;
    }
    if (options.dashboardUrl && !options.object) {
      return options.dashboardUrl;
    }
    const app = options.dashboardApp ?? this.defaultFormatterName;
    const formatter = this.formatters[app];
    if (!formatter) {
      throw new Error(`Could not find Kubernetes dashboard app named '${app}'`);
    }
    const url = await formatter.formatClusterLink({
      dashboardUrl: options.dashboardUrl
        ? new URL(options.dashboardUrl)
        : undefined,
      dashboardParameters: options.dashboardParameters,
      object: options.object,
      kind: options.kind,
    });
    return url.toString();
  }
}
