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
import { CodeSnippet } from '@backstage/core-components';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import jsyaml from 'js-yaml';
import React, { useState } from 'react';

/**
 * Props of ManifestYaml
 *
 * @public
 */
export interface ManifestYamlProps {
  object: object;
}

/**
 * Renders a Kubernetes object as a YAML code snippet
 *
 * @public
 */
export const ManifestYaml = ({ object }: ManifestYamlProps) => {
  // Toggle whether the Kubernetes resource managed fields should be shown in
  // the YAML display. This toggle is only available when the YAML is being
  // shown because managed fields are never visible in the structured display.
  const [managedFields, setManagedFields] = useState<boolean>(false);
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={managedFields}
            onChange={event => {
              setManagedFields(event.target.checked);
            }}
            name="Managed Fields"
          />
        }
        label="Managed Fields"
      />
      <CodeSnippet
        language="yaml"
        text={jsyaml.dump(object, {
          // NOTE: this will remove any field called `managedFields`
          // not just the metadata one
          // TODO: @mclarke make this only remove the `metadata.managedFields`
          replacer: (key: string, value: string): any => {
            if (!managedFields) {
              return key === 'managedFields' ? undefined : value;
            }
            return value;
          },
        })}
      />
    </>
  );
};
