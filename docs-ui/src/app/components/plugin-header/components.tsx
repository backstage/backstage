'use client';

import { PluginHeader } from '../../../../../packages/ui/src/components/PluginHeader/PluginHeader';
import { HeaderPage } from '../../../../../packages/ui/src/components/HeaderPage/HeaderPage';
import { ButtonIcon } from '../../../../../packages/ui/src/components/ButtonIcon/ButtonIcon';
import { Button } from '../../../../../packages/ui/src/components/Button/Button';
import { MemoryRouter } from 'react-router-dom';
import {
  RiHeartLine,
  RiEmotionHappyLine,
  RiCloudy2Line,
} from '@remixicon/react';

const tabs = [
  { id: 'overview', label: 'Overview', href: '/overview' },
  { id: 'checks', label: 'Checks', href: '/checks' },
  { id: 'tracks', label: 'Tracks', href: '/tracks' },
  { id: 'campaigns', label: 'Campaigns', href: '/campaigns' },
  { id: 'integrations', label: 'Integrations', href: '/integrations' },
];

const tabs2 = [
  { id: 'banana', label: 'Banana', href: '/banana' },
  { id: 'apple', label: 'Apple', href: '/apple' },
  { id: 'orange', label: 'Orange', href: '/orange' },
];

export const WithAllOptionsAndTabs = () => (
  <MemoryRouter>
    <PluginHeader
      title="My plugin"
      titleLink="/"
      tabs={tabs}
      customActions={
        <>
          <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
          <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
          <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
        </>
      }
    />
  </MemoryRouter>
);

export const WithAllOptions = () => (
  <MemoryRouter>
    <PluginHeader
      title="My plugin"
      titleLink="/"
      customActions={
        <>
          <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
          <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
          <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
        </>
      }
    />
  </MemoryRouter>
);

export const WithHeaderPage = () => (
  <MemoryRouter>
    <>
      <PluginHeader title="My plugin" titleLink="/" tabs={tabs.slice(0, 2)} />
      <HeaderPage
        title="Page title"
        tabs={tabs2}
        customActions={<Button>Custom action</Button>}
      />
    </>
  </MemoryRouter>
);
