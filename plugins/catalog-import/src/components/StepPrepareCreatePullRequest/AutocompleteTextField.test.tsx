/*
 * Copyright 2026 The Backstage Authors
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

import Button from '@material-ui/core/Button';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutocompleteTextField } from './AutocompleteTextField';
import { PreparePullRequestForm } from './PreparePullRequestForm';

describe('<AutocompleteTextField />', () => {
  it('submits the id of the selected option, but displays its label', async () => {
    const onSubmitFn = jest.fn();

    render(
      <PreparePullRequestForm<{ owner: string }>
        defaultValues={{ owner: '' }}
        render={() => (
          <>
            <AutocompleteTextField
              name="owner"
              options={[
                { label: 'My Displayed Team', id: 'my-team' },
                'plain-option',
              ]}
              textFieldProps={{ label: 'Entity Owner' }}
            />
            <Button type="submit">Submit</Button>
          </>
        )}
        onSubmit={onSubmitFn}
      />,
    );

    const input = screen.getByLabelText('Entity Owner');

    await act(async () => {
      await userEvent.type(input, 'My Displayed');
    });

    await userEvent.click(await screen.findByText('My Displayed Team'));

    expect((input as HTMLInputElement).value).toBe('My Displayed Team');

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    expect(onSubmitFn).toHaveBeenCalledTimes(1);
    expect(onSubmitFn.mock.calls[0][0]).toMatchObject({ owner: 'my-team' });
  });

  it('submits plain string options and free text as they are', async () => {
    const onSubmitFn = jest.fn();

    render(
      <PreparePullRequestForm<{ owner: string }>
        defaultValues={{ owner: '' }}
        render={() => (
          <>
            <AutocompleteTextField
              name="owner"
              options={[{ label: 'My Displayed Team', id: 'my-team' }]}
              textFieldProps={{ label: 'Entity Owner' }}
            />
            <Button type="submit">Submit</Button>
          </>
        )}
        onSubmit={onSubmitFn}
      />,
    );

    await act(async () => {
      await userEvent.type(
        screen.getByLabelText('Entity Owner'),
        'custom/owner',
      );
      await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    expect(onSubmitFn).toHaveBeenCalledTimes(1);
    expect(onSubmitFn.mock.calls[0][0]).toMatchObject({
      owner: 'custom/owner',
    });
  });
});
