/*
 * Copyright 2022 The Backstage Authors
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

import {
  ChangeEvent,
  FormEventHandler,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useCallback,
} from 'react';
import qs from 'qs';

import { Plus, ChevronRight, X } from 'lucide-react';

import { JsonValue } from '@backstage/types';
import {
  Link,
  LinkProps,
  Progress,
  EmptyState,
  ResponseErrorPanel,
  Badge,
  ShadcnButton,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  ShadcnSelect,
  SelectTrigger,
  SelectContent,
  ShadcnSelectItem,
  SelectValue,
} from '@backstage/core-components';
import { AnalyticsContext } from '@backstage/core-plugin-api';
import { SearchResult } from '@backstage/plugin-search-common';

import { useSearchResultListItemExtensions } from '../../extensions';

import { DefaultResultListItem } from '../DefaultResultListItem';
import { SearchResultState, SearchResultStateProps } from '../SearchResult';
import { searchReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/frontend-plugin-api';

/**
 * Props for {@link SearchResultGroupFilterFieldLayout}
 * @public
 */
export type SearchResultGroupFilterFieldLayoutProps = PropsWithChildren<{
  label: string;
  value?: JsonValue;
  onDelete: () => void;
}>;

/**
 * Default layout for a search group filter field.
 * @param props - See {@link SearchResultGroupFilterFieldLayoutProps}.
 * @public
 */
