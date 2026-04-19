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

function isProxied(): boolean {
  // If running behind the nginx proxy on :8080, use path-based switching
  return window.location.port === '8080' || window.location.port === '';
}

function getCurrentDesignSystem(): 'shadcn' | 'mui' {
  if (isProxied()) {
    return window.location.pathname.startsWith('/mui') ? 'mui' : 'shadcn';
  }
  return window.location.port === '3001' ? 'mui' : 'shadcn';
}

function getToggleUrl(): string {
  const current = getCurrentDesignSystem();

  if (isProxied()) {
    if (current === 'shadcn') {
      return `/mui${window.location.pathname}`;
    }
    return window.location.pathname.replace(/^\/mui\/?/, '/');
  }

  const targetPort = current === 'shadcn' ? '3001' : '3000';
  const url = new URL(window.location.href);
  url.port = targetPort;
  return url.toString();
}

export function DesignSystemToggle() {
  const current = getCurrentDesignSystem();
  const label = current === 'shadcn' ? 'shadcn/ui' : 'MUI';
  const targetLabel = current === 'shadcn' ? 'MUI' : 'shadcn/ui';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: current === 'shadcn' ? '#1a1a1a' : '#1976d2',
        color: '#fff',
        borderRadius: '2rem',
        padding: '0.5rem 0.75rem',
        fontSize: '0.75rem',
        fontFamily: 'system-ui, sans-serif',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'transform 0.15s ease',
      }}
      role="button"
      tabIndex={0}
      onClick={() => {
        window.location.href = getToggleUrl();
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          window.location.href = getToggleUrl();
        }
      }}
      onMouseEnter={e =>
        ((e.currentTarget as HTMLElement).style.transform = 'scale(1.05)')
      }
      onMouseLeave={e =>
        ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')
      }
      title={`Currently: ${label}. Click to switch to ${targetLabel}.`}
    >
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: current === 'shadcn' ? '#22c55e' : '#ff9800',
        }}
      />
      <span>
        <strong>{label}</strong>
      </span>
      <span style={{ opacity: 0.6 }}>→ {targetLabel}</span>
    </div>
  );
}
