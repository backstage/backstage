/*
 * Copyright 2025 The Backstage Authors
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
import { TemplateFilterExample } from '@backstage/plugin-scaffolder-node/alpha';

export const examples: TemplateFilterExample[] = [
  {
    description: 'Without context',
    example: `\
- id: log
  name: Parse Entity Reference
  action: debug:log
  input:
    message: \${{ parameters.owner | parseEntityRef }}
`,
    notes: `\
- **Input**: \`group:techdocs\`
- **Output**: \`{"kind": "group", "namespace": "default", "name": "techdocs"}\`
`,
  },
  {
    description: 'With context',
    example: `\
- id: log
  name: Parse Entity Reference
  action: debug:log
  input:
    message: \${{ parameters.owner | parseEntityRef({ defaultKind:"group", defaultNamespace:"another-namespace" }) }}
`,
    notes: `\
- **Input**: \`techdocs\`
- **Arguments:**: \`[{ "defaultKind": "group", "defaultNamespace": "another-namespace" }]\`
- **Output**: \`{"kind": "group", "namespace": "another-namespace", "name": "techdocs"}\`
`,
  },
];
