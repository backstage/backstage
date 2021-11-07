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
import React, { Fragment, ReactNode, useContext } from 'react';
import {
  LayoutContract,
  CardLayoutProps,
  PageLayoutProps,
} from './Experiment8';

// By adding a prop transform we can apply transforms to the props both
// while traversing down and up through the contexts.
interface LayoutContextType {
  page?: {
    render(props: PageLayoutProps): JSX.Element;
    mapProps(props: PageLayoutProps): PageLayoutProps;
  };
  card?: {
    render(props: CardLayoutProps): JSX.Element;
    mapProps(props: CardLayoutProps): CardLayoutProps;
  };
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
  page?: (props: PageLayoutProps) => PageLayoutProps;
  card?: (props: CardLayoutProps) => CardLayoutProps;
}

// What if we made one override to support all layout types, they're gonna
// be embedded pretty deep into the layout system anyway it seems like.
// Maybe also make it a bit more functional instead of a bunch of declarative mutations?
function LayoutOverride(props: PageLayoutOverrideProps) {
  const { children, page: pageTransform, card: cardTransform } = props;
  const parentLayout = useContext(LayoutContext);

  let page = parentLayout.page;
  if (page && pageTransform) {
    const mapProps = (pageProps: PageLayoutProps) =>
      pageTransform(parentLayout.page?.mapProps?.(pageProps) ?? pageProps);
    page = { ...page, mapProps };
  }

  let card = parentLayout.card;
  if (card && cardTransform) {
    const mapProps = (cardProps: CardLayoutProps) =>
      cardTransform(parentLayout.card?.mapProps?.(cardProps) ?? cardProps);
    card = { ...card, mapProps };
  }

  return (
    <LayoutContext.Provider
      value={{ ...parentLayout, page, card }}
      children={children}
    />
  );
}

function LayoutContentPage({
  children,
  title,
}: {
  title: string;
  children: ReactNode;
}) {
  const layout = useContext(LayoutContext);
  if (!layout.page) {
    throw new Error('Layout context does not support pages');
  }

  return layout.page.render(
    layout.page.mapProps({ children, title, menu: { items: [] } }),
  );
}

function MyLayoutProvider({ children }: { children: ReactNode }) {
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
    <LayoutProvider page={{ render: renderPage, mapProps: props => props }}>
      {children}
    </LayoutProvider>
  );
}

function MyPage() {
  return <LayoutContentPage title="My Page">This is my page</LayoutContentPage>;
}

export function Experiment9() {
  return (
    <div>
      <h1>Experiment 9</h1>
      <MyLayoutProvider>
        <LayoutOverride
          page={props => ({
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
          <LayoutOverride
            page={props => ({
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
          </LayoutOverride>
        </LayoutOverride>
      </MyLayoutProvider>
    </div>
  );
}
