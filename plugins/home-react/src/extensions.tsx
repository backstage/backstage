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
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { InfoCard } from '@backstage/core-components';
import { SettingsModal } from './components';
import { createReactExtension, useApp } from '@backstage/core-plugin-api';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

/**
 * @public
 */
export type ComponentRenderer = {
  Renderer?: (props: RendererProps) => JSX.Element;
};

/**
 * @public
 */
export type ComponentParts = {
  Content: (props?: any) => JSX.Element;
  Actions?: () => JSX.Element;
  Settings?: () => JSX.Element;
  ContextProvider?: (props: any) => JSX.Element;
};

/**
 * @public
 */
export type RendererProps = { title?: string } & ComponentParts;

/**
 * @public
 */
export type CardExtensionProps<T> = ComponentRenderer & {
  title?: string;
} & T;

/**
 * @public
 */
export type CardLayout = {
  width?: { minColumns?: number; maxColumns?: number; defaultColumns?: number };
  height?: { minRows?: number; maxRows?: number; defaultRows?: number };
};

/**
 * @public
 */
export type CardSettings = {
  schema?: RJSFSchema;
  uiSchema?: UiSchema;
};

/**
 * @public
 */
export type CardConfig = {
  layout?: CardLayout;
  settings?: CardSettings;
};

/**
 * An extension creator to create card based components for the homepage
 *
 * @public
 */
export function createCardExtension<T>(options: {
  title?: string;
  components: () => Promise<ComponentParts>;
  name?: string;
  description?: string;
  layout?: CardLayout;
  settings?: CardSettings;
}) {
  const { title, components, name, description, layout, settings } = options;
  // If widget settings schema is defined, we don't want to show the Settings icon or dialog
  const isCustomizable = settings?.schema !== undefined;

  return createReactExtension({
    name,
    data: { title, description, 'home.widget.config': { layout, settings } },
    component: {
      lazy: () =>
        components().then(componentParts => {
          return (props: CardExtensionProps<T>) => {
            return (
              <CardExtension
                {...props}
                {...componentParts}
                title={props.title || title}
                isCustomizable={isCustomizable}
              />
            );
          };
        }),
    },
  });
}

type CardExtensionComponentProps<T> = CardExtensionProps<T> &
  ComponentParts & {
    isCustomizable?: boolean;
    overrideTitle?: string;
  };

function CardExtension<T>(props: CardExtensionComponentProps<T>) {
  const {
    Renderer,
    Content,
    Settings,
    Actions,
    ContextProvider,
    isCustomizable,
    title,
    ...childProps
  } = props;
  const app = useApp();
  const { Progress } = app.getComponents();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  if (Renderer) {
    return (
      <Suspense fallback={<Progress />}>
        <Renderer
          {...(title && { title })}
          {...{
            Content,
            ...(Actions ? { Actions } : {}),
            ...(Settings && !isCustomizable ? { Settings } : {}),
            ...(ContextProvider ? { ContextProvider } : {}),
            ...childProps,
          }}
        />
      </Suspense>
    );
  }

  const cardProps = {
    divider: !!title,
    ...(title && { title }),
    ...(Settings && !isCustomizable
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
      {Settings && !isCustomizable && (
        <SettingsModal
          open={settingsOpen}
          componentName={title}
          close={() => setSettingsOpen(false)}
        >
          <Settings />
        </SettingsModal>
      )}
      <Content {...childProps} />
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
}
