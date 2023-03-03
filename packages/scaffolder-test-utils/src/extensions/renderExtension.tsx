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
import React from 'react';
import { createPlugin, Extension } from '@backstage/core-plugin-api';
import {
  FieldExtensionComponent,
  ScaffolderFieldExtensions,
} from '@backstage/plugin-scaffolder-react';
import { FormValidation } from '@backstage/plugin-scaffolder-react/alpha';
import { renderInTestApp } from '@backstage/test-utils';
import { RenderResult } from '@testing-library/react';
import { FormHelper } from './FormHelper';
import type { ValidateInput } from './FormHelper';

const mockPlugin = createPlugin({
  id: 'scaffolder-test-utils',
});

export type ExtensionRenderResult = RenderResult & {
  validate: () => Promise<ValidateInput>;
};

export const renderExtension = async (
  extension: Extension<FieldExtensionComponent<unknown, unknown>>,
): Promise<ExtensionRenderResult> => {
  const PluginExtension = mockPlugin.provide(extension);
  const subscribers: ((input: ValidateInput) => void)[] = [];
  const cacheResults = (result: ValidateInput) => {
    for (const subscriber of subscribers) {
      const { errors, formData } = result;

      subscriber({
        errors: Object.values(errors).flatMap(
          ({ __errors }) => __errors as FormValidation,
        ),
        formData,
      });
    }
  };
  const rendered = await renderInTestApp(
    <FormHelper onValidate={cacheResults}>
      <ScaffolderFieldExtensions>
        <PluginExtension />
      </ScaffolderFieldExtensions>
    </FormHelper>,
  );

  return {
    ...rendered,
    validate: () => {
      return new Promise<ValidateInput>(resolve => {
        subscribers.push(resolve);
        rendered.getByTestId('form-helper-submit').click();
      });
    },
  };
};
