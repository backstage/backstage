/*
 * Copyright 2025 The Backstage Authors
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
  templatingExtensionsRouteRef,
} from '../../routes';

import { makeStyles } from '@material-ui/core/styles';

import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

import {
  Content,
  EmptyState,
  ErrorPanel,
  Header,
  Link,
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
import LinkIcon from '@material-ui/icons/Link';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';
import {
  Extension,
  ExtensionKind,
  listTemplatingExtensions,
  parseFragment,
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

  argRequired: {
    position: 'relative',
    '& > *': {
      display: 'inline',
      position: 'relative',
      '&::after': {
        position: 'absolute',
        content: '"*"',
        top: 0,
        right: theme.spacing(-1),
        fontWeight: 'bolder',
        color: theme.palette.error.light,
      },
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

export const TemplatingExtensionsPageContent = ({
  linkLocal,
}: {
  linkLocal?: boolean;
}) => {
  const api = useApi(scaffolderApiRef);
  const classes = useStyles();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const { loading, value, error } = useAsync(async () => {
    if (api.listTemplatingExtensions) {
      return api.listTemplatingExtensions();
    }
    // eslint-disable-next-line no-console
    console.warn(
      'listTemplatingExtensions is not implemented in the scaffolderApi; please make sure to implement this method.',
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
        selectTab(parseFragment(window.location.hash.substring(1)).kind);
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
        label: t('templatingExtensions.content.filters.title'),
      },
      function: {
        icon: <FunctionsIcon />,
        label: t('templatingExtensions.content.functions.title'),
      },
      value: {
        icon: <AllInclusiveIcon />,
        label: t('templatingExtensions.content.values.title'),
      },
    }),
    [t],
  );

  const templatingExtensionsLink = useRouteRef(templatingExtensionsRouteRef);

  if (loading) {
    return <Progress />;
  }
  if (error || !value) {
    return (
      <div data-testid="empty">
        {error && <ErrorPanel error={error} />}
        <EmptyState
          missing="info"
          title={t('templatingExtensions.content.emptyState.title')}
          description={t('templatingExtensions.content.emptyState.description')}
        />
      </div>
    );
  }
  const { filters, globals } = value;

  const baseLink = (
    <Link
      className={classes.link}
      to={templatingExtensionsLink()}
      {...(linkLocal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
    >
      <LinkIcon />
    </Link>
  );

  return (
    <>
      <Autocomplete
        renderInput={params => (
          <TextField
            {...params}
            aria-label={t(
              'templatingExtensions.content.searchFieldPlaceholder',
            )}
            placeholder={t(
              'templatingExtensions.content.searchFieldPlaceholder',
            )}
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
        getOptionSelected={(lhs, rhs) => lhs === rhs}
        options={listTemplatingExtensions(value)}
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
        {Object.entries(extensionKinds).map(([k, v]) => (
          <Tab key={k} value={k} {...v} />
        ))}
      </Tabs>
      {tab === 'filter' && (
        <TemplateFilters {...{ baseLink, t, classes, filters, selectedItem }} />
      )}
      {tab === 'function' && (
        <TemplateGlobalFunctions
          functions={globals.functions}
          {...{ baseLink, t, classes, selectedItem }}
        />
      )}
      {tab === 'value' && (
        <TemplateGlobalValues
          values={globals.values}
          {...{ baseLink, t, classes, selectedItem }}
        />
      )}
    </>
  );
};

export type TemplatingExtensionsPageProps = {
  contextMenu?: {
    editor?: boolean;
    actions?: boolean;
    tasks?: boolean;
    create?: boolean;
  };
};

export const TemplatingExtensionsPage = (
  props: TemplatingExtensionsPageProps,
) => {
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const createLink = useRouteRef(rootRouteRef);
  const actionsLink = useRouteRef(actionsRouteRef);

  const scaffolderPageContextMenuProps: ScaffolderPageContextMenuProps = {
    onEditorClicked:
      props?.contextMenu?.editor !== false
        ? () => navigate(editorLink())
        : undefined,
    onActionsClicked:
      props?.contextMenu?.actions !== false
        ? () => navigate(actionsLink())
        : undefined,
    onTasksClicked:
      props?.contextMenu?.tasks !== false
        ? () => navigate(tasksLink())
        : undefined,
    onCreateClicked:
      props?.contextMenu?.create !== false
        ? () => navigate(createLink())
        : undefined,
    onTemplatingExtensionsClicked: undefined,
  };

  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride={t('templatingExtensions.pageTitle')}
        title={t('templatingExtensions.title')}
        subtitle={t('templatingExtensions.subtitle')}
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      <Content>
        <TemplatingExtensionsPageContent linkLocal />
      </Content>
    </Page>
  );
};
