/*
 * Copyright 2020 The Backstage Authors
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

import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { asInputRef } from '../helpers';
import { PreparePullRequestForm } from './PreparePullRequestForm';

describe('<PreparePullRequestForm />', () => {
  it('renders without exploding', async () => {
    const onSubmitFn = jest.fn();

    render(
      <PreparePullRequestForm<{ main: string }>
        defaultValues={{ main: 'default' }}
        render={({ register }) => (
          <>
            <TextField {...asInputRef(register('main'))} />
            <Button type="submit">Submit</Button>{' '}
          </>
        )}
        onSubmit={onSubmitFn}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    expect(onSubmitFn).toHaveBeenCalledTimes(1);
    expect(onSubmitFn.mock.calls[0][0]).toMatchObject({ main: 'default' });
  });

  it('should register a text field', async () => {
    const onSubmitFn = jest.fn();

    render(
      <PreparePullRequestForm<{ main: string }>
        defaultValues={{ main: 'default' }}
        render={({ register }) => (
          <>
            <TextField
              {...asInputRef(register('main'))}
              id="main"
              label="Main Field"
            />
            <Button type="submit">Submit</Button>
          </>
        )}
        onSubmit={onSubmitFn}
      />,
    );

    await act(async () => {
      await userEvent.clear(screen.getByLabelText('Main Field'));
      await userEvent.type(screen.getByLabelText('Main Field'), 'My Text');
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    expect(onSubmitFn).toHaveBeenCalledTimes(1);
    expect(onSubmitFn.mock.calls[0][0]).toMatchObject({ main: 'My Text' });
  });

  it('registers required attribute', async () => {
    const onSubmitFn = jest.fn();

    render(
      <PreparePullRequestForm<{ main: string }>
        defaultValues={{}}
        render={({ formState, register }) => (
          <>
            <TextField
              {...asInputRef(register('main', { required: true }))}
              name="main"
            />
            {formState.errors.main && (
              <FormHelperText error>
                Error in required main field
              </FormHelperText>
            )}
            <Button type="submit">Submit</Button>{' '}
          </>
        )}
        onSubmit={onSubmitFn}
      />,
    );

    expect(
      screen.queryByText('Error in required main field'),
    ).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    expect(onSubmitFn).not.toHaveBeenCalled();
    expect(
      screen.getByText('Error in required main field'),
    ).toBeInTheDocument();
  });
});
