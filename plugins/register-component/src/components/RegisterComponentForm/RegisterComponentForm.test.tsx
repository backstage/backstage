/*
 * Copyright 2020 Spotify AB
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
import { render, fireEvent, cleanup } from '@testing-library/react';
import RegisterComponentForm, { Props } from './RegisterComponentForm';
import { act } from 'react-dom/test-utils';

const setup = (props?: Partial<Props>) => {
  return {
    rendered: render(
      <RegisterComponentForm
        onSubmit={jest.fn()}
        submitting={false}
        {...props}
      />,
    ),
  };
};
describe('RegisterComponentForm', () => {
  afterEach(() => cleanup());

  it('should initially render a disabled button', async () => {
    const { rendered } = setup();
    expect(
      await rendered.findByText(
        'Enter the full path to the component.yaml file in GitHub to start tracking your component. It must be in a public repo.',
      ),
    ).toBeInTheDocument();

    const submit = (await rendered.getByRole('button')) as HTMLButtonElement;
    expect(submit.disabled).toBeTruthy();
  });

  it('should enable a submit form when data when component url is set ', async () => {
    const { rendered } = setup();
    const input = (await rendered.getByRole('textbox')) as HTMLInputElement;
    await act(async () => {
      // react-hook-form uses `input` event for changes
      fireEvent.input(input, {
        target: { value: 'https://example.com/blob/master/component.yaml' },
      });
    });
    const submit = (await rendered.getByRole('button')) as HTMLButtonElement;

    expect(submit.disabled).toBeFalsy();
  });
});

it('should show spinner while submitting', async () => {
  const { rendered } = setup({ submitting: true });
  expect(rendered.getByTestId('loading-progress')).toBeInTheDocument();
});
