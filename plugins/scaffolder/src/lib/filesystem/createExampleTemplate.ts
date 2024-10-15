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

import { TemplateDirectoryAccess } from './types';

const files = {
  'template.yaml': `
apiVersion: scaffolder.backstage.io/v1beta3
# https://backstage.io/docs/features/software-catalog/descriptor-format#kind-template
kind: Template
metadata:
  name: generated-example-template
  title: Scaffolder Example Template
  description: An example template for the scaffolder
spec:
  owner: user:guest
  type: service
  # These parameters are used to generate the input form in the frontend, and are
  # used to gather input data for the execution of the template.
  parameters:
    - title: Fill in some steps
      required:
        - name
      properties:
        name:
          title: Name
          type: string
          description: Unique name of the component
        owner:
          title: Owner
          type: string
          description: Owner of the component
          ui:field: OwnerPicker
          ui:options:
            catalogFilter:
              kind: Group
    - title: Choose a location
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com
  steps:
    - id: fetch-base
      name: Fetch Base
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: \${{parameters.name}}
          owner: \${{parameters.owner}}
          destination: \${{ parameters.repoUrl | parseRepoUrl }}`,
  'skeleton/README.md': `# This service is named \${{values.name}}!`,
  'skeleton/catalog-info.yaml': `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: \${{values.component_id | dump}}
  {%- if values.description %}
  description: \${{values.description | dump}}
  {%- endif %}
  annotations:
    github.com/project-slug: \${{values.destination.owner + "/" + values.destination.repo}}
    backstage.io/techdocs-ref: dir:.
spec:
  type: service
  lifecycle: experimental
  owner: \${{values.owner | dump}}`,
};

export async function createExampleTemplate(
  directory: TemplateDirectoryAccess,
) {
  for (const [name, data] of Object.entries(files)) {
    await directory.createFile({ name, data });
  }
  return directory;
}
