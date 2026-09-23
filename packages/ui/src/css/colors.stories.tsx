/*
 * Copyright 2025 The Backstage Authors
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
import preview from '../../../../.storybook/preview';

const meta = preview.meta({
  title: 'Backstage UI/Colors',
  tags: ['!manifest'],
});

type SwatchItem = { label: string; token: string };

const Swatch = ({ label, token }: SwatchItem) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.375rem 0',
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: `var(${token})`,
        border: '1px solid rgba(127 127 127 / 20%)',
        flexShrink: 0,
      }}
    />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span
        style={{
          fontSize: '0.8125rem',
          color: 'var(--bui-fg-primary)',
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '0.6875rem',
          color: 'var(--bui-fg-secondary)',
          fontFamily: 'var(--bui-font-monospace)',
          lineHeight: 1.3,
        }}
      >
        {token}
      </span>
    </div>
  </div>
);

const Section = ({
  title,
  tokens,
}: {
  title: string;
  tokens: SwatchItem[];
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 260 }}>
    <div
      style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--bui-fg-secondary)',
        padding: '0.5rem 0',
        marginBottom: '0.25rem',
        borderBottom: '1px solid var(--bui-border-1)',
      }}
    >
      {title}
    </div>
    {tokens.map(t => (
      <Swatch key={t.token} {...t} />
    ))}
  </div>
);

export const All = meta.story({
  name: 'All Colors',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '2.5rem 3rem',
        padding: '2rem',
      }}
    >
      <Section
        title="Gray Scale"
        tokens={[
          { label: 'Gray 1', token: '--bui-gray-1' },
          { label: 'Gray 2', token: '--bui-gray-2' },
          { label: 'Gray 3', token: '--bui-gray-3' },
          { label: 'Gray 4', token: '--bui-gray-4' },
          { label: 'Gray 5', token: '--bui-gray-5' },
          { label: 'Gray 6', token: '--bui-gray-6' },
          { label: 'Gray 7', token: '--bui-gray-7' },
          { label: 'Gray 8', token: '--bui-gray-8' },
          { label: 'Gray 9', token: '--bui-gray-9' },
          { label: 'Gray 10', token: '--bui-gray-10' },
          { label: 'Gray 11', token: '--bui-gray-11' },
        ]}
      />

      <Section
        title="Neutral Backgrounds"
        tokens={[
          { label: 'App', token: '--bui-bg-app' },
          { label: 'Neutral 1', token: '--bui-bg-neutral-1' },
          { label: 'Neutral 2', token: '--bui-bg-neutral-2' },
          { label: 'Neutral 3', token: '--bui-bg-neutral-3' },
          { label: 'Neutral 4', token: '--bui-bg-neutral-4' },
        ]}
      />

      <Section
        title="Foreground"
        tokens={[
          { label: 'Primary', token: '--bui-fg-primary' },
          { label: 'Secondary', token: '--bui-fg-secondary' },
          { label: 'Disabled', token: '--bui-fg-disabled' },
          { label: 'Positive', token: '--bui-fg-positive' },
          { label: 'Negative', token: '--bui-fg-negative' },
          { label: 'Warning', token: '--bui-fg-warning' },
          { label: 'Announcement', token: '--bui-fg-announcement' },
        ]}
      />

      <Section
        title="Border"
        tokens={[
          { label: 'Border 1', token: '--bui-border-1' },
          { label: 'Border 2', token: '--bui-border-2' },
        ]}
      />

      <Section
        title="Accent"
        tokens={[
          { label: 'Bg', token: '--bui-accent-bg' },
          { label: 'Bg - Hover', token: '--bui-accent-bg-hover' },
          { label: 'Bg - Disabled', token: '--bui-accent-bg-disabled' },
          { label: 'Fg', token: '--bui-accent-fg' },
          { label: 'Fg - Disabled', token: '--bui-accent-fg-disabled' },
        ]}
      />

      <Section
        title="Announcement"
        tokens={[
          { label: 'Bg - Base', token: '--bui-announcement-bg' },
          {
            label: 'Bg - Base - Hover',
            token: '--bui-announcement-bg-hover',
          },
          {
            label: 'Bg - Base - Disabled',
            token: '--bui-announcement-bg-disabled',
          },
          { label: 'Bg - Subdued', token: '--bui-announcement-bg-subdued' },
          {
            label: 'Bg - Subdued - Hover',
            token: '--bui-announcement-bg-subdued-hover',
          },
          {
            label: 'Bg - Subdued - Disabled',
            token: '--bui-announcement-bg-subdued-disabled',
          },
          { label: 'Border', token: '--bui-announcement-border' },
          { label: 'Fg - On Base', token: '--bui-announcement-fg' },
          {
            label: 'Fg - On Base - Disabled',
            token: '--bui-announcement-fg-disabled',
          },
          {
            label: 'Fg - On Subdued',
            token: '--bui-announcement-fg-subdued',
          },
          {
            label: 'Fg - On Subdued - Disabled',
            token: '--bui-announcement-fg-subdued-disabled',
          },
        ]}
      />

      <Section
        title="Warning"
        tokens={[
          { label: 'Bg - Base', token: '--bui-warning-bg' },
          { label: 'Bg - Base - Hover', token: '--bui-warning-bg-hover' },
          {
            label: 'Bg - Base - Disabled',
            token: '--bui-warning-bg-disabled',
          },
          { label: 'Bg - Subdued', token: '--bui-warning-bg-subdued' },
          {
            label: 'Bg - Subdued - Hover',
            token: '--bui-warning-bg-subdued-hover',
          },
          {
            label: 'Bg - Subdued - Disabled',
            token: '--bui-warning-bg-subdued-disabled',
          },
          { label: 'Border', token: '--bui-warning-border' },
          { label: 'Fg - On Base', token: '--bui-warning-fg' },
          {
            label: 'Fg - On Base - Disabled',
            token: '--bui-warning-fg-disabled',
          },
          { label: 'Fg - On Subdued', token: '--bui-warning-fg-subdued' },
          {
            label: 'Fg - On Subdued - Disabled',
            token: '--bui-warning-fg-subdued-disabled',
          },
        ]}
      />

      <Section
        title="Negative"
        tokens={[
          { label: 'Bg - Base', token: '--bui-negative-bg' },
          { label: 'Bg - Base - Hover', token: '--bui-negative-bg-hover' },
          {
            label: 'Bg - Base - Disabled',
            token: '--bui-negative-bg-disabled',
          },
          { label: 'Bg - Subdued', token: '--bui-negative-bg-subdued' },
          {
            label: 'Bg - Subdued - Hover',
            token: '--bui-negative-bg-subdued-hover',
          },
          {
            label: 'Bg - Subdued - Disabled',
            token: '--bui-negative-bg-subdued-disabled',
          },
          { label: 'Border', token: '--bui-negative-border' },
          { label: 'Fg - On Base', token: '--bui-negative-fg' },
          {
            label: 'Fg - On Base - Disabled',
            token: '--bui-negative-fg-disabled',
          },
          { label: 'Fg - On Subdued', token: '--bui-negative-fg-subdued' },
          {
            label: 'Fg - On Subdued - Disabled',
            token: '--bui-negative-fg-subdued-disabled',
          },
        ]}
      />

      <Section
        title="Positive"
        tokens={[
          { label: 'Bg - Base', token: '--bui-positive-bg' },
          { label: 'Bg - Base - Hover', token: '--bui-positive-bg-hover' },
          {
            label: 'Bg - Base - Disabled',
            token: '--bui-positive-bg-disabled',
          },
          { label: 'Bg - Subdued', token: '--bui-positive-bg-subdued' },
          {
            label: 'Bg - Subdued - Hover',
            token: '--bui-positive-bg-subdued-hover',
          },
          {
            label: 'Bg - Subdued - Disabled',
            token: '--bui-positive-bg-subdued-disabled',
          },
          { label: 'Border', token: '--bui-positive-border' },
          { label: 'Fg - On Base', token: '--bui-positive-fg' },
          {
            label: 'Fg - On Base - Disabled',
            token: '--bui-positive-fg-disabled',
          },
          { label: 'Fg - On Subdued', token: '--bui-positive-fg-subdued' },
          {
            label: 'Fg - On Subdued - Disabled',
            token: '--bui-positive-fg-subdued-disabled',
          },
        ]}
      />
    </div>
  ),
});
