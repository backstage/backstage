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

import { Children, useRef } from 'react';
import { useInteractOutside } from 'react-aria';
import {
  Autocomplete,
  SearchField as RASearchField,
  Input,
  Button as RAButton,
  Popover as RAPopover,
  ListBox,
  ListBoxItem,
  OverlayTriggerStateContext,
} from 'react-aria-components';
import { useOverlayTriggerState } from 'react-stately';
import { RiSearch2Line, RiCloseCircleLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import {
  SearchAutocompleteDefinition,
  SearchAutocompleteItemDefinition,
} from './definition';
import { Box } from '../Box';
import { BgReset } from '../../hooks/useBg';
import { VisuallyHidden } from '../VisuallyHidden';

import type {
  SearchAutocompleteProps,
  SearchAutocompleteItemProps,
} from './types';

const SearchAutocompleteEmptyState = () => {
  const { ownProps } = useDefinition(SearchAutocompleteDefinition, {});
  return <div className={ownProps.classes.emptyState}>No results found.</div>;
};

/**
 * A search input that shows a dropdown list of suggestions as the user types, with loading and empty states.
 *
 * @public
 */
export function SearchAutocomplete(props: SearchAutocompleteProps) {
  const { ownProps, dataAttributes } = useDefinition(
    SearchAutocompleteDefinition,
    props,
  );
  const {
    classes,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    inputValue,
    onInputChange,
    placeholder,
    popoverWidth,
    popoverPlacement = 'bottom start',
    children,
    isLoading,
    defaultOpen,
    style,
  } = ownProps;

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLElement | null>(null);
  const hasValue = !!inputValue;
  const hasChildren = Children.count(children) > 0;

  let liveMessage = '';
  if (isLoading) {
    liveMessage = 'Searching';
  } else if (hasValue && !hasChildren) {
    liveMessage = 'No results found';
  }
  const overlayState = useOverlayTriggerState({ defaultOpen });

  // Close on interact outside — same pattern as ComboBox.
  // isNonModal disables useOverlay's built-in useInteractOutside,
  // so we add our own that filters out clicks on the trigger.
  useInteractOutside({
    ref: popoverRef,
    onInteractOutside: e => {
      const target = e.target as Element;
      if (triggerRef.current?.contains(target)) {
        return;
      }
      overlayState.close();
    },
    isDisabled: !overlayState.isOpen,
  });

  return (
    <OverlayTriggerStateContext.Provider value={overlayState}>
      <Autocomplete
        inputValue={inputValue}
        onInputChange={value => {
          onInputChange?.(value);
          if (value) {
            overlayState.open();
          } else {
            overlayState.close();
          }
        }}
      >
        <RASearchField
          className={classes.searchField}
          aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : placeholder)}
          aria-labelledby={ariaLabelledBy}
          data-size={dataAttributes['data-size']}
          onKeyDown={e => {
            if (e.key === 'Enter' && !overlayState.isOpen && hasValue) {
              e.preventDefault();
              overlayState.open();
            }
          }}
        >
          <div
            ref={triggerRef}
            className={classes.root}
            {...dataAttributes}
            style={style}
          >
            <div aria-hidden="true">
              <RiSearch2Line />
            </div>
            <Input
              className={classes.searchFieldInput}
              placeholder={placeholder}
            />
            <RAButton
              className={classes.searchFieldClear}
              style={{ visibility: hasValue ? 'visible' : 'hidden' }}
            >
              <RiCloseCircleLine />
            </RAButton>
          </div>
        </RASearchField>
        {/* isNonModal keeps the page interactive while the popover is open,
            required for virtual focus (aria-activedescendant) to work correctly */}
        <RAPopover
          ref={popoverRef}
          className={classes.popover}
          triggerRef={triggerRef}
          isNonModal
          placement={popoverPlacement}
          {...(popoverWidth ? { style: { width: popoverWidth } } : {})}
        >
          <BgReset>
            <Box bg="neutral" className={classes.inner}>
              <ListBox
                className={classes.listBox}
                autoFocus="first"
                shouldFocusOnHover
                aria-busy={isLoading || undefined}
                data-stale={isLoading || undefined}
                renderEmptyState={() =>
                  isLoading ? (
                    <div className={classes.loadingState}>Searching...</div>
                  ) : (
                    <SearchAutocompleteEmptyState />
                  )
                }
                onAction={() => {
                  overlayState.close();
                }}
              >
                {children}
              </ListBox>
            </Box>
          </BgReset>
        </RAPopover>
        <VisuallyHidden aria-live="polite" aria-atomic="true">
          {liveMessage}
        </VisuallyHidden>
      </Autocomplete>
    </OverlayTriggerStateContext.Provider>
  );
}

/**
 * An individual option item within a SearchAutocomplete dropdown.
 *
 * @public
 */
export function SearchAutocompleteItem(props: SearchAutocompleteItemProps) {
  const { ownProps, restProps } = useDefinition(
    SearchAutocompleteItemDefinition,
    props,
  );
  const { classes, children } = ownProps;

  return (
    <ListBoxItem
      textValue={typeof children === 'string' ? children : undefined}
      className={classes.root}
      {...restProps}
    >
      <div className={classes.itemContent}>{children}</div>
    </ListBoxItem>
  );
}
