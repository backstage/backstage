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
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { RegisterExistingButton } from './RegisterExistingButton';
import { usePermission } from '@backstage/plugin-permission-react';

jest.mock('@backstage/plugin-permission-react', () => ({
  usePermission: jest.fn(),
}));

describe('RegisterExistingButton', () => {
  beforeEach(() => {
    (usePermission as jest.Mock).mockClear();
  });

  it('should not render if to is unset', async () => {
    (usePermission as jest.Mock).mockReturnValue({ allowed: true });

    const { queryByText } = await renderInTestApp(
      <RegisterExistingButton title="Pick me" />,
    );

    expect(await queryByText('Pick me')).not.toBeInTheDocument();
  });

  it('should not render if permissions are not allowed', async () => {
    (usePermission as jest.Mock).mockReturnValue({ allowed: false });
    const { queryByText } = await renderInTestApp(
      <RegisterExistingButton title="Pick me" to="blah" />,
    );

    expect(await queryByText('Pick me')).not.toBeInTheDocument();
  });

  it('should render the button with the text', async () => {
    (usePermission as jest.Mock).mockReturnValue({ allowed: true });
    const { queryByText } = await renderInTestApp(
      <RegisterExistingButton title="Pick me" to="blah" />,
    );

    expect(await queryByText('Pick me')).toBeInTheDocument();
  });
});
