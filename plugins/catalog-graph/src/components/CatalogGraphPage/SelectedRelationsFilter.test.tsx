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

import {
  RELATION_CHILD_OF,
  RELATION_HAS_MEMBER,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ALL_RELATION_PAIRS } from '../EntityRelationsGraph';
import { SelectedRelationsFilter } from './SelectedRelationsFilter';

describe('<SelectedRelationsFilter/>', () => {
  test('should render current value', () => {
    render(
      <SelectedRelationsFilter
        relationPairs={ALL_RELATION_PAIRS}
        value={[RELATION_OWNED_BY, RELATION_CHILD_OF]}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText(RELATION_OWNED_BY)).toBeInTheDocument();
    expect(screen.getByText(RELATION_CHILD_OF)).toBeInTheDocument();
  });

  test('should select value', async () => {
    const onChange = jest.fn();
    render(
      <SelectedRelationsFilter
        relationPairs={ALL_RELATION_PAIRS}
        value={[RELATION_OWNED_BY, RELATION_CHILD_OF]}
        onChange={onChange}
      />,
    );

    await userEvent.click(screen.getByLabelText('Open'));

    await waitFor(() =>
      expect(screen.getByText(RELATION_HAS_MEMBER)).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText(RELATION_HAS_MEMBER));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith([
        RELATION_OWNED_BY,
        RELATION_CHILD_OF,
        RELATION_HAS_MEMBER,
      ]);
    });
  });

  test('should return undefined if all values are selected', async () => {
    const onChange = jest.fn();
    render(
      <SelectedRelationsFilter
        relationPairs={ALL_RELATION_PAIRS}
        value={ALL_RELATION_PAIRS.flatMap(p => p).filter(
          r => r !== RELATION_HAS_MEMBER,
        )}
        onChange={onChange}
      />,
    );

    await userEvent.click(screen.getByLabelText('Open'));

    await waitFor(() =>
      expect(screen.getByText(RELATION_HAS_MEMBER)).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText(RELATION_HAS_MEMBER));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });

  test('should return all values when cleared', async () => {
    const onChange = jest.fn();
    render(
      <SelectedRelationsFilter
        relationPairs={ALL_RELATION_PAIRS}
        value={[]}
        onChange={onChange}
      />,
    );

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.tab();

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });
});
