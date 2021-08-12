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

import React, { lazy, Suspense } from 'react';
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { InfoCard } from '@backstage/core-components';
import { SettingsModal } from './components';
import { createReactExtension, useApp } from '@backstage/core-plugin-api';

type Component = (props: any) => JSX.Element;
type ComponentProps = {
  title?: string;
};
type ComponentParts = {
  Content: React.LazyExoticComponent<Component>;
  Actions?: React.LazyExoticComponent<Component>;
  Settings?: React.LazyExoticComponent<Component>;
  ContextProvider?: React.LazyExoticComponent<Component>;
};

type ComponentRenderer = {
  Renderer?: (props: { title: string } & ComponentParts) => JSX.Element;
};

const lazyLoadedComponent = (component: () => Promise<Component>) =>
  lazy(() => component().then(inner => ({ default: inner })));

export function createCardExtension<T>({
  title,
  content,
  actions,
  contextProvider,
  settings,
}: {
  title: string;
  content: () => Promise<Component>;
  actions?: () => Promise<Component>;
  contextProvider?: () => Promise<Component>;
  settings?: () => Promise<Component>;
}) {
  const Content = lazyLoadedComponent(content);
  const Actions = actions ? lazyLoadedComponent(actions) : null;
  const Settings = settings ? lazyLoadedComponent(settings) : null;
  const ContextProvider = contextProvider
    ? lazyLoadedComponent(contextProvider)
    : null;

  const CardExtension = ({
    Renderer,
    title: overrideTitle,
    ...childProps
  }: ComponentRenderer & ComponentProps & T) => {
    const app = useApp();
    const { Progress } = app.getComponents();
    const [settingsOpen, setSettingsOpen] = React.useState(false);

    if (Renderer) {
      return (
        <Suspense fallback={<Progress />}>
          <Renderer
            title={overrideTitle || title}
            {...{
              Content,
              ...(Actions ? { Actions } : {}),
              ...(Settings ? { Settings } : {}),
              ...(ContextProvider ? { ContextProvider } : {}),
              ...childProps,
            }}
          />
        </Suspense>
      );
    }

    const cardProps = {
      title: overrideTitle ?? title,
      ...(Settings
        ? {
            action: (
              <IconButton onClick={() => setSettingsOpen(true)}>
                <SettingsIcon>Settings</SettingsIcon>
              </IconButton>
            ),
          }
        : {}),
      ...(Actions
        ? {
            actions: <Actions />,
          }
        : {}),
    };

    const innerContent = (
      <InfoCard {...cardProps}>
        {Settings && (
          <SettingsModal
            open={settingsOpen}
            componentName={title}
            close={() => setSettingsOpen(false)}
          >
            <Settings />
          </SettingsModal>
        )}
        <Content />
      </InfoCard>
    );

    return (
      <Suspense fallback={<Progress />}>
        {ContextProvider ? (
          <ContextProvider {...childProps}>{innerContent}</ContextProvider>
        ) : (
          innerContent
        )}
      </Suspense>
    );
  };

  return createReactExtension({
    component: {
      sync: (props: ComponentRenderer & ComponentProps & T) => (
        <CardExtension {...props} />
      ),
    },
  });
}
