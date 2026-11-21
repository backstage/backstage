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
import '../../testUtils/setupDom';
import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PackageSelect } from './PackageSelect';

const options = [
  { value: 'frontend', label: 'Catalog frontend', group: 'Core experiences' },
  { value: 'backend', label: 'Catalog backend', group: 'Core experiences' },
  { value: 'github', label: 'GitHub', group: 'Extension modules' },
];

describe('PackageSelect', () => {
  it('keeps the default label and supports a custom responsive label', async () => {
    const user = userEvent.setup();
    const onChange = mock.fn();
    const { rerender } = render(
      <PackageSelect value="frontend" options={options} onChange={onChange} />,
    );
    assert.ok(screen.getByRole('combobox', { name: 'Package' }));

    rerender(
      <PackageSelect
        value="frontend"
        options={options}
        onChange={onChange}
        label="Choose a package"
        className="responsive-selector"
      />,
    );
    const select = screen.getByRole('combobox', { name: 'Choose a package' });
    assert.ok(
      select.closest('label')?.classList.contains('responsive-selector'),
    );
    assert.ok(screen.getByRole('group', { name: 'Core experiences' }));
    await user.selectOptions(select, 'github');
    assert.deepEqual(onChange.mock.calls.at(-1)?.arguments, ['github']);
  });
});
