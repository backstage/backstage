import React from 'react';
import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { renderWithEffects, wrapInThemedTestApp } from 'testUtils';
import DismissableBanner from 'shared/components/DismissableBanner';
import SettingsCollection from 'shared/apis/settings/SettingCollection';
import MemorySettingsStore from 'shared/apis/settings/MemorySettingsStore';

describe('<DismissableBanner />', () => {
  it('renders the message and the popover', async () => {
    const settings = new SettingsCollection();
    const mockSetting = settings.register({
      id: 'mockSetting',
      defaultValue: true,
    });
    const SettingsProvider = settings.bind()(new MemorySettingsStore());

    const rendered = await renderWithEffects(
      wrapInThemedTestApp(
        <SettingsProvider>
          <DismissableBanner variant="info" setting={mockSetting} message="test message" />
        </SettingsProvider>,
      ),
    );
    rendered.getByText('test message');

    fireEvent.click(rendered.getByTitle('Permanently dismiss this message'));
    await waitForElementToBeRemoved(() => rendered.queryByText('test message'));
  });
});
