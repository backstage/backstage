/*
 * Copyright 2024 The Backstage Authors
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

import { ReactNode } from 'react';
import { IconElement } from '../icons/types';
import { createSwappableComponent } from './createSwappableComponent';

/**
 * Tab configuration for page navigation
 * @public
 */
export interface PageTab {
  id: string;
  label: string;
  href: string;
  matchStrategy?: 'prefix' | 'exact';
}

/**
 * Props for the PageLayout component
 * @public
 */
export interface PageLayoutProps {
  title?: string;
  icon?: IconElement;
  headerActions?: ReactNode;
  tabs?: PageTab[];
  children?: ReactNode;
}

/**
 * Default implementation of PageLayout using plain HTML elements
 */
function DefaultPageLayout(props: PageLayoutProps): JSX.Element {
  const { title, icon, headerActions, tabs, children } = props;

  return (
    <div
      data-component="page-layout"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        minHeight: 0,
      }}
    >
      {(title || tabs) && (
        <header
          style={{
            borderBottom: '1px solid #ddd',
            backgroundColor: '#fff',
            flexShrink: 0,
          }}
        >
          {title && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px 8px',
                fontSize: '18px',
                fontWeight: 500,
              }}
            >
              {icon}
              {title}
              {headerActions && (
                <div style={{ marginLeft: 'auto' }}>{headerActions}</div>
              )}
            </div>
          )}
          {tabs && tabs.length > 0 && (
            <nav
              style={{
                display: 'flex',
                gap: '4px',
                padding: '0 24px',
              }}
            >
              {tabs.map(tab => (
                <a
                  key={tab.id}
                  href={tab.href}
                  style={{
                    padding: '8px 12px',
                    textDecoration: 'none',
                    color: '#333',
                    borderBottom: '2px solid transparent',
                  }}
                >
                  {tab.label}
                </a>
              ))}
            </nav>
          )}
        </header>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Swappable component for laying out page content with header and navigation.
 * The default implementation uses plain HTML elements.
 * Apps can override this with a custom implementation (e.g., using \@backstage/ui).
 *
 * @public
 */
export const PageLayout = createSwappableComponent<PageLayoutProps>({
  id: 'core.page-layout',
  loader: () => DefaultPageLayout,
});
