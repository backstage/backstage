import { TemplateFilterExample } from '@backstage/plugin-scaffolder-node/alpha';

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
export const examples: TemplateFilterExample[] = [
  {
    example: `\
- id: log
  name: Pick
  action: debug:log
  input:
    message: \${{ parameters.owner | parseEntityRef | pick('name') }}`,
    notes: `\
- **Input**: \`{ kind: 'Group', namespace: 'default', name: 'techdocs'\` }
- **Output**: \`techdocs\`
`,
  },
];
