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
  TemplateParameterSchema,
} from '@backstage/plugin-scaffolder-react';
import { renderInTestApp } from '@backstage/test-utils';
import { act, RenderResult } from '@testing-library/react';
import { JsonValue } from '@backstage/types';
import { StepperHelper } from './StepperHelper';

const mockPlugin = createPlugin({
  id: 'scaffolder-test-utils',
});

export type FormRenderResult = RenderResult & {
  navigateToNextStep: () => Promise<void>;
  navigateToPreviousStep: () => Promise<void>;
  submitForm: () => Promise<void>;
  autoCompleteForm: () => Promise<void>;
  errors: () => Promise<string[]>;
  getFormData: () => Promise<Record<string, JsonValue>>;
};

export const renderInForm = async (opts: {
  manifest: TemplateParameterSchema;
  extensions: Extension<FieldExtensionComponent<unknown, unknown>>[];
  initialState?: Record<string, JsonValue>;
  wrapper?: React.ComponentType;
}): Promise<FormRenderResult> => {
  const { manifest, extensions } = opts;
  const pluginExtensions = extensions
    .map(e => mockPlugin.provide(e))
    .map((E, index) => <E key={index} />);

  let formData: Record<string, JsonValue> = {};

  const formDataPromise = () => {
    return new Promise<Record<string, JsonValue>>((resolve, reject) => {
      const interval = setInterval(() => {
        if (formData) {
          clearInterval(interval);
          resolve(formData);
        }
      }, 100);

      setTimeout(() => {
        if (!formData) {
          clearInterval(interval);
          reject(new Error('Form data was not set'));
        }
      });
    });
  };

  const Wrapper = opts.wrapper ?? React.Fragment;

  const rendered = await renderInTestApp(
    <Wrapper>
      <StepperHelper
        manifest={manifest}
        onCreate={async data => {
          formData = data;
        }}
        initialState={opts.initialState ?? {}}
      >
        <ScaffolderFieldExtensions>
          {pluginExtensions}
        </ScaffolderFieldExtensions>
      </StepperHelper>
    </Wrapper>,
  );

  const navigateToNextStep = async () => {
    await act(async () => {
      const nextButton = await rendered.findByTestId(
        'next-button',
        {},
        { timeout: 3000 },
      );
      nextButton.click();
    });
  };

  const navigateToPreviousStep = async () => {
    await act(async () => {
      const backButton = await rendered.findByTestId(
        'back-button',
        {},
        { timeout: 3000 },
      );
      backButton.click();
    });
  };

  const submitForm = async () => {
    await act(async () => {
      const createButton = await rendered.findByTestId(
        'create-button',
        {},
        { timeout: 3000 },
      );
      createButton.click();
    });
  };

  const autoCompleteForm = async () => {
    for (let i = 0; i < manifest.steps.length; i++) {
      await navigateToNextStep();
    }

    await submitForm();
  };

  const errors = async () => {
    const listedErrors = await rendered.findAllByRole('listitem');
    return listedErrors.map(e => e.textContent ?? '').filter(Boolean);
  };

  return {
    ...rendered,
    navigateToNextStep,
    navigateToPreviousStep,
    submitForm,
    autoCompleteForm,
    errors,
    getFormData: formDataPromise,
  };
};
