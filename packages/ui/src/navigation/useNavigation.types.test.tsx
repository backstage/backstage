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

import { ButtonLink } from '../components/ButtonLink';
import { ComboboxItem } from '../components/Combobox';
import { Link } from '../components/Link';
import { MenuItem, MenuListBoxItem } from '../components/Menu';
import { SearchAutocompleteItem } from '../components/SearchAutocomplete';
import { SelectItem } from '../components/Select';
import { Tab } from '../components/Tabs';

describe('anchor navigation types', () => {
  it('does not allow callers to replace anchor rendering', () => {
    const render = () => <a href="/custom">Custom</a>;
    const invalid = (
      <>
        {/* @ts-expect-error BUI owns the anchor element used for navigation */}
        <Link href="/link" render={render}>
          Link
        </Link>
        {/* @ts-expect-error BUI owns the anchor element used for navigation */}
        <ButtonLink href="/button" render={render}>
          Button
        </ButtonLink>
        {/* @ts-expect-error BUI owns the anchor element used for navigation */}
        <MenuItem href="/menu" render={render}>
          Menu
        </MenuItem>
        {/* @ts-expect-error BUI owns the anchor element used for navigation */}
        <MenuListBoxItem href="/listbox" render={render}>
          List box
        </MenuListBoxItem>
        {/* @ts-expect-error BUI owns the anchor element used for navigation */}
        <ComboboxItem href="/combobox" textValue="Combobox" render={render}>
          Combobox
        </ComboboxItem>
        {/* @ts-expect-error BUI owns the anchor element used for navigation */}
        <SelectItem href="/select" textValue="Select" render={render}>
          Select
        </SelectItem>
        {/* @ts-expect-error BUI owns the anchor element used for navigation */}
        <SearchAutocompleteItem href="/search" render={render}>
          Search
        </SearchAutocompleteItem>
        {/* @ts-expect-error BUI owns the anchor element used for navigation */}
        <Tab href="/tab" render={render}>
          Tab
        </Tab>
      </>
    );

    expect(invalid).toBeDefined();
  });
});
