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
import {
  ClusterLinksFormatter,
  ClusterLinksFormatterOptions,
} from '../../types';

const kindMappings: Record<string, string> = {
  deployment: 'apps.deployment',
  ingress: 'networking.k8s.io.ingress',
  service: 'service',
  horizontalpodautoscaler: 'autoscaling.horizontalpodautoscaler',
};

/** @public */
export class RancherClusterLinksFormatter implements ClusterLinksFormatter {
  async formatClusterLink(options: ClusterLinksFormatterOptions): Promise<URL> {
    if (!options.dashboardUrl) {
      throw new Error('Rancher dashboard requires a dashboardUrl option');
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
      // https://foobar.com/abc/def + explorer/service/test  --> https://foobar.com/abc/explorer/service/test
      // https://foobar.com/abc/def/ + explorer/service/test --> https://foobar.com/abc/def/explorer/service/test
      basePath.pathname += '/';
    }
    let path = '';
    if (validKind && name && namespace) {
      path = `explorer/${validKind}/${namespace}/${name}`;
    } else if (namespace) {
      path = 'explorer/workload';
    }
    return new URL(path, basePath);
  }
}
