/*
 * Copyright 2020 The Backstage Authors
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

import AsyncApi from '@asyncapi/react-component';
import '@asyncapi/react-component/styles/default.css';
import { makeStyles, alpha, darken } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';
import React from 'react';
import { useTheme } from '@material-ui/core';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  root: {
    fontFamily: 'inherit',
    '& .bg-white': {
      background: 'none',
    },
    '& .text-4xl': {
      ...theme.typography.h3,
    },
    ' & h2': {
      ...theme.typography.h4,
    },
    '& .border': {
      borderColor: alpha(theme.palette.border, 0.1),
    },
    '& .min-w-min': {
      minWidth: 'fit-content',
    },
    '& .examples': {
      padding: '1rem',
    },
    '& .bg-teal-500': {
      backgroundColor: theme.palette.status.ok,
    },
    '& .bg-blue-500': {
      backgroundColor: theme.palette.info.main,
    },
    '& .bg-blue-400': {
      backgroundColor: theme.palette.info.light,
    },
    '& .bg-indigo-400': {
      backgroundColor: theme.palette.warning.main,
    },
    '& .text-teal-50': {
      color: theme.palette.status.ok,
    },
    '& .text-red-600': {
      color: theme.palette.error.main,
    },
    '& .text-orange-600': {
      color: theme.palette.warning.main,
    },
    '& .text-teal-500': {
      color: theme.palette.status.ok,
    },
    '& .text-blue-500': {
      color: theme.palette.info.main,
    },
    '& .-rotate-90': {
      '--tw-rotate': '0deg',
    },
    '& button': {
      ...theme.typography.button,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.primary.main,
    },
    '& a': {
      color: theme.palette.link,
    },
    '& a.no-underline': {
      ...theme.typography.button,
      background: 'none',
      boxSizing: 'border-box',
      minWidth: 64,
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitions.create(
        ['background-color', 'box-shadow', 'border'],
        {
          duration: theme.transitions.duration.short,
        },
      ),
      padding: '5px 15px',
      color: theme.palette.primary.main,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
      '&:hover': {
        textDecoration: 'none',
        border: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.hoverOpacity,
        ),
      },
    },
    '& li.no-underline': {
      '& a': {
        textDecoration: 'none',
        color: theme.palette.getContrastText(theme.palette.primary.main),
      },
    },
  },
  dark: {
    '& svg': {
      fill: theme.palette.text.primary,
    },
    '& .prose': {
      color: theme.palette.text.secondary,
      '& h3': {
        color: theme.palette.text.primary,
      },
    },
    '& .bg-gray-100, .bg-gray-200': {
      backgroundColor: theme.palette.background.default,
    },
    '& .text-gray-600': {
      color: theme.palette.grey['50'],
    },
    '& .text-gray-700': {
      color: theme.palette.grey['100'],
    },
    '& .panel--right': {
      background: darken(theme.palette.navigation.background, 0.1),
    },
    '& .examples': {
      backgroundColor: darken(theme.palette.navigation.background, 0.1),
      '& pre': {
        backgroundColor: darken(theme.palette.background.default, 0.2),
      },
    },
  },
}));

type Props = {
  definition: string;
};

export const apis: AnyApiFactory[] = [
  // ...

  createApiFactory({
    api: apiDocsConfigRef,
    deps: {},
    factory: () => {
      // load the default widgets
      const definitionWidgets = defaultDefinitionWidgets();
      return {
        getApiDefinitionWidget: (apiEntity: ApiEntity) => {
          if (apiEntity.spec.type === 'asyncapi') {
            return {
              type: 'asyncapi',
              title: 'AsyncAPI',
              rawLanguage: 'yaml',
              component: definition => (
                <AsyncApiDefinitionWidget definition={definition} />
              ),
            } as ApiDefinitionWidget;
          }

          // fallback to the defaults
          return definitionWidgets.find(d => d.type === apiEntity.spec.type);
        },
      };
    },
  }),
];

const fetchResolver = {
  order: 199,
  canReadValue: false,
  // canRead: /^https?:\/\/[^\s$.?#].[^\s]*$/,
  canRead(file: any) {
    if ((this.canReadValue as any) instanceof Boolean) {
      return this.canReadValue;
    }
    return file.url.match(new RegExp(this.canReadValue as unknown as string));
  },
  fetchOptions: {},

  async read(file: any) {
    const response = await fetch(file.url, {
      ...this.fetchOptions,
    });
    return response.text();
  },
};

export const AsyncApiDefinition = ({ definition }: Props): JSX.Element => {
  const configApi = useApi(configApiRef);

  const globalConfig =
    configApi.getOptional<JsonObject>('apiDocs.asyncApi.parserConfig') || {};
  const fetchResolverConfig =
    configApi.getOptional<JsonObject>('apiDocs.asyncApi.fetcherConfig') || {};
  const config = {
    ...globalConfig,
    ...{
      parserOptions: {
        resolve: { fetch: { ...fetchResolver, ...fetchResolverConfig } },
      },
    },
  };

  const classes = useStyles();
  const theme = useTheme();
  const classNames = `${classes.root} ${
    theme.palette.type === 'dark' ? classes.dark : ''
  }`;

  return (
    <div className={classNames}>
      <AsyncApi schema={definition} config={config} />
    </div>
  );
};
