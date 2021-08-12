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

import React, { Suspense } from 'react';
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { InfoCard } from '@backstage/core-components';
import { SettingsModal } from './components';
import { createReactExtension, useApp } from '@backstage/core-plugin-api';

export type ComponentRenderer = {
  Renderer?: (props: RendererProps) => JSX.Element;
};

type ComponentParts = {
  Content: () => JSX.Element;
  Actions?: () => JSX.Element;
  Settings?: () => JSX.Element;
  ContextProvider?: (props: any) => JSX.Element;
};

type RendererProps = { title: string } & ComponentParts;

export function createCardExtension<T>({
  title,
  components,
}: {
  title: string;
  components: () => Promise<ComponentParts>;
}) {
  return createReactExtension({
    component: {
      lazy: () =>
        components().then(({ Content, Actions, Settings, ContextProvider }) => {
          const CardExtension = ({
            Renderer,
            title: overrideTitle,
            ...childProps
          }: ComponentRenderer & { title?: string } & T) => {
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
                  <ContextProvider {...childProps}>
                    {innerContent}
                  </ContextProvider>
                ) : (
                  innerContent
                )}
              </Suspense>
            );
          };
          return CardExtension;
        }),
    },
  });
}
