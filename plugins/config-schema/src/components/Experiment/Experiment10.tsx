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
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import React, { createContext, Fragment, ReactNode, useContext } from 'react';
import { LayoutContract, PageLayoutProps } from './Experiment8';

export interface LayoutProviderProps<Props> {
  render(props: Props): JSX.Element | null;
  children?: ReactNode;
}

export interface LayoutOverrideProps<Props> {
  props(props: Props): Props;
  children?: ReactNode;
}

export interface LayoutComponents<Props extends {}, ContentProps extends {}> {
  (props: ContentProps): JSX.Element | null;

  Provider(props: LayoutProviderProps<Props>): JSX.Element;
  Override(props: LayoutOverrideProps<Props>): JSX.Element;
}

export interface CreateLayoutOptions<
  Props extends {},
  ContentProps extends {},
> {
  mapContentProps(props: ContentProps): Props;
}

export function createLayout<Props extends {}, ContentProps extends {}>(
  options: CreateLayoutOptions<Props, ContentProps>,
): LayoutComponents<Props, ContentProps> {
  const { mapContentProps } = options;

  type ContextType = {
    render(props: Props): JSX.Element | null;
    mapProps(props: Props): Props;
  };

  // This one is likely a versioned context in the real implementation
  const Context = createContext<ContextType | undefined>(undefined);

  const Provider = ({ render, children }: LayoutProviderProps<Props>) => {
    return (
      <Context.Provider
        value={{ render, mapProps: props => props }}
        children={children}
      />
    );
  };

  const Override = ({ props, children }: LayoutOverrideProps<Props>) => {
    const parentLayout = useContext(Context);
    if (!parentLayout) {
      throw new Error('Layout override must be used within a layout provider');
    }

    const mapProps = (layoutProps: Props) =>
      props(parentLayout.mapProps(layoutProps));
    return (
      <Context.Provider
        value={{ ...parentLayout, mapProps }}
        children={children}
      />
    );
  };

  const Layout = (props: ContentProps) => {
    const layout = useContext(Context);
    if (!layout) {
      throw new Error(
        'Layout content must be rendered within a layout provider',
      );
    }

    return layout.render(layout.mapProps(mapContentProps(props)));
  };

  return Object.assign(Layout, { Provider, Override });
}

export const PageLayout = createLayout({
  mapContentProps: ({
    title,
    children,
  }: {
    title: string;
    children: ReactNode;
  }): PageLayoutProps => ({
    title,
    children,
    menu: { items: [] },
  }),
});

function MyPageLayoutProvider({ children }: { children: ReactNode }) {
  const renderPage = (props: PageLayoutProps) => {
    return (
      <Page themeId="service">
        <Header title={props.title}>
          <MenuList>
            {props.menu.items.map(({ icon: Icon, title, onClick }, index) => (
              <MenuItem onClick={onClick} key={index}>
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
            {props.menu.items
              .map((item, index) => (
                <Fragment key={index}>{item.contentElement}</Fragment>
              ))
              .filter(Boolean)}
          </LayoutContract>
        </Content>
      </Page>
    );
  };
  return (
    <PageLayout.Provider render={renderPage}>{children}</PageLayout.Provider>
  );
}

function MyPage() {
  return <PageLayout title="My Page">This is my page</PageLayout>;
}

export function Experiment10() {
  return (
    <div>
      <h1>Experiment 9</h1>
      <MyPageLayoutProvider>
        <PageLayout.Override
          props={props => ({
            ...props,
            title: 'Herp Derp',
            menu: {
              ...props.menu,
              items: [
                {
                  icon: MoreVert,
                  title: 'More',
                  onClick: () => console.log('hello'),
                },
              ],
            },
          })}
        >
          <PageLayout.Override
            props={props => ({
              ...props,
              title: 'Lollers',
              menu: {
                ...props.menu,
                items: [
                  ...props.menu.items,
                  {
                    icon: MoreVert,
                    title: 'Wut',
                    onClick: () => console.log('hello'),
                  },
                ],
              },
            })}
          >
            <MyPage />
          </PageLayout.Override>
        </PageLayout.Override>
      </MyPageLayoutProvider>
    </div>
  );
}
