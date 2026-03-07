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

import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

import {
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Content,
  EmptyState,
  ErrorPanel,
  Header,
  Input,
  Link,
  Page,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  ShadcnTabs,
  TabsList,
  TabsTrigger,
} from '@backstage/core-components';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import {
  ScaffolderPageContextMenu,
  ScaffolderPageContextMenuProps,
} from '@backstage/plugin-scaffolder-react/alpha';
import { Infinity, Filter, FunctionSquare, Link2, Search } from 'lucide-react';
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

/**
 * Tailwind CSS class definitions replacing MUI makeStyles.
 * These classes are passed as a Record<string, string> to child components
 * (TemplateFilters, TemplateGlobalFunctions, TemplateGlobalValues) for
 * consistent code/required/link styling throughout the page.
 */
const tailwindClasses: Record<
  'code' | 'codeRequired' | 'argRequired' | 'link',
  string
> = {
  code: 'font-mono p-2 bg-muted inline-block rounded border border-border relative',
  codeRequired:
    "after:content-['*'] after:absolute after:top-0 after:right-1 after:font-bold after:text-destructive",
  argRequired:
    "relative [&>*]:inline [&>*]:relative [&>*]:after:content-['*'] [&>*]:after:absolute [&>*]:after:top-0 [&>*]:after:-right-2 [&>*]:after:font-bold [&>*]:after:text-destructive",
  link: 'pl-2 cursor-pointer',
};

export const TemplatingExtensionsPageContent = ({
  linkLocal,
}: {
  linkLocal?: boolean;
}) => {
  const api = useApi(scaffolderApiRef);
  const classes = tailwindClasses;
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
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const handleTab = (tabValue: string) => {
    const kind = tabValue as ExtensionKind;
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
        icon: <Filter className="h-4 w-4" />,
        label: t('templatingExtensions.content.filters.title'),
      },
      function: {
        icon: <FunctionSquare className="h-4 w-4" />,
        label: t('templatingExtensions.content.functions.title'),
      },
      value: {
        icon: <Infinity className="h-4 w-4" />,
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
      className={cn(classes.link)}
      to={templatingExtensionsLink()}
      {...(linkLocal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
    >
      <Link2 className="h-4 w-4" />
    </Link>
  );

  return (
    <>
      <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="templating-extensions-search"
              name="templating-extensions-search"
              aria-label={t(
                'templatingExtensions.content.searchFieldPlaceholder',
              )}
              placeholder={t(
                'templatingExtensions.content.searchFieldPlaceholder',
              )}
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setComboboxOpen(true)}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  setInput('');
                  setComboboxOpen(false);
                }
              }}
              className="pl-10 w-full"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandList>
              {Object.entries(
                listTemplatingExtensions(value)
                  .filter(ext =>
                    ext.name.toLowerCase().includes(input.toLowerCase()),
                  )
                  .reduce((groups, ext) => {
                    const group = ext.kind;
                    if (!groups[group]) {
                      groups[group] = [];
                    }
                    groups[group].push(ext);
                    return groups;
                  }, {} as Record<string, Extension[]>),
              ).map(([group, items]) => (
                <CommandGroup
                  key={group}
                  heading={
                    <div className="flex items-center gap-2">
                      {extensionKinds[group as ExtensionKind].icon}
                      {extensionKinds[group as ExtensionKind].label}
                    </div>
                  }
                >
                  {items.map(option => (
                    <CommandItem
                      key={`${option.kind}_${option.name}`}
                      value={`${option.kind}_${option.name}`}
                      onSelect={() => {
                        selectItem(option);
                        setInput(option.name);
                        setComboboxOpen(false);
                      }}
                    >
                      <span className="text-sm">{option.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              <CommandEmpty>
                {t('templatingExtensions.content.emptyState.title')}
              </CommandEmpty>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <ShadcnTabs value={tab} onValueChange={handleTab}>
        <TabsList className="flex justify-center">
          {Object.entries(extensionKinds).map(([k, v]) => (
            <TabsTrigger
              key={k}
              value={k}
              className="flex items-center gap-1.5"
              onClick={() => handleTab(k)}
            >
              {v.icon}
              {v.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </ShadcnTabs>
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
