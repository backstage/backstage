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

import { useRef } from 'react';
import { useInteractOutside } from '@react-aria/interactions';
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
import { useOverlayTriggerState } from '@react-stately/overlays';
import { RiSearch2Line, RiCloseCircleLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import {
  SearchAutocompleteDefinition,
  SearchAutocompleteItemDefinition,
} from './definition';
import { Box } from '../Box';
import { BgReset } from '../../hooks/useBg';

import type {
  SearchAutocompleteProps,
  SearchAutocompleteItemProps,
} from './types';

const SearchAutocompleteEmptyState = () => {
  const { ownProps } = useDefinition(SearchAutocompleteDefinition, {});
  return <div className={ownProps.classes.emptyState}>No results found.</div>;
};

/** @public */
export const SearchAutocomplete = (props: SearchAutocompleteProps<object>) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    SearchAutocompleteDefinition,
    props,
  );
  const {
    classes,
    placeholder,
    popoverWidth,
    popoverPlacement = 'bottom start',
    items,
    children,
    defaultOpen,
  } = ownProps;

  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const hasValue = !!restProps.inputValue;
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
        {...restProps}
        onInputChange={value => {
          restProps.onInputChange?.(value);
          if (value) {
            overlayState.open();
          } else {
            overlayState.close();
          }
        }}
      >
        <RASearchField
          className={classes.searchField}
          aria-label={placeholder}
          data-size={dataAttributes['data-size']}
        >
          <div
            ref={triggerRef as any}
            className={classes.root}
            data-size={dataAttributes['data-size']}
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
          ref={popoverRef as any}
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
                items={items}
                autoFocus="first"
                shouldFocusOnHover
                renderEmptyState={() => <SearchAutocompleteEmptyState />}
                onAction={() => {
                  overlayState.close();
                }}
              >
                {children}
              </ListBox>
            </Box>
          </BgReset>
        </RAPopover>
      </Autocomplete>
    </OverlayTriggerStateContext.Provider>
  );
};

/** @public */
export const SearchAutocompleteItem = (props: SearchAutocompleteItemProps) => {
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
};
