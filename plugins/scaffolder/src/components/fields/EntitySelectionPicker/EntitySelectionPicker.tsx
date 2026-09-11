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
import { parseEntityRef } from '@backstage/catalog-model';
import { EntityRefPresentationSnapshot } from '@backstage/plugin-catalog-react';
import {
  Badge,
  Button,
  ButtonIcon,
  Link,
  List,
  ListRow,
  Popover,
  SearchField,
  Text as BuiText,
} from '@backstage/ui';
import { RiSettings3Line, RiCloseLine, RiLoader4Line } from '@remixicon/react';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  Heading,
  VisuallyHidden,
} from 'react-aria-components';
import { useEntitySelectionOptions } from './useEntitySelectionOptions';
import { entityRefCandidates } from './entityRefCandidates';
import { LoadingSentinel } from './LoadingSentinel';
import { useStableSelectionRows } from './useStableSelectionRows';
import {
  EntitySelectionOption,
  referenceLabel,
} from './entitySelectionOptions';
import classes from './EntitySelectionPicker.module.css';

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
};

/** Experimental selection-first picker; deliberately not part of the public API. */
export function EntitySelectionPicker(props: EntitySelectionPickerProps) {
  const {
    label,
    onChange,
    multiple = false,
    allowMissingEntities = false,
    disabled = false,
  } = props;
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const focusSearch = (preventScroll = false) =>
    searchRef.current?.querySelector('input')?.focus({ preventScroll });
  const dialogRef = useRef<HTMLDivElement>(null);
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
  const options = useEntitySelectionOptions({
    enabled: open && !disabled,
    catalogFilter: props.catalogFilter,
    defaultKind: props.defaultKind,
    defaultNamespace: props.defaultNamespace,
    allowMissingEntities,
    selectedEntityRefs,
  });
  const candidateRefs = entityRefCandidates(options.searchText, props);
  const selectionSnapshots = useRef(new Map<string, EntitySelectionOption>());
  const selections = value.map(
    ref =>
      options.selectedOptions.find(row => row.ref === ref) ??
      options.snapshot.rows.find(row => row.ref === ref) ??
      selectionSnapshots.current.get(ref) ?? {
        ref,
        label: referenceLabel(ref),
        missing: true,
      },
  );
  useEffect(() => {
    // Keep snapshots only for the selected set, not an unbounded search cache.
    selectionSnapshots.current = new Map(
      selections.map(item => [item.ref, item]),
    );
  });
  const stableRows = useStableSelectionRows({
    snapshot: options.snapshot,
    selections,
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
  const refreshing = options.loadingState === 'loading';

  return (
    <div className={classes.root} role="group" aria-label={label}>
      <DialogTrigger isOpen={open} onOpenChange={setIsOpen}>
        <Button
          variant="tertiary"
          size="small"
          className={classes.trigger}
          iconEnd={<RiSettings3Line aria-hidden="true" />}
          isDisabled={disabled}
          aria-label={label}
        >
          {label}
        </Button>
        <Popover className={classes.popover} placement="bottom start" hideArrow>
          <Dialog ref={dialogRef} className={classes.dialog}>
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
              <>
                <div
                  onKeyDownCapture={event => {
                    if (event.nativeEvent.isComposing) return;
                    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')
                      return;
                    // Interactive rows take actual focus so their remove
                    // buttons remain reachable, rather than virtual focus.
                    const enabledRows =
                      dialogRef.current?.querySelectorAll<HTMLElement>(
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
                >
                  <SearchField
                    value={options.searchText}
                    onChange={options.setSearchText}
                    ref={searchRef}
                    className={classes.search}
                    aria-label={`Search ${label}`}
                    placeholder="Filter by name or entity reference"
                    icon={
                      refreshing ? (
                        <RiLoader4Line className={classes.spinner} />
                      ) : undefined
                    }
                    // Focus belongs in the search field when its dialog opens.
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                  />
                </div>
                <List
                  className={classes.list}
                  aria-label={label}
                  // Keep the list as React Aria's keyboard scroll root,
                  // with the sentinel outside its selectable collection.
                  render={listProps => (
                    <div {...listProps} aria-busy={refreshing}>
                      {listProps.children}
                      <LoadingSentinel
                        hasMore={
                          options.hasMore && !disabled && !options.loading
                        }
                        loading={options.loadingState === 'loadingMore'}
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
                    if (multiple || !next.length) focusSearch(true);
                    else setIsOpen(false);
                  }}
                  renderEmptyState={() => {
                    if (options.loading || options.loadingState === 'error')
                      return null;
                    return (
                      <div className={classes.empty}>No matching entities</div>
                    );
                  }}
                >
                  {row => (
                    <ListRow
                      id={row.ref}
                      textValue={`${row.label} ${row.ref}`}
                      description={`${row.ref}${
                        row.missing
                          ? ' · Not found in catalog — reference only'
                          : ''
                      }`}
                      customActions={
                        value.includes(row.ref) && (
                          <ButtonIcon
                            variant="tertiary"
                            size="small"
                            icon={<RiCloseLine aria-hidden="true" />}
                            isDisabled={disabled}
                            aria-label={`Remove ${row.label}`}
                            onPress={() => {
                              onChange(value.filter(ref => ref !== row.ref));
                              focusSearch(true);
                            }}
                          />
                        )
                      }
                    >
                      {row.presentation && !row.missing ? (
                        <EntityPresentation presentation={row.presentation} />
                      ) : (
                        row.label
                      )}
                    </ListRow>
                  )}
                </List>
                {(options.loadingState === 'error' ||
                  options.loadMoreError) && (
                  <div role="status" className={classes.retry}>
                    <Button
                      variant="tertiary"
                      size="small"
                      onPress={() => {
                        focusSearch();
                        if (options.loadingState === 'error') options.retry();
                        else options.loadMore();
                      }}
                    >
                      Couldn't load results. Retry
                    </Button>
                  </div>
                )}
              </>
              <VisuallyHidden role="status">
                {options.loading && 'Loading catalog results…'}
              </VisuallyHidden>
              <div role="status" className={classes.status}>
                {allowMissingEntities &&
                  options.searchText &&
                  !candidateRefs.length &&
                  ' Enter a valid name and a kind, for example user:default/freben.'}
              </div>
              <div className={classes.footer}>
                <Button
                  variant="tertiary"
                  size="small"
                  isDisabled={disabled || value.length === 0}
                  onPress={() => {
                    onChange([]);
                    focusSearch();
                  }}
                >
                  Clear selection
                </Button>
                <Button
                  variant="tertiary"
                  size="small"
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
              item.presentation && !item.missing ? (
                <EntityPresentation presentation={item.presentation} />
              ) : (
                item.label
              );
            const content = props.renderItem ? (
              props.renderItem(item)
            ) : (
              <Badge size="small" className={classes.badge}>
                {defaultContent}
              </Badge>
            );
            return (
              <li key={item.ref} className={classes.item}>
                {href ? <Link href={href}>{content}</Link> : content}
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

/** Keep app-provided presentation, without depending on the MUI display component. */
function EntityPresentation({
  presentation,
}: {
  presentation: EntityRefPresentationSnapshot;
}) {
  const { primaryTitle, secondaryTitle, Icon } = presentation;
  return (
    <BuiText className={classes.presentation} title={secondaryTitle}>
      {Icon && <Icon fontSize="inherit" />}
      {primaryTitle}
    </BuiText>
  );
}
