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

import React, {
  ChangeEvent,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import qs from 'qs';

import {
  makeStyles,
  Theme,
  List,
  ListProps,
  ListSubheader,
  Menu,
  MenuItem,
  InputBase,
  Select,
  Chip,
  Typography,
  TypographyProps,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowRightIcon from '@material-ui/icons/ArrowForwardIos';

import { JsonValue } from '@backstage/types';
import {
  Link,
  LinkProps,
  Progress,
  EmptyState,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { AnalyticsContext } from '@backstage/core-plugin-api';
import { SearchResult } from '@backstage/plugin-search-common';

import { useSearchResultListItemExtensions } from '../../extensions';

import { DefaultResultListItem } from '../DefaultResultListItem';
import { SearchResultState, SearchResultStateProps } from '../SearchResult';

const useStyles = makeStyles((theme: Theme) => ({
  listSubheader: {
    display: 'flex',
    alignItems: 'center',
  },
  listSubheaderName: {
    marginLeft: theme.spacing(1),
    textTransform: 'uppercase',
  },
  listSubheaderChip: {
    color: theme.palette.text.secondary,
    margin: theme.spacing(0, 0, 0, 1.5),
  },
  listSubheaderFilter: {
    display: 'flex',
    color: theme.palette.text.secondary,
    margin: theme.spacing(0, 0, 0, 1.5),
  },
  listSubheaderLink: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  listSubheaderLinkIcon: {
    fontSize: 'inherit',
    marginLeft: theme.spacing(0.5),
  },
}));

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
  const classes = useStyles();
  const { label, children, ...rest } = props;

  return (
    <Chip
      {...rest}
      className={classes.listSubheaderFilter}
      variant="outlined"
      label={
        <>
          {label}: {children}
        </>
      }
    />
  );
};

const NullIcon = () => null;

/**
 * Common props for a result group filter field.
 * @public
 */
export type SearchResultGroupFilterFieldPropsWith<T> = T &
  SearchResultGroupFilterFieldLayoutProps & {
    onChange: (value: JsonValue) => void;
  };

const useSearchResultGroupTextFilterStyles = makeStyles((theme: Theme) => ({
  root: {
    fontSize: 'inherit',
    '&:focus': {
      outline: 'none',
      background: theme.palette.common.white,
    },
    '&:not(:focus)': {
      cursor: 'pointer',
      color: theme.palette.primary.main,
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}));

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
  const classes = useSearchResultGroupTextFilterStyles();
  const { label, value = 'None', onChange, onDelete } = props;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <SearchResultGroupFilterFieldLayout label={label} onDelete={onDelete}>
      <Typography
        role="textbox"
        component="span"
        className={classes.root}
        onChange={handleChange}
        contentEditable
        suppressContentEditableWarning
      >
        {value}
      </Typography>
    </SearchResultGroupFilterFieldLayout>
  );
};

const useSearchResultGroupSelectFilterStyles = makeStyles((theme: Theme) => ({
  root: {
    fontSize: 'inherit',
    '&:not(:focus)': {
      cursor: 'pointer',
      color: theme.palette.primary.main,
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    '&:focus': {
      outline: 'none',
    },
    '&>div:first-child': {
      padding: 0,
    },
  },
}));

/**
 * Props for {@link SearchResultGroupTextFilterField}.
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
 *   <MenuItem value="experimental">Experimental</MenuItem>
 *   <MenuItem value="production">Production</MenuItem>
 *  </SearchResultGroupSelectFilterField>
 * ```
 * @public
 */
export const SearchResultGroupSelectFilterField = (
  props: SearchResultGroupSelectFilterFieldProps,
) => {
  const classes = useSearchResultGroupSelectFilterStyles();
  const { label, value = 'none', onChange, onDelete, children } = props;

  const handleChange = useCallback(
    (e: ChangeEvent<{ value: unknown }>) => {
      onChange(e.target.value as JsonValue);
    },
    [onChange],
  );

  return (
    <SearchResultGroupFilterFieldLayout label={label} onDelete={onDelete}>
      <Select
        className={classes.root}
        value={value}
        onChange={handleChange}
        input={<InputBase />}
        IconComponent={NullIcon}
      >
        <MenuItem value="none">None</MenuItem>
        {children}
      </Select>
    </SearchResultGroupFilterFieldLayout>
  );
};

/**
 * Props for {@link SearchResultGroupLayout}
 * @public
 */
export type SearchResultGroupLayoutProps<FilterOption> = ListProps & {
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
  titleProps?: Partial<TypographyProps>;
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
   * @remarks Defaults to a menu item where its value and label bounds to the option string.
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
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    error,
    loading,
    icon,
    title,
    titleProps = {},
    link = (
      <>
        See all
        <ArrowRightIcon className={classes.listSubheaderLinkIcon} />
      </>
    ),
    linkProps = {},
    filterOptions,
    renderFilterOption = filterOption => (
      <MenuItem key={String(filterOption)} value={String(filterOption)}>
        {filterOption}
      </MenuItem>
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
      <EmptyState missing="data" title="Sorry, no results were found" />
    ),
    ...rest
  } = props;

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

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
    <List {...rest}>
      <ListSubheader className={classes.listSubheader}>
        {icon}
        <Typography
          className={classes.listSubheaderName}
          component="strong"
          {...titleProps}
        >
          {title}
        </Typography>
        {filterOptions ? (
          <Chip
            className={classes.listSubheaderChip}
            component="button"
            icon={<AddIcon />}
            variant="outlined"
            label="Add filter"
            aria-controls="filters-menu"
            aria-haspopup="true"
            onClick={handleClick}
          />
        ) : null}
        {filterOptions ? (
          <Menu
            id="filters-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            keepMounted
          >
            {filterOptions.map(renderFilterOption)}
          </Menu>
        ) : null}
        {filterFields?.map(
          filterField => renderFilterField?.(filterField) ?? null,
        )}
        <Link className={classes.listSubheaderLink} to="/search" {...linkProps}>
          {link}
        </Link>
      </ListSubheader>
      {resultItems.map(renderResultItem)}
    </List>
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
