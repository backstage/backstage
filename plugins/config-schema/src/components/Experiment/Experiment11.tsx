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

export interface OverridableComponentProviderProps<Props> {
  Component(props: Props): JSX.Element | null;
  children?: ReactNode;
}

export interface OverridableComponentOverrideProps<Props> {
  props(props: Props): Props;
  children?: ReactNode;
}

export interface OverridableComponent<Props extends {}> {
  (props: Props): JSX.Element | null;

  Provider(props: OverridableComponentProviderProps<Props>): JSX.Element;
  Override(props: OverridableComponentOverrideProps<Props>): JSX.Element;
}

export type OverridableComponentSpec = {
  mapProps(props: unknown): unknown;
  Component(props: unknown): JSX.Element | null;
};

export interface OverridableComponents {
  specs: { [id in string]?: OverridableComponentSpec };
}

// This one is likely a versioned context in the real implementation
const ComponentsContext = createContext<OverridableComponents | undefined>(
  undefined,
);

export interface OverridableComponentsProviderProps {
  specs?: { [id in string]: OverridableComponentSpec };
  children?: ReactNode;
}

export function OverridableComponentsProvider(
  props: OverridableComponentsProviderProps,
) {
  const parent = useContext(ComponentsContext);

  const value: OverridableComponents = {
    specs: {
      ...parent?.specs,
      ...props.specs,
    },
  };

  return <ComponentsContext.Provider value={value} children={props.children} />;
}

export function useOverridableComponents(): OverridableComponents {
  const holder = useContext(ComponentsContext);
  if (!holder) {
    throw new Error('No OverridableComponents found');
  }
  return holder;
}

export interface CreateOverridableComponentOptions {
  id: string;
}

export function createOverridableComponent<Props extends {} = never>(
  options: CreateOverridableComponentOptions,
): OverridableComponent<Props> {
  const { id } = options;

  const Provider = ({
    Component,
    children,
  }: OverridableComponentProviderProps<Props>) => {
    const specs = {
      [id]: {
        Component,
        mapProps: props => props,
      } as OverridableComponentSpec,
    };

    return <OverridableComponentsProvider specs={specs} children={children} />;
  };

  const Override = (props: OverridableComponentOverrideProps<Props>) => {
    const parent = useOverridableComponents();
    const parentSpec = parent.specs[id];

    const specs = parentSpec && {
      [id]: {
        Component: parentSpec.Component,
        mapProps: mappedProps =>
          props.props(parentSpec.mapProps(mappedProps) as Props),
      } as OverridableComponentSpec,
    };

    return (
      <OverridableComponentsProvider specs={specs} children={props.children} />
    );
  };

  const Layout = (props: Props) => {
    const holder = useOverridableComponents();

    const spec = holder.specs[id];
    if (!spec) {
      throw new Error(`Component '${id}' is not available`);
    }

    const { mapProps, Component } = spec;

    return <Component {...(mapProps(props) as Props)} />;
  };

  return Object.assign(Layout, { Provider, Override });
}

export const PageLayout = createOverridableComponent<PageLayoutProps>({
  id: 'Page',
});

function MyPageLayout(props: PageLayoutProps) {
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
}

function MyPage() {
  return (
    <PageLayout title="My Page" menu={{ items: [] }}>
      This is my page
    </PageLayout>
  );
}

export function Experiment11() {
  return (
    <div>
      <h1>Experiment 11</h1>
      <PageLayout.Provider Component={MyPageLayout}>
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
      </PageLayout.Provider>
    </div>
  );
}
