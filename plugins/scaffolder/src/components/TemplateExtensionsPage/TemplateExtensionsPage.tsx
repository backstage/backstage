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
import { useApi, useRouteRef } from '@backstage/core-plugin-api';

import {
  actionsRouteRef,
  editRouteRef,
  rootRouteRef,
  scaffolderListTaskRouteRef,
  templateExtensionsRouteRef,
} from '../../routes';

import { makeStyles } from '@material-ui/core/styles';

import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

import {
  Content,
  EmptyState,
  ErrorPanel,
  Header,
  Page,
  Progress,
} from '@backstage/core-components';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import {
  ScaffolderPageContextMenu,
  ScaffolderPageContextMenuProps,
} from '@backstage/plugin-scaffolder-react/alpha';
import { every, isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';
import { TemplateFilters } from './TemplateFilters';
import { TemplateGlobals } from './TemplateGlobals';

const useStyles = makeStyles(theme => ({
  code: {
    fontFamily: 'Menlo, monospace',
    padding: theme.spacing(1),
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
    display: 'inline-block',
    borderRadius: 5,
    border: `1px solid ${theme.palette.grey[500]}`,
    position: 'relative',
  },

  codeRequired: {
    '&::after': {
      position: 'absolute',
      content: '"*"',
      top: 0,
      right: theme.spacing(0.5),
      fontWeight: 'bolder',
      color: theme.palette.error.light,
    },
  },

  link: {
    paddingLeft: theme.spacing(1),
    cursor: 'pointer',
  },
}));

export const TemplateExtensionsPageContent = ({
  linkPage,
}: {
  linkPage?: string;
}) => {
  const api = useApi(scaffolderApiRef);
  const classes = useStyles();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const { loading, value, error } = useAsync(async () => {
    if (api.listTemplateExtensions) {
      return api.listTemplateExtensions();
    }
    // eslint-disable-next-line no-console
    console.warn(
      'listTemplateExtensions is not implemented in the scaffolderApi; please make sure to implement this method.',
    );
    return Promise.resolve({
      filters: {},
      globals: { functions: {}, values: {} },
    });
  }, [api]);

  useEffect(() => {
    if (value && window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  }, [value]);

  const extensionsLink = useRouteRef(templateExtensionsRouteRef);

  if (loading) {
    return <Progress />;
  }
  if (
    error ||
    !value ||
    every(
      [value.filters, value.globals.functions, value.globals.values],
      isEmpty,
    )
  ) {
    return (
      <div data-testid="empty">
        {error && <ErrorPanel error={error} />}
        <EmptyState
          missing="info"
          title={t('templateExtensions.emptyState.title')}
          description={t('templateExtensions.emptyState.description')}
        />
      </div>
    );
  }
  const { filters, globals } = value;
  const effectiveLinkPage =
    linkPage === undefined ? extensionsLink() : linkPage;

  return (
    <>
      <TemplateFilters
        linkPage={effectiveLinkPage}
        {...{ t, classes, filters }}
      />
      <TemplateGlobals
        linkPage={effectiveLinkPage}
        {...{ t, classes, globals }}
      />
    </>
  );
};

export const TemplateExtensionsPage = () => {
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const createLink = useRouteRef(rootRouteRef);
  const actionsLink = useRouteRef(actionsRouteRef);

  const scaffolderPageContextMenuProps: ScaffolderPageContextMenuProps = {
    onEditorClicked: () => navigate(editorLink()),
    onActionsClicked: () => navigate(actionsLink()),
    onTasksClicked: () => navigate(tasksLink()),
    onCreateClicked: () => navigate(createLink()),
  };

  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride={t('templateExtensions.pageTitle')}
        title={t('templateExtensions.title')}
        subtitle={t('templateExtensions.subtitle')}
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      <Content>
        <TemplateExtensionsPageContent linkPage="" />
      </Content>
    </Page>
  );
};
