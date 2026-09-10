/*
 * Copyright 2026 The Backstage Authors
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

import { EntityFilterQuery } from '@backstage/catalog-client';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from '@backstage/core-components';
import { EntityDisplayName } from '@backstage/plugin-catalog-react';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  GridList,
  GridListItem,
  Popover,
  SearchField,
  Text,
  VisuallyHidden,
} from 'react-aria-components';
import { useEntityPickerOptions } from '../useEntityPickerOptions';
import { entityRefCandidates } from './entityRefCandidates';
import { LoadingSentinel } from './LoadingSentinel';
import { useStableSelectionRows } from './useStableSelectionRows';
import {
  EntitySelectionOption,
  referenceLabel,
  useEntityRefCandidates,
} from './useEntityRefCandidates';

export type EntitySelectionPickerProps = {
  label: string;
  popupTitle: string;
  /** Non-interactive content; links and selection controls are owned by the picker. */
  renderItem?: (item: EntitySelectionOption) => ReactNode;
  itemLayout?: 'list' | 'inline';
  /** Supplied by the caller, so destinations respect the surrounding app's routes. */
  getItemHref?: (ref: string) => string | undefined;
  value: string[];
  onChange: (value: string[]) => void;
  catalogFilter?: EntityFilterQuery;
  defaultKind?: string;
  defaultNamespace?: string;
  multiple?: boolean;
  allowMissingEntities?: boolean;
  disabled?: boolean;
  maxItems?: number;
  theme?: 'mui' | 'bui';
};

const useStyles = makeStyles(theme => ({
  root: { ...theme.typography.body1, display: 'grid', gap: 8 },
  items: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    '&[data-layout=list]': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  item: { maxWidth: '100%', overflowWrap: 'anywhere' },
  heading: {
    ...theme.typography.subtitle1,
    fontWeight: 600,
    margin: '0 0 12px',
  },
  button: {
    font: 'inherit',
    color: 'inherit',
    cursor: 'pointer',
    background: 'transparent',
    border: 0,
    borderRadius: 4,
    padding: '8px 12px',
    '&[data-focus-visible]': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
    '&[data-disabled]': { opacity: 0.5, cursor: 'default' },
  },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
    border: 0,
    borderRadius: 4,
    padding: '4px 0',
    textAlign: 'left',
    font: 'inherit',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    fontWeight: 600,
    '&:hover': { color: theme.palette.primary.main },
    '&[data-disabled]': { opacity: 0.5, cursor: 'default' },
    '&[data-focus-visible]': {
      outline: `2px solid ${theme.palette.primary.main}`,
    },
  },
  popover: {
    ...theme.typography.body1,
    zIndex: theme.zIndex.modal + 1,
    borderRadius: 8,
    boxShadow: theme.shadows[8],
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    width: 420,
    maxWidth: 'calc(100vw - 32px)',
    '&[data-theme=bui]': {
      background: 'var(--bui-bg-popover, white)',
      color: 'var(--bui-fg-primary)',
      borderColor: 'var(--bui-border-1)',
    },
  },
  dialog: { outline: 'none', padding: 12 },
  search: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 6,
    '&:focus-within': { outline: `2px solid ${theme.palette.primary.main}` },
  },
  input: {
    font: 'inherit',
    background: 'transparent',
    color: 'inherit',
    border: 0,
    outline: 'none',
    padding: '10px 12px',
    width: '100%',
    minWidth: 0,
    '&::-webkit-search-cancel-button': { display: 'none' },
  },
  list: { maxHeight: 320, overflowY: 'auto', outline: 'none' },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: 4,
    padding: '10px 8px',
    cursor: 'pointer',
    outline: 'none',
    '&[data-focused]': {
      background: theme.palette.action.hover,
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },
    '&[data-selected]': { background: theme.palette.action.selected },
    '&[data-disabled]': { opacity: 0.45, cursor: 'default' },
  },
  optionText: {
    display: 'grid',
    flex: 1,
    gap: 2,
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  check: { width: 20, flexShrink: 0, textAlign: 'center' },
  remove: { width: 36, flexShrink: 0 },
  detail: { fontSize: '0.8em', opacity: 0.7 },
  status: { fontSize: '0.85em', margin: '8px 0', opacity: 0.8 },
  footer: { display: 'flex', justifyContent: 'space-between', marginTop: 8 },
}));

