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
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DeleteEntityConfirmationDialog } from './DeleteEntityConfirmationDialog';

describe('DeleteEntityConfirmationDialog', () => {
  it('confirms and cancels through the respective buttons', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();

    const { rerender } = await renderInTestApp(
      <DeleteEntityConfirmationDialog
        open
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    );

    expect(
      await screen.findByText('Are you sure you want to delete this entity?'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    rerender(
      <DeleteEntityConfirmationDialog
        open
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
