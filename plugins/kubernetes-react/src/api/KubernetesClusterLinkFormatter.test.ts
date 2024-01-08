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
import { KubernetesClusterLinkFormatter } from './KubernetesClusterLinkFormatter';

const dashboardUrl = new URL('http://dashboard/url');
describe('KubernetesClusterLinkFormatter', () => {
  const formatter = new KubernetesClusterLinkFormatter({
    formatters: {
      standard: { formatClusterLink: async _ => dashboardUrl },
    },
    defaultFormatterName: 'standard',
  });
  describe('formatter.formatClusterLink', () => {
    it('should not return an url when there is no dashboard url', async () => {
      const url = await formatter.formatClusterLink({
        object: {},
        kind: 'foo',
      });
      expect(url).toBeUndefined();
    });
    it('should return an url even when there is no object', async () => {
      const url = await formatter.formatClusterLink({
        dashboardUrl: 'https://k8s.foo.com',
        object: undefined,
        kind: 'foo',
      });
      expect(url).toBe('https://k8s.foo.com');
    });
    it('should throw when the app is not recognized', async () => {
      await expect(
        formatter.formatClusterLink({
          dashboardUrl: 'https://k8s.foo.com',
          dashboardApp: 'unknownapp',
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar',
            },
          },
          kind: 'Deployment',
        }),
      ).rejects.toThrow(
        "Could not find Kubernetes dashboard app named 'unknownapp'",
      );
    });

    describe('default app', () => {
      it('should use default app', async () => {
        const url = await formatter.formatClusterLink({
          dashboardUrl: 'https://k8s.foo.com/',
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar',
            },
          },
          kind: 'Deployment',
        });
        expect(url).toBe(dashboardUrl.toString());
      });
    });
  });
});
