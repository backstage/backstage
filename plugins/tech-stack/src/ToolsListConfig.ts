/*
 * Copyright 2020 Spotify AB
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

export const ToolsListConfig: Tools[] = [
  {
    type: 'prometheus',
    scm: 'https://github.com/test-com/prometheus-config',
    actions: [
      {
        caption: 'PROD',
        link: 'https://prometheus.prod.test.com',
      },
      {
        caption: 'Staging',
        link: 'https://prometheus.staging.test.com',
      },
      {
        caption: 'ROOT',
        link: 'https://prod.test.com',
      },
    ],
  },
  {
    type: 'grafana',
    scm: 'https://github.com/test-com/grafana-config',
    actions: [
      {
        caption: 'intranet',
        link: '',
      },
      {
        caption: 'AWS',
        link: '',
      },
      {
        caption: 'doc',
        link: '',
      },
    ],
  },
  {
    type: 'alertmanager',
    scm: 'https://github.com/test-com/alertmanager-config',
    actions: [
      {
        caption: 'intranet',
        link: '',
      },
      {
        caption: 'AWS',
        link: '',
      },
      {
        caption: 'doc',
        link: '',
      },
    ],
  },
  {
    type: 'kiali',
    actions: [
      {
        caption: 'PROD',
        link: 'https://kiali.prod.test.com',
      },
      {
        caption: 'Staging',
        link: 'https://kiali.staging.test.com',
      },
      {
        caption: 'Tools',
        link: 'https://kiali.tools.test.com',
      },
      {
        caption: 'external',
        link: 'https://kiali.external.test.com',
      },
      {
        caption: 'DWH',
        link: 'https://kiali.dwh.test.com',
      },
    ],
  },
  {
    type: 'github',
    actions: [
      {
        caption: '',
        link: '',
      },
    ],
  },
  {
    type: 'istio',
    actions: [
      {
        caption: '',
        link: '',
      },
    ],
  },
  {
    type: 'fastly',
    actions: [
      {
        caption: '',
        link: '',
      },
    ],
  },
  {
    type: 'haproxy',
    actions: [
      {
        caption: '',
        link: '',
      },
    ],
  },
  {
    type: 'letsencrypt',
    actions: [
      {
        caption: '',
        link: '',
      },
    ],
  },
  {
    type: 'newrelic',
    actions: [
      {
        caption: '',
        link: '',
      },
    ],
  },
  {
    type: 'airflow',
    actions: [
      {
        caption: 'prod',
        link: 'https://airflow.test.com/',
      },
    ],
  },
  {
    type: 'rancher',
    actions: [
      {
        caption: 'console',
        link: 'https://rancher.test.com/',
      },
    ],
  },
  {
    type: 'sonarqube',
    actions: [
      {
        caption: 'console',
        link: 'https://sonarqube.test.com/',
      },
    ],
  },
  {
    type: 'jenkins',
    actions: [
      {
        caption: 'intanet',
        link: 'https://jenkins.test.com/',
      },
      {
        caption: 'aws',
        link: 'https://jenkins.test.aws/',
      },
    ],
  },
  {
    type: 'gatling',
    actions: [
      {
        caption: 'console',
        link: 'https://gatling.test.aws/',
      },
    ],
  },
  {
    type: 'aws',
    actions: [
      {
        caption: 'console',
        link: 'https://test-com.signin.aws.amazon.com/console',
      },
    ],
  },
];
