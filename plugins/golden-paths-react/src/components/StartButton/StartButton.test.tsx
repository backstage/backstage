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
import userEvent from '@testing-library/user-event';

import { StartButton } from './StartButton';
import { useStart } from './StartButton.utils';

jest.mock('./StartButton.utils.tsx', () => ({
  useStart: jest.fn(),
}));

describe('StartButton', () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render a button with text 'Start Golden Path'", async () => {
    (useStart as jest.Mock).mockReturnValue({
      handleStart: jest.fn(),
      isStarting: false,
    });
    const { getByText } = await renderInTestApp(<StartButton />);

    expect(getByText('Start Golden Path')).toBeInTheDocument();
  });

  it("should render enabled button, when 'isStarting' value is false", async () => {
    (useStart as jest.Mock).mockReturnValue({
      handleStart: jest.fn(),
      isStarting: false,
    });
    const { getByRole } = await renderInTestApp(<StartButton />);

    expect(getByRole('button')).not.toHaveAttribute('disabled');
  });

  it("should render disabled button, when 'isStarting' value is true", async () => {
    (useStart as jest.Mock).mockReturnValue({
      handleStart: jest.fn(),
      isStarting: true,
    });
    const { getByRole } = await renderInTestApp(<StartButton />);

    expect(getByRole('button')).toHaveAttribute('disabled');
  });

  it("should render a button, that calls 'handleStart' when clicked", async () => {
    (useStart as jest.Mock).mockReturnValue({
      handleStart: jest.fn(),
      isStarting: false,
    });
    const user = userEvent.setup();
    const { handleStart } = useStart();
    const { getByRole } = await renderInTestApp(<StartButton />);

    const button = getByRole('button');
    expect(handleStart).not.toHaveBeenCalled();
    await user.click(button);
    expect(handleStart).toHaveBeenCalled();
  });
});
