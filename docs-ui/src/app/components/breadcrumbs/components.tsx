'use client';

import React from 'react';
import { RiArrowRightSLine, RiMore2Line } from '@remixicon/react';
import {
  Breadcrumbs,
  Breadcrumb,
} from '../../../../../packages/ui/src/components/Breadcrumbs';
import { MemoryRouter } from 'react-router-dom';

export const Default = () => {
  return (
    <MemoryRouter>
      <Breadcrumbs>
        <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
        <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
        <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
      </Breadcrumbs>
    </MemoryRouter>
  );
};

export const Truncation = () => {
  return (
    <MemoryRouter>
      <Breadcrumbs>
        <Breadcrumb href="/home">Home</Breadcrumb>
        <Breadcrumb href="/home/catalog">
          A very long breadcrumb label that will be truncated by CSS
        </Breadcrumb>
        <Breadcrumb href="/home/catalog/details">
          Another extremely long segment name that overflows its container
        </Breadcrumb>
      </Breadcrumbs>
    </MemoryRouter>
  );
};

export const VariantAndColor = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Breadcrumbs variant="body-x-small" color="danger">
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings">Settings</Breadcrumb>
          <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
        <Breadcrumbs variant="title-x-small" color="info">
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings">Settings</Breadcrumb>
          <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
        <Breadcrumbs variant="body-large">
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings" color="danger">
            Settings (danger)
          </Breadcrumb>
          <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
      </div>
    </MemoryRouter>
  );
};

export const Collapsed = () => {
  return (
    <MemoryRouter>
      <Breadcrumbs>
        <Breadcrumb href="/home">Home</Breadcrumb>
        <Breadcrumb href="/home/docs">Docs</Breadcrumb>
        <Breadcrumb href="/home/docs/guides">Guides</Breadcrumb>
        <Breadcrumb href="/home/docs/guides/setup">Setup</Breadcrumb>
        <Breadcrumb href="/home/docs/guides/setup/intro">
          Introduction
        </Breadcrumb>
      </Breadcrumbs>
    </MemoryRouter>
  );
};

export const CustomStyling = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Breadcrumbs variant="title-small" color="secondary">
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings">Settings</Breadcrumb>
          <Breadcrumb
            href="/home/settings/theme"
            color="primary"
            weight="regular"
          >
            Theme
          </Breadcrumb>
        </Breadcrumbs>
        <Breadcrumbs
          style={
            {
              '--bui-Breadcrumbs-gap': 'var(--bui-space-10)',
            } as React.CSSProperties
          }
        >
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings">Settings</Breadcrumb>
          <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
        <Breadcrumbs
          separator={
            <RiArrowRightSLine size="1.4em" color="var(--bui-fg-danger)" />
          }
        >
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings">Settings</Breadcrumb>
          <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
        <Breadcrumbs separator={<RiMore2Line size="1em" />}>
          <Breadcrumb href="/home">Home</Breadcrumb>
          <Breadcrumb href="/home/settings">Settings</Breadcrumb>
          <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
        </Breadcrumbs>
      </div>
    </MemoryRouter>
  );
};

export const MixedSegments = () => {
  return (
    <MemoryRouter>
      <Breadcrumbs>
        <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
        <Breadcrumb>Breadcrumb with no href</Breadcrumb>
        <Breadcrumb href="/my-plugin/subpage">Breadcrumb with href</Breadcrumb>
        <Breadcrumb href="/my-plugin/subpage/sub-subpage">
          Breadcrumb with href but is last
        </Breadcrumb>
      </Breadcrumbs>
    </MemoryRouter>
  );
};
