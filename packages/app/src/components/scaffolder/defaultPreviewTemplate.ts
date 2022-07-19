/*
 * Copyright 2022 The Backstage Authors
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

export const defaultPreviewTemplate = `# Edit the template parameters below to see how they will render in the scaffolder form UI
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
          allowedKinds:
            - Group
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
  - title: Custom Fields
    required:
      - lowerCaseValue
    properties:
      lowerCaseValue:
        title: Lower Cased Value
        type: string
        ui:field: LowerCaseValuePicker
`;
