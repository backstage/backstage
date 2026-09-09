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
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTrigger,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
  SearchField,
  Text,
} from 'react-aria-components';
import { useEntityPickerOptions } from '../useEntityPickerOptions';
import { entityRefCandidates } from './entityRefCandidates';
import {
  EntitySelectionOption,
  referenceLabel,
  useEntityRefCandidates,
} from './useEntityRefCandidates';

export type EntitySelectionPickerProps = {
  label: string;
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
  tokens: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  token: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.action.selected,
    maxWidth: '100%',
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
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 6,
    padding: '8px 12px',
    font: 'inherit',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
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
    gap: 2,
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
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
  const triggerRef = useRef<HTMLButtonElement>(null);
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
  const selectionLabels = useRef(new Map<string, string>());
  const rows = useMemo(() => {
    const result = new Map<string, EntitySelectionOption>();
    for (const entity of options.entities) {
      const ref = stringifyEntityRef(entity);
      result.set(ref, {
        ref,
        label:
          options.entityRefToPresentation.get(ref)?.primaryTitle ||
          referenceLabel(ref),
      });
    }
    for (const candidate of candidates.options)
      if (!result.has(candidate.ref)) result.set(candidate.ref, candidate);
    return Array.from(result.values());
  }, [options.entities, options.entityRefToPresentation, candidates.options]);
  const selections = value.map(ref => ({
    ref,
    label:
      options.entityRefToPresentation.get(ref)?.primaryTitle ||
      rows.find(row => row.ref === ref)?.label ||
      selectionLabels.current.get(ref) ||
      referenceLabel(ref),
  }));
  useEffect(() => {
    // Keep snapshots only for the selected set, not an unbounded search cache.
    selectionLabels.current = new Map(
      selections.map(item => [item.ref, item.label]),
    );
  });
  const setIsOpen = (next: boolean) => {
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
  const disabledKeys = rows
    .filter(row => atMax && !value.includes(row.ref))
    .map(row => row.ref);

  return (
    <div className={classes.root} role="group" aria-label={label}>
      <div>{label}</div>
      <div className={classes.tokens}>
        {selections.map(item => (
          <div key={item.ref} className={classes.token}>
            <Button
              className={classes.button}
              isDisabled={disabled}
              aria-label={`Change ${item.label}`}
              aria-haspopup="dialog"
              aria-expanded={open}
              onPress={() => setIsOpen(true)}
            >
              {item.label}
            </Button>
            <Button
              className={classes.button}
              isDisabled={disabled}
              aria-label={`Remove ${item.label}`}
              onPress={() => {
                onChange(value.filter(ref => ref !== item.ref));
                triggerRef.current?.focus();
              }}
            >
              ×
            </Button>
          </div>
        ))}
        <DialogTrigger isOpen={open} onOpenChange={setIsOpen}>
          <Button
            ref={triggerRef}
            className={classes.trigger}
            isDisabled={disabled}
            aria-label={`Choose ${label}`}
          >
            {value.length ? 'Change selection' : 'Choose…'} ▾
          </Button>
          <Popover
            className={classes.popover}
            placement="bottom start"
            data-theme={props.theme}
          >
            <Dialog className={classes.dialog} aria-label={`Choose ${label}`}>
              <div
                onKeyDownCapture={event => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsOpen(false);
                  }
                }}
              >
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
                      className={classes.input}
                      placeholder="Search names, or enter an entity reference"
                    />
                    <Button
                      className={classes.button}
                      aria-label="Clear search"
                    >
                      ×
                    </Button>
                  </SearchField>
                  <ListBox
                    className={classes.list}
                    aria-label={label}
                    items={rows}
                    selectionMode={multiple ? 'multiple' : 'single'}
                    selectedKeys={new Set(value)}
                    disabledKeys={disabledKeys}
                    onSelectionChange={keys => {
                      if (keys === 'all' || disabled) return;
                      if (multiple) {
                        // Update visible options while retaining selections outside the current results.
                        const next = value.filter(
                          ref =>
                            !rows.some(row => row.ref === ref) || keys.has(ref),
                        );
                        for (const row of rows)
                          if (keys.has(row.ref) && !next.includes(row.ref))
                            next.push(row.ref);
                        if (
                          props.maxItems !== undefined &&
                          next.length > props.maxItems &&
                          next.length > value.length
                        )
                          return;
                        onChange(next);
                      } else {
                        // Toggling the selected row accepts the existing value;
                        // clearing a selection is the chip's explicit action.
                        const next =
                          rows.find(row => keys.has(row.ref)) ??
                          rows.find(row => value.includes(row.ref));
                        if (next) {
                          onChange([next.ref]);
                          setIsOpen(false);
                        }
                      }
                    }}
                    onScroll={event => {
                      const node = event.currentTarget;
                      if (
                        node.scrollHeight - node.clientHeight - node.scrollTop <
                          80 &&
                        !options.loadMoreError
                      )
                        options.loadMore();
                    }}
                    renderEmptyState={() =>
                      options.loading ? 'Searching…' : 'No matching entities'
                    }
                  >
                    {row => (
                      <ListBoxItem
                        id={row.ref}
                        textValue={`${row.label} ${row.ref}`}
                        className={classes.option}
                      >
                        {({ isSelected }) => (
                          <>
                            <div aria-hidden="true">
                              {isSelected ? '✓' : '○'}
                            </div>
                            <div className={classes.optionText}>
                              <Text slot="label">{row.label}</Text>
                              <Text
                                slot="description"
                                className={classes.detail}
                              >
                                {row.ref}
                                {row.missing
                                  ? ' · Not found in catalog — reference only'
                                  : ''}
                              </Text>
                            </div>
                          </>
                        )}
                      </ListBoxItem>
                    )}
                  </ListBox>
                </Autocomplete>
                <div role="status" className={classes.status}>
                  {options.loading && 'Loading catalog results…'}
                  {candidates.loading && ' Checking reference…'}
                  {candidates.error &&
                    ' Could not check the reference. Try searching again.'}
                  {options.loadingState === 'error' &&
                    ' Could not load catalog results.'}
                  {options.loadMoreError &&
                    ' Could not load the next page. You can retry below.'}
                  {allowMissingEntities &&
                    options.searchText &&
                    !candidateRefs.length &&
                    ' Enter a valid name and a kind, for example user:default/freben.'}
                </div>
                <div className={classes.footer}>
                  {options.loadingState === 'error' ? (
                    <Button className={classes.button} onPress={options.retry}>
                      Retry
                    </Button>
                  ) : (
                    options.hasMore && (
                      <Button
                        className={classes.button}
                        isDisabled={options.loading}
                        onPress={options.loadMore}
                      >
                        {options.loadMoreError
                          ? 'Retry loading more'
                          : 'Load more'}
                      </Button>
                    )
                  )}
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
      </div>
    </div>
  );
}
