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
import { formatClusterLink } from './formatClusterLink';

describe('clusterLinks', () => {
  describe('formatClusterLink', () => {
    it('should not return an url when there is no dashboard url', () => {
      const url = formatClusterLink({ object: {}, kind: 'foo' });
      expect(url).toBeUndefined();
    });
    it('should return an url even when there is no object', () => {
      const url = formatClusterLink({
        dashboardUrl: 'https://k8s.foo.com',
        object: undefined,
        kind: 'foo',
      });
      expect(url).toBe('https://k8s.foo.com');
    });
    it('should throw when the app is not recognized', () => {
      expect(() =>
        formatClusterLink({
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
      ).toThrowError(
        "Could not find Kubernetes dashboard app named 'unknownapp'",
      );
    });

    describe('default app', () => {
      it('should return an url on the deployment', () => {
        const url = formatClusterLink({
          dashboardUrl: 'https://k8s.foo.com/',
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar',
            },
          },
          kind: 'Deployment',
        });
        expect(url).toBe(
          'https://k8s.foo.com/#/deployment/bar/foobar?namespace=bar',
        );
      });
      it('should return an url on the service', () => {
        const url = formatClusterLink({
          dashboardUrl: 'https://k8s.foo.com/',
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar',
            },
          },
          kind: 'Service',
        });
        expect(url).toBe(
          'https://k8s.foo.com/#/service/bar/foobar?namespace=bar',
        );
      });
      it('should return an url on the deployment properly url encoded', () => {
        const url = formatClusterLink({
          dashboardUrl: 'https://k8s.foo.com/',
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar bar',
            },
          },
          kind: 'Deployment',
        });
        expect(url).toBe(
          'https://k8s.foo.com/#/deployment/bar%20bar/foobar?namespace=bar+bar',
        );
      });
    });

    describe('standard app', () => {
      it('should return an url on the deployment', () => {
        const url = formatClusterLink({
          dashboardUrl: 'https://k8s.foo.com/',
          dashboardApp: 'standard',
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar',
            },
          },
          kind: 'Deployment',
        });
        expect(url).toBe(
          'https://k8s.foo.com/#/deployment/bar/foobar?namespace=bar',
        );
      });
      it('should return an url on the service', () => {
        const url = formatClusterLink({
          dashboardUrl: 'https://k8s.foo.com/',
          dashboardApp: 'standard',
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar',
            },
          },
          kind: 'Service',
        });
        expect(url).toBe(
          'https://k8s.foo.com/#/service/bar/foobar?namespace=bar',
        );
      });
    });
  });
});
