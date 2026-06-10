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

import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { Button } from '../Button';
import {
  MenuTrigger,
  MenuAutocomplete,
  MenuAutocompleteListbox,
  MenuItem,
  MenuListBoxItem,
} from './index';
import type { MenuAutocompleteProps } from './types';

const fruits = ['Apple', 'Banana', 'Cherry'];

function renderMenuAutocomplete(props: Partial<MenuAutocompleteProps<object>>) {
  return render(
    <MemoryRouter>
      <BUIProvider>
        <MenuTrigger isOpen>
          <Button aria-label="Menu">Menu</Button>
          <MenuAutocomplete {...props}>
            {fruits.map(fruit => (
              <MenuItem key={fruit} id={fruit}>
                {fruit}
              </MenuItem>
            ))}
          </MenuAutocomplete>
        </MenuTrigger>
      </BUIProvider>
    </MemoryRouter>,
  );
}

describe('MenuAutocomplete', () => {
  it('filters items client-side by default', async () => {
    const onInputChange = jest.fn();
    renderMenuAutocomplete({ onInputChange });

    fireEvent.change(await screen.findByRole('searchbox'), {
      target: { value: 'app' },
    });

    expect(
      await screen.findByRole('menuitem', { name: 'Apple' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: 'Banana' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: 'Cherry' }),
    ).not.toBeInTheDocument();
    expect(onInputChange).toHaveBeenCalledWith('app');
  });

  it('filters items with a custom filter function', async () => {
    const filter = jest.fn(
      (textValue: string, inputValue: string) => textValue === inputValue,
    );
    renderMenuAutocomplete({ filter });

    fireEvent.change(await screen.findByRole('searchbox'), {
      target: { value: 'Banana' },
    });

    expect(
      await screen.findByRole('menuitem', { name: 'Banana' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', { name: 'Apple' }),
    ).not.toBeInTheDocument();
    expect(filter).toHaveBeenCalledWith(
      expect.any(String),
      'Banana',
      expect.anything(),
    );
  });

  it('shows all items regardless of input when filter is null', async () => {
    const onInputChange = jest.fn();
    renderMenuAutocomplete({ filter: null, onInputChange });

    fireEvent.change(await screen.findByRole('searchbox'), {
      target: { value: 'no match' },
    });

    expect(
      await screen.findByRole('menuitem', { name: 'Apple' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Banana' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Cherry' }),
    ).toBeInTheDocument();
    expect(onInputChange).toHaveBeenCalledWith('no match');
  });
});

describe('MenuAutocompleteListbox', () => {
  it('shows all items regardless of input when filter is null', async () => {
    const onInputChange = jest.fn();
    render(
      <MemoryRouter>
        <BUIProvider>
          <MenuTrigger isOpen>
            <Button aria-label="Menu">Menu</Button>
            <MenuAutocompleteListbox
              filter={null}
              onInputChange={onInputChange}
            >
              {fruits.map(fruit => (
                <MenuListBoxItem key={fruit} id={fruit}>
                  {fruit}
                </MenuListBoxItem>
              ))}
            </MenuAutocompleteListbox>
          </MenuTrigger>
        </BUIProvider>
      </MemoryRouter>,
    );

    fireEvent.change(await screen.findByRole('searchbox'), {
      target: { value: 'no match' },
    });

    expect(
      await screen.findByRole('option', { name: 'Apple' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cherry' })).toBeInTheDocument();
    expect(onInputChange).toHaveBeenCalledWith('no match');
  });
});
