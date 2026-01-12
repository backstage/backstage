/*
 * Copyright 2022 The Backstage Authors
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
import { SettingsLayout } from './SettingsLayout';

jest.mock('@backstage/core-components', () => {
  const actual = jest.requireActual('@backstage/core-components');
  return {
    ...actual,
    useSidebarPinState: jest.fn(() => ({ isMobile: false })),
  };
});
jest.mock('@backstage/frontend-plugin-api', () => {
  const actual = jest.requireActual('@backstage/frontend-plugin-api');
  return {
    ...actual,
    useTranslationRef: () => ({
      t: (key: string) => {
        if (key === 'settingsLayout.title') return 'Default Settings Title';
        return key;
      },
    }),
  };
});
const setMobile = (isMobile: boolean) => {
  const { useSidebarPinState } = jest.requireMock('@backstage/core-components');
  (useSidebarPinState as jest.Mock).mockReturnValue({ isMobile });
};
describe('<SettingsLayout />', () => {
  beforeEach(() => {
    setMobile(false);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders header with default translated title when not mobile', async () => {
    const { container } = await renderInTestApp(
      <SettingsLayout>
        <SettingsLayout.Route path="general" title="General">
          <div>General settings</div>
        </SettingsLayout.Route>
        <SettingsLayout.Route path="advanced" title="Advanced">
          <div>Advanced settings</div>
        </SettingsLayout.Route>
      </SettingsLayout>,
    );
    expect(screen.getByText(/Default Settings Title/i)).toBeInTheDocument();
    const tabs = container.querySelectorAll('[class*=MuiTabs-root] a');
    expect(tabs).toHaveLength(2);
    expect(tabs[0].textContent).toEqual('General');
    expect(tabs[1].textContent).toEqual('Advanced');
    const user = userEvent.setup();
    await user.click(screen.getByText(/Advanced/i));
    const content = container.querySelectorAll('article');
    expect(content[0].textContent).toEqual('Advanced settings');
  });
  it('hides header when in mobile mode', async () => {
    setMobile(true);
    const { container } = await renderInTestApp(
      <SettingsLayout>
        <SettingsLayout.Route path="general" title="General">
          <div>General settings</div>
        </SettingsLayout.Route>
      </SettingsLayout>,
    );
    expect(screen.queryByText(/Default Settings Title/i)).toBeNull();
    const tabs = container.querySelectorAll('[class*=MuiTabs-root] a');
    expect(tabs).toHaveLength(1);
    expect(tabs[0].textContent).toEqual('General');
  });
  it('renders tabs and shows explicit title when provided', async () => {
    const { container } = await renderInTestApp(
      <SettingsLayout title="Custom Settings Title">
        <SettingsLayout.Route path="general" title="General">
          <div>General settings</div>
        </SettingsLayout.Route>
        <SettingsLayout.Route path="advanced" title="Advanced">
          <div>Advanced settings</div>
        </SettingsLayout.Route>
      </SettingsLayout>,
    );
    expect(screen.getByText(/Custom Settings Title/i)).toBeInTheDocument();
    const tabs = container.querySelectorAll('[class*=MuiTabs-root] a');
    expect(tabs).toHaveLength(2);
    expect(tabs[0].textContent).toEqual('General');
    expect(tabs[1].textContent).toEqual('Advanced');
    const user = userEvent.setup();
    await user.click(screen.getByText(/Advanced/i));
    const content = container.querySelectorAll('article');
    expect(content[0].textContent).toEqual('Advanced settings');
    await user.click(screen.getByText(/General/i));
    const contentBack = container.querySelectorAll('article');
    expect(contentBack[0].textContent).toEqual('General settings');
  });
  it('throws a strict error when a non-Route child is provided', async () => {
    await expect(
      renderInTestApp(
        <SettingsLayout>
          <div>Invalid child element</div>
        </SettingsLayout>,
      ),
    ).rejects.toThrow(
      'Child of SettingsLayout must be an SettingsLayout.Route',
    );
  });
});
