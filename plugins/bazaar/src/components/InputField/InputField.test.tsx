/*
 * Copyright 2021 The Backstage Authors
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
import { screen } from '@testing-library/react';
import { InputField } from './InputField';
import { renderInTestApp } from '@backstage/test-utils';

it('should render TextField with text', async () => {
  const inputType = 'pull request';
  const value = 'test';

  await renderInTestApp(
    <InputField
      inputType={inputType}
      isFormInvalid={false}
      value={value}
      onChange={() => {}}
    />,
  );

  const inputField = screen.getByTestId(`inputField-${inputType}`);
  expect(inputField).toHaveTextContent(value);
});
