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
  create: () => Promise<void>;
  next: () => Promise<void>;
  back: () => Promise<void>;
  complete: () => Promise<void>;
  errors: () => Promise<string[]>;
};

export const renderInForm = async (opts: {
  manifest: TemplateParameterSchema;
  extensions: Extension<FieldExtensionComponent<unknown, unknown>>[];
  initialState?: Record<string, JsonValue>;
  wrapper?: React.ComponentType;
}): Promise<FormRenderResult> => {
  const { manifest, extensions } = opts;
  const pluginExtensions = extensions.map(e => mockPlugin.provide(e));

  const onCreate = jest.fn();

  const Wrapper = opts.wrapper ?? React.Fragment;

  const rendered = await renderInTestApp(
    <Wrapper>
      <StepperHelper
        manifest={manifest}
        onCreate={onCreate}
        initialState={opts.initialState ?? {}}
      >
        <ScaffolderFieldExtensions>
          {pluginExtensions}
        </ScaffolderFieldExtensions>
      </StepperHelper>
    </Wrapper>,
  );

  const next = async () => {
    await act(async () => {
      rendered.getByTestId('next-button').click();
    });
  };

  const back = async () => {
    await act(async () => {
      rendered.getByTestId('back-button').click();
    });
  };

  const create = async () => {
    await act(async () => {
      rendered.getByTestId('create-button').click();
    });
  };

  const complete = async () => {
    for (let i = 0; i < manifest.steps.length; i++) {
      await next();
    }

    await create();
  };

  const errors = async () => {
    const listedErrors = await rendered.findAllByRole('listitem');
    return listedErrors.map(e => e.textContent ?? '').filter(Boolean);
  };

  return {
    ...rendered,
    next,
    back,
    create,
    complete,
    errors,
  };
};
