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
        <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
        <Breadcrumb href="/my-plugin/subpage">Page with short name</Breadcrumb>
        <Breadcrumb href="/my-plugin/subpage/sub-subpage">
          Page with a long name that gets truncated
        </Breadcrumb>
        <Breadcrumb href="/my-plugin/subpage/sub-subpage/details">
          Current page with a long name is not truncated
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
            <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
            <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
            <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
          </Breadcrumbs>
        </div>
        <div style={{ fontSize: '24px', color: '#98c379' }}>
          <Breadcrumbs>
            <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
            <Breadcrumb href="/my-plugin/settings">Settings</Breadcrumb>
            <Breadcrumb href="/my-plugin/settings/theme">Theme</Breadcrumb>
          </Breadcrumbs>
        </div>
      </div>
    </MemoryRouter>
  );
};

export const MixedSegments = () => {
  return (
    <MemoryRouter>
      <Breadcrumbs>
        <Breadcrumb href="/my-plugin">My Plugin</Breadcrumb>
        <Breadcrumb>Label without link</Breadcrumb>
        <Breadcrumb href="/my-plugin/subpage">Subpage</Breadcrumb>
        <Breadcrumb href="/my-plugin/subpage/details">Details</Breadcrumb>
      </Breadcrumbs>
    </MemoryRouter>
  );
};
