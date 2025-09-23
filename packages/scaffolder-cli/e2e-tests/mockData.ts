/*
 * Copyright 2024 The Backstage Authors
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
  ScaffolderDryRunOptions,
  ScaffolderDryRunResponse,
} from '@backstage/plugin-scaffolder-react';

export function mockDryRunResponse(): ScaffolderDryRunResponse {
  return {
    log: [
      { body: {} },
      { body: {} },
      { body: {} },
      { body: {} },
      { body: {} },
      { body: {} },
      { body: {} },
      { body: {} },
      { body: {} },
    ],
    directoryContents: [
      {
        path: 'Application.java',
        executable: false,
        base64Content:
          'cGFja2FnZSBjb20udGVzdDsKCmltcG9ydCBvcmcuc3ByaW5nZnJhbWV3b3JrLmJvb3QuU3ByaW5nQXBwbGljYXRpb247CmltcG9ydCBvcmcuc3ByaW5nZnJhbWV3b3JrLmJvb3QuYXV0b2NvbmZpZ3VyZS5TcHJpbmdCb290QXBwbGljYXRpb247CgpAU3ByaW5nQm9vdEFwcGxpY2F0aW9uCnB1YmxpYyBjbGFzcyBBcHBsaWNhdGlvbiB7CgogICAgcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nW10gYXJncykgewogICAgICAgIFN5c3RlbS5vdXQucHJpbnRsbigiVGhpcyBpcyBjYWxsZWQgdGVzdC1zZXJ2aWNlIik7CiAgICAgICAgU3ByaW5nQXBwbGljYXRpb24ucnVuKEFwcGxpY2F0aW9uLmNsYXNzLCBhcmdzKTsKICAgIH0KfQo=',
      },
    ],
    output: {},
    steps: [
      {
        id: 'template',
        name: 'Fetch Skeleton + Template',
        action: 'fetch:template',
        input: {},
      },
    ],
  } as ScaffolderDryRunResponse;
}

export function getOptions(): ScaffolderDryRunOptions {
  return {
    template: {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: {
        name: 'test',
      },
      spec: {
        owner: 'group:test-group',
        type: 'backend service',
        parameters: [
          {
            title: 'Java backend app details',
            required: ['name', 'package_name'],
            properties: {
              name: {
                title: 'Name',
                type: 'string',
                description: 'Unique name of the component',
              },
              package_name: {
                title: 'Java Package Name',
                type: 'string',
                description: 'Name for the Java package.',
              },
            },
          },
        ],
        steps: [
          {
            id: 'template',
            name: 'Fetch Skeleton + Template',
            action: 'fetch:template',
            input: {
              url: './skeleton',
              values: {
                name: '${{ parameters.name }}',
                package_name: '${{ parameters.package_name }}',
              },
            },
          },
        ],
      },
    },
    values: {
      name: 'test-service',
      package_name: 'com.test',
    },
    directoryContents: [
      {
        path: 'template.yaml',
        base64Content:
          'YXBpVmVyc2lvbjogc2NhZmZvbGRlci5iYWNrc3RhZ2UuaW8vdjFiZXRhMwpraW5kOiBUZW1wbGF0ZQoKbWV0YWRhdGE6CiAgbmFtZTogdGVzdAoKc3BlYzoKICBvd25lcjogZ3JvdXA6dGVzdC1ncm91cAogIHR5cGU6IGJhY2tlbmQgc2VydmljZQogIHBhcmFtZXRlcnM6CiAgICAtIHRpdGxlOiBKYXZhIGJhY2tlbmQgYXBwIGRldGFpbHMKICAgICAgcmVxdWlyZWQ6CiAgICAgICAgLSBuYW1lCiAgICAgICAgLSBwYWNrYWdlX25hbWUKICAgICAgcHJvcGVydGllczoKICAgICAgICBuYW1lOgogICAgICAgICAgdGl0bGU6IE5hbWUKICAgICAgICAgIHR5cGU6IHN0cmluZwogICAgICAgICAgZGVzY3JpcHRpb246IFVuaXF1ZSBuYW1lIG9mIHRoZSBjb21wb25lbnQKICAgICAgICBwYWNrYWdlX25hbWU6CiAgICAgICAgICB0aXRsZTogSmF2YSBQYWNrYWdlIE5hbWUKICAgICAgICAgIHR5cGU6IHN0cmluZwogICAgICAgICAgZGVzY3JpcHRpb246IE5hbWUgZm9yIHRoZSBKYXZhIHBhY2thZ2UuCiAgc3RlcHM6CiAgICAtIGlkOiB0ZW1wbGF0ZQogICAgICBuYW1lOiBGZXRjaCBTa2VsZXRvbiArIFRlbXBsYXRlCiAgICAgIGFjdGlvbjogZmV0Y2g6dGVtcGxhdGUKICAgICAgaW5wdXQ6CiAgICAgICAgdXJsOiAuL3NrZWxldG9uCiAgICAgICAgdmFsdWVzOgogICAgICAgICAgbmFtZTogJHt7IHBhcmFtZXRlcnMubmFtZSB9fQogICAgICAgICAgcGFja2FnZV9uYW1lOiAke3sgcGFyYW1ldGVycy5wYWNrYWdlX25hbWUgfX0K',
      },
      {
        path: 'test-values.yaml',
        base64Content:
          'bmFtZTogdGVzdC1zZXJ2aWNlCnBhY2thZ2VfbmFtZTogY29tLnRlc3QK',
      },
      {
        path: 'skeleton/Application.java',
        base64Content:
          'cGFja2FnZSAke3t2YWx1ZXMucGFja2FnZV9uYW1lfX07CgppbXBvcnQgb3JnLnNwcmluZ2ZyYW1ld29yay5ib290LlNwcmluZ0FwcGxpY2F0aW9uOwppbXBvcnQgb3JnLnNwcmluZ2ZyYW1ld29yay5ib290LmF1dG9jb25maWd1cmUuU3ByaW5nQm9vdEFwcGxpY2F0aW9uOwoKQFNwcmluZ0Jvb3RBcHBsaWNhdGlvbgpwdWJsaWMgY2xhc3MgQXBwbGljYXRpb24gewoKICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBtYWluKFN0cmluZ1tdIGFyZ3MpIHsKICAgICAgICBTeXN0ZW0ub3V0LnByaW50bG4oIlRoaXMgaXMgY2FsbGVkICR7e3ZhbHVlcy5uYW1lfX0iKTsKICAgICAgICBTcHJpbmdBcHBsaWNhdGlvbi5ydW4oQXBwbGljYXRpb24uY2xhc3MsIGFyZ3MpOwogICAgfQp9Cg==',
      },
    ],
  } as ScaffolderDryRunOptions;
}
/*
 * Copyright 2024 The Backstage Authors
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
