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

import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { UserSettingsPinToggle } from './UserSettingsPinToggle';
import { SidebarPinStateProvider } from '@backstage/core-components';

describe('<UserSettingsPinToggle />', () => {
  it('toggles the pin sidebar button', async () => {
    const mockToggleFn = jest.fn();
    await renderInTestApp(
      <SidebarPinStateProvider
        value={{
          isPinned: false,
          isMobile: false,
          toggleSidebarPinState: mockToggleFn,
        }}
      >
        <UserSettingsPinToggle />
      </SidebarPinStateProvider>,
    );
    expect(screen.getByText('Pin Sidebar')).toBeInTheDocument();

    const pinButton = screen.getByLabelText('Pin Sidebar Switch');
    fireEvent.click(pinButton);
    expect(mockToggleFn).toHaveBeenCalled();
  });
});
