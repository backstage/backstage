'use client';

import { Header } from '../../../../../packages/ui/src/components/Header/Header';
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
  { id: 'Banana', label: 'Banana', href: '/banana' },
  { id: 'Apple', label: 'Apple', href: '/apple' },
  { id: 'Orange', label: 'Orange', href: '/orange' },
];

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings', href: '/settings' },
];

export const WithAllOptionsAndTabs = () => (
  <MemoryRouter>
    <Header
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
    <Header
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

export const WithBreadcrumbs = () => (
  <MemoryRouter>
    <Header tabs={tabs} />
  </MemoryRouter>
);

export const WithHeaderPage = () => (
  <MemoryRouter>
    <>
      <Header
        tabs={tabs}
        customActions={
          <>
            <ButtonIcon variant="tertiary" icon={<RiCloudy2Line />} />
            <ButtonIcon variant="tertiary" icon={<RiEmotionHappyLine />} />
            <ButtonIcon variant="tertiary" icon={<RiHeartLine />} />
          </>
        }
      />
      <HeaderPage
        title="Page title"
        tabs={tabs2}
        customActions={<Button>Custom action</Button>}
        breadcrumbs={breadcrumbs}
      />
    </>
  </MemoryRouter>
);
