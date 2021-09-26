/*
 * Copyright 2021 The Backstage Authors
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
/* eslint-disable no-console */

import { Content, Header, Page } from '@backstage/core-components';
import { IconComponent } from '@backstage/core-plugin-api';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { ReactNode, useContext } from 'react';

export interface PageLayoutMenuItem {
  title: string;
  icon: IconComponent;
  onClick: () => void;
  contentElement?: ReactNode;
}

export interface PageLayoutProps {
  children: ReactNode;
  title: string;
  menu: {
    items: PageLayoutMenuItem[];
  };
}

export interface CardLayoutProps {
  children: ReactNode;
}

// What should this be? Let's make some shit up for now and then maybe explore deeper later
interface LayoutContextType {
  renderPage?(props: PageLayoutProps): JSX.Element;
  renderCard?(props: CardLayoutProps): JSX.Element;
}

// This one is likely a versioned context in the real implementation
const LayoutContext = React.createContext<LayoutContextType>({});

function LayoutProvider({
  children,
  ...rest
}: LayoutContextType & { children: ReactNode }) {
  return <LayoutContext.Provider value={rest} children={children} />;
}

interface PageLayoutOverrideProps {
  children: ReactNode;
  title?: string;
  menu?: {
    items?: PageLayoutMenuItem[];
    appendItems?: PageLayoutMenuItem[];
  };
}

function PageLayoutOverride(props: PageLayoutOverrideProps) {
  const { children } = props;
  const layout = useContext(LayoutContext);
  const parentRenderPage = layout.renderPage;
  if (!parentRenderPage) {
    throw new Error('Layout context does not support pages');
  }

  const renderPage = (pageProps: PageLayoutProps) => {
    const title = props.title ?? pageProps.title;

    let menuItems = pageProps.menu.items || [];
    if (props.menu?.items) {
      menuItems = props.menu?.items;
    }
    if (props.menu?.appendItems) {
      menuItems = [...menuItems, ...props.menu?.appendItems];
    }

    return parentRenderPage({
      ...pageProps,
      title,
      menu: { ...pageProps.menu, items: menuItems },
    });
  };

  return (
    <LayoutContext.Provider
      value={{ ...layout, renderPage }}
      children={children}
    />
  );
}

function LayoutPage({
  children,
  title,
}: {
  title: string;
  children: ReactNode;
}) {
  const { renderPage } = useContext(LayoutContext);
  if (!renderPage) {
    throw new Error('Layout context does not support pages');
  }

  return renderPage({ children, title, menu: { items: [] } });
}

function MyLayoutProvider({ children }: { children: ReactNode }) {
  const renderPage = (props: PageLayoutProps) => {
    return (
      <Page themeId="service">
        <Header title={props.title}>
          <MenuList>
            {props.menu.items.map(({ icon: Icon, title, onClick }) => (
              <MenuItem onClick={onClick}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={title} />
              </MenuItem>
            ))}
          </MenuList>
        </Header>
        <Content>
          <LayoutContract>
            {props.children}
            {props.menu.items.map(item => item.contentElement).filter(Boolean)}
          </LayoutContract>
        </Content>
      </Page>
    );
  };
  return <LayoutProvider renderPage={renderPage}>{children}</LayoutProvider>;
}

function MyPage() {
  return <LayoutPage title="My Page">This is my page</LayoutPage>;
}

export function Experiment8() {
  return (
    <div>
      <h1>Experiment 8</h1>
      <MyLayoutProvider>
        {/* This is backwards a needs a fix, the inner override should take precedence */}
        <PageLayoutOverride
          title="Lollers"
          menu={{
            appendItems: [
              {
                icon: MoreVert,
                title: 'Wat',
                onClick: () => console.log('hello'),
              },
            ],
          }}
        >
          <PageLayoutOverride
            title="Herp Derp"
            menu={{
              items: [
                {
                  icon: MoreVert,
                  title: 'More',
                  onClick: () => console.log('hello'),
                },
              ],
            }}
          >
            <MyPage />
          </PageLayoutOverride>
        </PageLayoutOverride>
      </MyLayoutProvider>
    </div>
  );
}

export function LayoutContract({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'stretch',
      }}
    >
      {children}
    </div>
  );
}
