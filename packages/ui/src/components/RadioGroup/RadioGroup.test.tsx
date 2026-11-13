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

import { render, screen } from '@testing-library/react';
import { Radio, RadioGroup } from './RadioGroup';
import { BUIProvider } from '../../provider';

describe('RadioGroup', () => {
  it('associates its label and description with the radio group', () => {
    render(
      <RadioGroup label="Favorite Pokemon" description="Choose one option">
        <Radio value="bulbasaur">Bulbasaur</Radio>
      </RadioGroup>,
      { wrapper: BUIProvider },
    );

    expect(
      screen.getByRole('radiogroup', { name: 'Favorite Pokemon' }),
    ).toHaveAccessibleDescription('Choose one option');
  });
});
