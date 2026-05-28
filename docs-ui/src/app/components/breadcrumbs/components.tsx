'use client';

import {
  Breadcrumbs,
  Breadcrumb,
} from '../../../../../packages/ui/src/components/Breadcrumbs/Breadcrumbs';
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

export const InheritsStyle = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ fontSize: '12px', color: '#e06c75' }}>
          <Breadcrumbs>
            <Breadcrumb href="/home">Home</Breadcrumb>
            <Breadcrumb href="/home/settings">Settings</Breadcrumb>
            <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
          </Breadcrumbs>
        </div>
        <div style={{ fontSize: '12px', color: '#e06c75' }}>
          <Breadcrumbs>
            <Breadcrumb href="/home">Home</Breadcrumb>
            <Breadcrumb href="/home/docs">Docs</Breadcrumb>
            <Breadcrumb href="/home/docs/guides">Guides</Breadcrumb>
            <Breadcrumb href="/home/docs/guides/setup">Setup</Breadcrumb>
            <Breadcrumb href="/home/docs/guides/setup/intro">
              Introduction
            </Breadcrumb>
          </Breadcrumbs>
        </div>
        <div style={{ fontSize: '24px', color: '#61afef' }}>
          <Breadcrumbs>
            <Breadcrumb href="/home">Home</Breadcrumb>
            <Breadcrumb href="/home/settings">Settings</Breadcrumb>
            <Breadcrumb href="/home/settings/theme">Theme</Breadcrumb>
          </Breadcrumbs>
        </div>
        <div style={{ fontSize: '24px', color: '#61afef' }}>
          <Breadcrumbs>
            <Breadcrumb href="/home">Home</Breadcrumb>
            <Breadcrumb href="/home/docs">Docs</Breadcrumb>
            <Breadcrumb href="/home/docs/guides">Guides</Breadcrumb>
            <Breadcrumb href="/home/docs/guides/setup">Setup</Breadcrumb>
            <Breadcrumb href="/home/docs/guides/setup/intro">
              Introduction
            </Breadcrumb>
          </Breadcrumbs>
        </div>
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
      <div
        style={
          {
            fontSize: '18px',
            color: '#c678dd',
            '--bui-Breadcrumbs-color-current': 'var(--bui-fg-primary)',
            '--bui-Breadcrumbs-font-weight-current':
              'var(--bui-font-weight-regular)',
          } as Record<string, string>
        }
      >
        <Breadcrumbs>
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
