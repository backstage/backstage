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
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItemText from '@material-ui/core/ListItemText';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import FilterListIcon from '@material-ui/icons/FilterList';
import FunctionsIcon from '@material-ui/icons/Functions';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { isEqual, mapValues, trimStart, values } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';
import {
  Extension,
  ExtensionKind,
  listExtensions,
  parseLink,
} from './navigation';
import { TemplateFilters } from './TemplateFilters';
import {
  TemplateGlobalFunctions,
  TemplateGlobalValues,
} from './TemplateGlobals';

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

  tabs: {
    display: 'block',
    minHeight: 'initial',
    overflow: 'initial',
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

  const [tab, selectTab] = useState<ExtensionKind>('filter');
  const [selectedItem, setSelectedItem] = useState<Extension | null>(null);
  const [input, setInput] = useState<string>('');

  const handleTab = (_event: any, kind: ExtensionKind) => {
    if (selectedItem?.kind !== kind) {
      setSelectedItem(null);
      setInput('');
    }
    selectTab(kind);
  };

  const selectItem = (item: Extension | null) => {
    setSelectedItem(item);
    if (item) {
      selectTab(item.kind);
    }
  };

  useEffect(() => {
    if (value && window.location.hash) {
      try {
        selectTab(parseLink(trimStart(window.location.hash, '#')).kind);
        document.querySelector(window.location.hash)?.scrollIntoView();
      } catch (e) {
        // ignore bad link
      }
    }
  }, [value]);

  const extensionKinds = useMemo(
    () => ({
      filter: {
        icon: <FilterListIcon />,
        label: t('templateExtensions.content.filters.title'),
      },
      function: {
        icon: <FunctionsIcon />,
        label: t('templateExtensions.content.functions.title'),
      },
      value: {
        icon: <AllInclusiveIcon />,
        label: t('templateExtensions.content.values.title'),
      },
    }),
    [t],
  );

  const extensionsLink = useRouteRef(templateExtensionsRouteRef);

  if (loading) {
    return <Progress />;
  }
  if (error || !value) {
    return (
      <div data-testid="empty">
        {error && <ErrorPanel error={error} />}
        <EmptyState
          missing="info"
          title={t('templateExtensions.content.emptyState.title')}
          description={t('templateExtensions.content.emptyState.description')}
        />
      </div>
    );
  }
  const { filters, globals } = value;
  const effectiveLinkPage =
    linkPage === undefined ? extensionsLink() : linkPage;

  return (
    <>
      <Autocomplete
        renderInput={params => (
          <TextField
            {...params}
            aria-label={t('templateExtensions.content.searchFieldPlaceholder')}
            placeholder={t('templateExtensions.content.searchFieldPlaceholder')}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        getOptionLabel={option => option.name}
        getOptionSelected={isEqual}
        options={listExtensions(value)}
        groupBy={option => option.kind}
        renderGroup={params => (
          <>
            <Box display="flex" alignItems="center">
              {extensionKinds[params.group as ExtensionKind].icon}
              <Box sx={{ ml: 1 }}>
                {extensionKinds[params.group as ExtensionKind].label}
              </Box>
            </Box>
            <ul>{params.children}</ul>
          </>
        )}
        renderOption={(option: Extension) => (
          <ListItemText primary={option.name} />
        )}
        onChange={(_event: any, option: Extension | null) => {
          selectItem(option);
        }}
        inputValue={input}
        onInputChange={(_event: any, s: string) => setInput(s)}
        loading={loading}
        fullWidth
        clearOnEscape
      />
      <Tabs value={tab} onChange={handleTab} centered className={classes.tabs}>
        {values(
          mapValues(extensionKinds, (v, k) => <Tab key={k} value={k} {...v} />),
        )}
      </Tabs>
      {tab === 'filter' && (
        <TemplateFilters
          linkPage={effectiveLinkPage}
          {...{ t, classes, filters, selectedItem }}
        />
      )}
      {tab === 'function' && (
        <TemplateGlobalFunctions
          functions={globals.functions}
          linkPage={effectiveLinkPage}
          {...{ t, classes, selectedItem }}
        />
      )}
      {tab === 'value' && (
        <TemplateGlobalValues
          values={globals.values}
          linkPage={effectiveLinkPage}
          {...{ t, classes, selectedItem }}
        />
      )}
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