/** Experimental selection-first picker; deliberately not part of the public API. */
export function EntitySelectionPicker(props: EntitySelectionPickerProps) {
  const {
    label,
    onChange,
    multiple = false,
    allowMissingEntities = false,
    disabled = false,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const value = useMemo(
    () =>
      Array.from(
        new Set(
          props.value.map(ref => {
            return (
              entityRefCandidates(ref, {
                defaultKind: props.defaultKind,
                defaultNamespace: props.defaultNamespace,
              })[0] ?? ref
            );
          }),
        ),
      ),
    [props.value, props.defaultKind, props.defaultNamespace],
  );
  const selectedEntityRefs = useMemo(
    () =>
      value.filter(ref => {
        try {
          parseEntityRef(ref);
          return true;
        } catch {
          return false;
        }
      }),
    [value],
  );
  const options = useEntityPickerOptions({
    catalogFilter: props.catalogFilter,
    selectedEntityRefs,
  });
  const candidateRefs = entityRefCandidates(options.searchText, props);
  const candidates = useEntityRefCandidates(
    candidateRefs,
    open && allowMissingEntities,
  );
  const selectionSnapshots = useRef(new Map<string, EntitySelectionOption>());
  const rows = useMemo(() => {
    const result = new Map<string, EntitySelectionOption>();
    for (const entity of options.entities) {
      const ref = stringifyEntityRef(entity);
      result.set(ref, {
        ref,
        entity,
        label:
          options.entityRefToPresentation.get(ref)?.primaryTitle ||
          referenceLabel(ref),
      });
    }
    for (const candidate of candidates.options)
      if (!result.has(candidate.ref)) result.set(candidate.ref, candidate);
    return Array.from(result.values());
  }, [options.entities, options.entityRefToPresentation, candidates.options]);
  const entitiesByRef = useMemo(
    () =>
      new Map(
        [...options.entities, ...options.selectedEntities].map(entity => [
          stringifyEntityRef(entity),
          entity,
        ]),
      ),
    [options.entities, options.selectedEntities],
  );
  const selections = value.map(ref => ({
    ref,
    entity:
      entitiesByRef.get(ref) ??
      rows.find(row => row.ref === ref)?.entity ??
      selectionSnapshots.current.get(ref)?.entity,
    label:
      options.entityRefToPresentation.get(ref)?.primaryTitle ||
      rows.find(row => row.ref === ref)?.label ||
      selectionSnapshots.current.get(ref)?.label ||
      referenceLabel(ref),
    missing: options.resolvedSelectedEntityRefs.includes(ref)
      ? !options.selectedEntities.some(
          entity => stringifyEntityRef(entity) === ref,
        )
      : selectionSnapshots.current.get(ref)?.missing ??
        !rows.some(row => row.ref === ref && !row.missing),
  }));
  useEffect(() => {
    // Keep snapshots only for the selected set, not an unbounded search cache.
    selectionSnapshots.current = new Map(
      selections.map(item => [item.ref, item]),
    );
  });
  const stableRows = useStableSelectionRows({
    rows,
    selections,
    search: options.searchText,
    open,
  });
  const setIsOpen = (next: boolean) => {
    if (next && !open && !disabled) stableRows.beginSession();
    setOpen(next && !disabled);
    if (!next) options.setSearchText('');
    if (next && options.loadingState === 'error') options.retry();
  };
  const { setSearchText } = options;
  useEffect(() => {
    if (disabled) {
      setOpen(false);
      setSearchText('');
    }
  }, [disabled, setSearchText]);
  const atMax =
    multiple && props.maxItems !== undefined && value.length >= props.maxItems;
  const disabledKeys = stableRows.items
    .filter(row => disabled || (atMax && !value.includes(row.ref)))
    .map(row => row.ref);

  return (
    <div className={classes.root} role="group" aria-label={label}>
      <DialogTrigger isOpen={open} onOpenChange={setIsOpen}>
        <Button
          className={classes.trigger}
          isDisabled={disabled}
          aria-label={label}
        >
          {label}
          <SettingsIcon fontSize="small" />
        </Button>
        <Popover
          className={classes.popover}
          placement="bottom start"
          data-theme={props.theme}
        >
          <Dialog className={classes.dialog}>
            <div
              onKeyDownCapture={event => {
                if (event.key === 'Escape') {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsOpen(false);
                }
              }}
            >
              <Heading slot="title" className={classes.heading}>
                {props.popupTitle}
              </Heading>
              <Autocomplete
                inputValue={options.searchText}
                onInputChange={options.setSearchText}
              >
                <SearchField
                  className={classes.search}
                  aria-label={`Search ${label}`}
                  // Focus belongs in the search field when its dialog opens.
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                >
                  <Input
                    ref={searchRef}
                    className={classes.input}
                    placeholder="Filter by name or entity reference"
                    onKeyDown={event => {
                      if (event.nativeEvent.isComposing) return;
                      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')
                        return;
                      // Interactive rows take actual focus so their remove
                      // buttons remain reachable, rather than virtual focus.
                      const enabledRows =
                        listRef.current?.querySelectorAll<HTMLElement>(
                          '[role="row"][tabindex]:not([aria-disabled="true"])',
                        );
                      const target =
                        event.key === 'ArrowDown'
                          ? enabledRows?.[0]
                          : enabledRows?.[enabledRows.length - 1];
                      if (target) {
                        event.preventDefault();
                        target.focus();
                      }
                    }}
                  />
                  <Button className={classes.button} aria-label="Clear search">
                    ×
                  </Button>
                </SearchField>
                <GridList
                  ref={listRef}
                  className={classes.list}
                  aria-label={label}
                  // Keep the list as React Aria's keyboard scroll root,
                  // with the sentinel outside its selectable collection.
                  render={listProps => (
                    <div {...listProps}>
                      {listProps.children}
                      <LoadingSentinel
                        hasMore={options.hasMore && !disabled}
                        loading={options.loading}
                        error={
                          options.loadingState === 'error' ||
                          options.loadMoreError
                        }
                        onLoadMore={options.loadMore}
                      />
                    </div>
                  )}
                  items={stableRows.items}
                  dependencies={[classes, disabled, onChange, value]}
                  selectionMode={multiple ? 'multiple' : 'single'}
                  selectedKeys={value}
                  disabledKeys={disabledKeys}
                  onSelectionChange={keys => {
                    if (keys === 'all' || disabled) return;
                    const visibleRefs = new Set(
                      stableRows.items.map(row => row.ref),
                    );
                    const added = stableRows.items
                      .filter(
                        row => keys.has(row.ref) && !value.includes(row.ref),
                      )
                      .map(row => row.ref);
                    const next = multiple
                      ? [
                          ...value.filter(
                            ref => !visibleRefs.has(ref) || keys.has(ref),
                          ),
                          ...added,
                        ]
                      : Array.from(keys, String);
                    if (
                      multiple &&
                      added.length > 0 &&
                      props.maxItems !== undefined &&
                      next.length > props.maxItems
                    )
                      return;
                    onChange(next);
                    if (multiple || !next.length)
                      searchRef.current?.focus({ preventScroll: true });
                    else setIsOpen(false);
                  }}
                  renderEmptyState={() => {
                    if (options.loading || options.loadingState === 'error')
                      return null;
                    return 'No matching entities';
                  }}
                >
                  {row => (
                    <GridListItem
                      id={row.ref}
                      textValue={`${row.label} ${row.ref}`}
                      className={classes.option}
                    >
                      {({ isSelected }) => (
                        <>
                          <div className={classes.check} aria-hidden="true">
                            {isSelected ? '✓' : null}
                          </div>
                          <div className={classes.optionText}>
                            <Text>
                              {row.entity && !row.missing ? (
                                <EntityDisplayName entityRef={row.entity} />
                              ) : (
                                row.label
                              )}
                            </Text>
                            <Text slot="description" className={classes.detail}>
                              {row.ref}
                              {row.missing
                                ? ' · Not found in catalog — reference only'
                                : ''}
                            </Text>
                          </div>
                          <div className={classes.remove}>
                            {isSelected && (
                              <Button
                                className={classes.button}
                                isDisabled={disabled}
                                aria-label={`Remove ${row.label}`}
                                onPress={() => {
                                  onChange(
                                    value.filter(ref => ref !== row.ref),
                                  );
                                  searchRef.current?.focus({
                                    preventScroll: true,
                                  });
                                }}
                              >
                                ×
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </GridListItem>
                  )}
                </GridList>
                {(options.loadingState === 'error' ||
                  options.loadMoreError) && (
                  <div role="status">
                    <Button
                      className={classes.button}
                      onPress={() => {
                        searchRef.current?.focus();
                        if (options.loadingState === 'error') options.retry();
                        else options.loadMore();
                      }}
                    >
                      Couldn't load results. Retry
                    </Button>
                  </div>
                )}
              </Autocomplete>
              <VisuallyHidden role="status">
                {options.loading && 'Loading catalog results…'}
                {candidates.loading && ' Checking reference…'}
              </VisuallyHidden>
              <div role="status" className={classes.status}>
                {candidates.error &&
                  ' Could not check the reference. Try searching again.'}
                {allowMissingEntities &&
                  options.searchText &&
                  !candidateRefs.length &&
                  ' Enter a valid name and a kind, for example user:default/freben.'}
              </div>
              <div className={classes.footer}>
                <Button
                  className={classes.button}
                  isDisabled={disabled || value.length === 0}
                  onPress={() => {
                    onChange([]);
                    searchRef.current?.focus();
                  }}
                >
                  Clear selection
                </Button>
                <Button
                  className={classes.button}
                  onPress={() => setIsOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </Dialog>
        </Popover>
      </DialogTrigger>
      {selections.length ? (
        <ul
          className={classes.items}
          data-layout={props.itemLayout ?? 'inline'}
          aria-label={`Current ${label}`}
        >
          {selections.map(item => {
            const href = item.missing
              ? undefined
              : props.getItemHref?.(item.ref);
            const defaultContent =
              item.entity && !item.missing ? (
                <EntityDisplayName entityRef={item.entity} />
              ) : (
                item.label
              );
            const content = props.renderItem
              ? props.renderItem(item)
              : defaultContent;
            return (
              <li key={item.ref} className={classes.item}>
                {href ? <Link to={href}>{content}</Link> : content}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={classes.detail}>None selected</div>
      )}
    </div>
  );
}
