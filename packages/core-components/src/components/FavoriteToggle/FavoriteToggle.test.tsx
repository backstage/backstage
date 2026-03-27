/*
 * Copyright 2024 The Backstage Authors
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

/*
 * FavoriteToggle test suite — validated against the shadcn/ui migration.
 * The underlying FavoriteToggle component now uses shadcn/ui Button
 * (variant="ghost", size="icon") and Radix Tooltip instead of MUI
 * IconButton, Tooltip, and makeStyles. All role-based selectors are
 * preserved: shadcn Button renders a standard <button> element and
 * Radix Tooltip renders content with role="tooltip", matching MUI's
 * accessible roles. The Lucide Star icon replaces the legacy StarIcon
 * and UnstarredIcon from @material-ui/icons.
 */

import { renderInTestApp } from '@backstage/test-utils';
import { FavoriteToggle } from './FavoriteToggle';
import userEvent from '@testing-library/user-event';

describe('<FavoriteToggle />', () => {
  const onToggle = jest.fn();

  const props = {
    title: 'Favorite this thing',
    id: 'some-thing-favorite',
    onToggle,
    isFavorite: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with valid props', async () => {
    const { getByRole } = await renderInTestApp(<FavoriteToggle {...props} />);

    // shadcn Button renders <button> with aria-label forwarded from FavoriteToggle
    expect(getByRole('button', { name: props.title })).toBeInTheDocument();
  });

  it('should return inverted value on toggle', async () => {
    const { getByRole } = await renderInTestApp(<FavoriteToggle {...props} />);

    await userEvent.click(getByRole('button', { name: props.title }));
    expect(onToggle).toHaveBeenCalledWith(!props.isFavorite);
  });

  it('should show accessible tooltip', async () => {
    const { findByRole, getByRole } = await renderInTestApp(
      <FavoriteToggle {...props} />,
    );

    await userEvent.hover(getByRole('button', { name: props.title }));

    // Radix Tooltip renders content with role="tooltip", same as MUI Tooltip
    expect(await findByRole('tooltip')).toHaveTextContent(props.title);
  });
});