export const SearchResultGroupFilterFieldLayout = (
  props: SearchResultGroupFilterFieldLayoutProps,
) => {
  const { label, children, onDelete, value } = props;

  return (
    <Badge
      variant="outline"
      className="flex items-center gap-1 text-muted-foreground ml-1.5"
    >
      {label}: {children}
      {value !== undefined && (
        <button
          onClick={onDelete}
          className="ml-1 hover:text-foreground"
          aria-label={`Remove ${label} filter`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};

/**
 * Common props for a result group filter field.
 * @public
 */
export type SearchResultGroupFilterFieldPropsWith<T> = T &
  SearchResultGroupFilterFieldLayoutProps & {
    onChange: (value: JsonValue) => void;
  };

/**
 * Props for {@link SearchResultGroupTextFilterField}.
 * @public
 */
export type SearchResultGroupTextFilterFieldProps =
  SearchResultGroupFilterFieldPropsWith<{}>;

/**
 * A text field that can be used as filter on search result groups.
 * @param props - See {@link SearchResultGroupTextFilterFieldProps}.
 * @example
 * ```
 * <SearchResultGroupTextFilterField
 *   id="lifecycle"
 *   label="Lifecycle"
 *   value={value}
 *   onChange={handleChangeFilter}
 *   onDelete={handleDeleteFilter}
 * />
 * ```
 * @public
 */
export const SearchResultGroupTextFilterField = (
  props: SearchResultGroupTextFilterFieldProps,
) => {
  const { label, value = 'None', onChange, onDelete } = props;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <SearchResultGroupFilterFieldLayout label={label} onDelete={onDelete}>
      <span
        role="textbox"
        className="text-inherit focus:outline-none focus:bg-white cursor-pointer text-primary hover:underline focus:cursor-text focus:text-foreground focus:no-underline"
        onChange={
          handleChange as unknown as FormEventHandler<HTMLSpanElement>
        }
        contentEditable
        suppressContentEditableWarning
      >
        {value?.toString()}
      </span>
    </SearchResultGroupFilterFieldLayout>
  );
};

/**
 * Props for {@link SearchResultGroupSelectFilterField}.
 * @public
 */
export type SearchResultGroupSelectFilterFieldProps =
  SearchResultGroupFilterFieldPropsWith<{
    children: ReactNode;
  }>;

/**
 * A select field that can be used as filter on search result groups.
 * @param props - See {@link SearchResultGroupSelectFilterFieldProps}.
 * @example
 * ```
 * <SearchResultGroupSelectFilterField
 *   id="lifecycle"
 *   label="Lifecycle"
 *   value={filters.lifecycle}
 *   onChange={handleChangeFilter}
 *   onDelete={handleDeleteFilter}
 * >
 *   <ShadcnSelectItem value="experimental">Experimental</ShadcnSelectItem>
 *   <ShadcnSelectItem value="production">Production</ShadcnSelectItem>
 *  </SearchResultGroupSelectFilterField>
 * ```
 * @public
 */
export const SearchResultGroupSelectFilterField = (
  props: SearchResultGroupSelectFilterFieldProps,
) => {
  const { label, value = 'none', onChange, onDelete, children } = props;

  const handleChange = useCallback(
    (val: string) => {
      onChange(val as JsonValue);
    },
    [onChange],
  );

  return (
    <SearchResultGroupFilterFieldLayout label={label} onDelete={onDelete}>
      <ShadcnSelect value={value?.toString()} onValueChange={handleChange}>
        <SelectTrigger className="h-auto border-0 p-0 text-inherit text-primary hover:underline focus:outline-none focus:ring-0 [&>svg]:hidden">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <ShadcnSelectItem value="none">None</ShadcnSelectItem>
          {children}
        </SelectContent>
      </ShadcnSelect>
    </SearchResultGroupFilterFieldLayout>
  );
};

/**
 * Props for {@link SearchResultGroupLayout}
 * @public
 */
export type SearchResultGroupLayoutProps<FilterOption> =
  HTMLAttributes<HTMLUListElement> & {
    /**
     * If defined, will render a default error panel.
     */
    error?: Error;
    /**
     * If defined, will render a default loading progress.
     */
    loading?: boolean;
    /**
     * Icon that representing a result group.
     */
    icon: JSX.Element;
    /**
     * The results group title content, it could be a text or an element.
     */
    title: ReactNode;
    /**
     * Props for the results group title.
     */
    titleProps?: HTMLAttributes<HTMLElement>;
    /**
     * The results group link content, it could be a text or an element.
     */
    link?: ReactNode;
    /**
     * Props for the results group link, the "to" prop defaults to "/search".
     */
    linkProps?: Partial<LinkProps>;
    /**
     * A generic filter options that is rendered on the "Add filter" dropdown.
     */
    filterOptions?: FilterOption[];
    /**
     * Function to customize how filter options are rendered.
     * @remarks Defaults to a dropdown menu item where its value and label bounds to the option string.
     */
    renderFilterOption?: (
      value: FilterOption,
      index: number,
      array: FilterOption[],
    ) => JSX.Element | null;
    /**
     * A list of search filter keys, also known as filter field names.
     */
    filterFields?: string[];
    /**
     * Function to customize how filter chips are rendered.
     */
    renderFilterField?: (key: string) => JSX.Element | null;
    /**
     * Search results to be rendered as a group.
     */
    resultItems?: SearchResult[];
    /**
     * Function to customize how result items are rendered.
     */
    renderResultItem?: (
      value: SearchResult,
      index: number,
      array: SearchResult[],
    ) => JSX.Element | null;
    /**
     * Optional component to render when no results. Default to <EmptyState /> component.
     */
    noResultsComponent?: ReactNode;
    /**
     * Optional property to provide if component should not render the component when no results are found.
     */
    disableRenderingWithNoResults?: boolean;
  };

/**
 * Default layout for rendering search results in a group.
 * @param props - See {@link SearchResultGroupLayoutProps}.
 * @public
 */
export function SearchResultGroupLayout<FilterOption>(
  props: SearchResultGroupLayoutProps<FilterOption>,
) {
  const { t } = useTranslationRef(searchReactTranslationRef);

  const {
    error,
    loading,
    icon,
    title,
    titleProps = {},
    link = (
      <>
        {t('searchResultGroup.linkTitle')}
        <ChevronRight className="h-3 w-3 ml-0.5 inline" />
      </>
    ),
    linkProps = {},
    filterOptions,
    renderFilterOption = filterOption => (
      <DropdownMenuItem
        key={String(filterOption)}
        textValue={String(filterOption)}
      >
        {String(filterOption)}
      </DropdownMenuItem>
    ),
    filterFields,
    renderFilterField,
    resultItems,
    renderResultItem = resultItem => (
      <DefaultResultListItem
        key={resultItem.document.location}
        result={resultItem.document}
      />
    ),
    disableRenderingWithNoResults,
    noResultsComponent = disableRenderingWithNoResults ? null : (
      <EmptyState missing="data" title={t('noResultsDescription')} />
    ),
    ...rest
  } = props;

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <ResponseErrorPanel
        title="Error encountered while fetching search results"
        error={error}
      />
    );
  }

  if (!resultItems?.length) {
    return <>{noResultsComponent}</>;
  }

  return (
    <ul {...rest}>
      <li
        className="flex items-center px-4 py-2 sticky top-0 z-10 bg-background"
        role="presentation"
      >
        {icon}
        <strong
          className="ml-1 uppercase text-sm font-semibold"
          {...titleProps}
        >
          {title}
        </strong>
        {filterOptions ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ShadcnButton
                variant="ghost"
                size="sm"
                className="text-muted-foreground ml-1.5"
              >
                <Plus className="h-3 w-3 mr-1" />
                {t('searchResultGroup.addFilterButtonTitle')}
              </ShadcnButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filterOptions.map(renderFilterOption)}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {filterFields?.map(
          filterField => renderFilterField?.(filterField) ?? null,
        )}
        <Link className="ml-auto flex items-center" to="/search" {...linkProps}>
          {link}
        </Link>
      </li>
      {resultItems.map(renderResultItem)}
    </ul>
  );
}

/**
 * Props for {@link SearchResultGroup}.
 * @public
 */
export type SearchResultGroupProps<FilterOption> = Pick<
  SearchResultStateProps,
  'query'
> &
  Omit<
    SearchResultGroupLayoutProps<FilterOption>,
    'loading' | 'error' | 'resultItems' | 'filterFields'
  >;

/**
 * Given a query, search for results and render them as a group.
 * @param props - See {@link SearchResultGroupProps}.
 * @public
 */
export function SearchResultGroup<FilterOption>(
  props: SearchResultGroupProps<FilterOption>,
) {
  const { query, children, renderResultItem, linkProps = {}, ...rest } = props;

  const defaultRenderResultItem = useSearchResultListItemExtensions(children);

  return (
    <AnalyticsContext
      attributes={{
        pluginId: 'search',
        extension: 'SearchResultGroup',
      }}
    >
      <SearchResultState query={query}>
        {(
          { loading, error, value },
          { term, types, pageCursor, filters = {} },
        ) => {
          const to = `/search?${qs.stringify(
            { term, types, filters, pageCursor, query: term },
            { arrayFormat: 'brackets' },
          )}`;

          return (
            <SearchResultGroupLayout
              {...rest}
              error={error}
              loading={loading}
              linkProps={{ to, ...linkProps }}
              filterFields={Object.keys(filters)}
              resultItems={value?.results}
              renderResultItem={renderResultItem ?? defaultRenderResultItem}
            />
          );
        }}
      </SearchResultState>
    </AnalyticsContext>
  );
}
