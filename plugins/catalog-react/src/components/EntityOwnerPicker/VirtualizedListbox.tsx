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

import {
  HTMLAttributes,
  UIEvent,
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  Children,
} from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

// MUI Autocomplete's ListboxComponent prop is typed as ComponentType<HTMLAttributes<HTMLElement>>,
// so we use HTMLElement here to avoid a cast at the usage site.
type ListboxProps = HTMLAttributes<HTMLElement>;

const ITEM_SIZE = 36;

const renderRow = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  return cloneElement(data[index], { style });
};

// Passes Autocomplete listbox props (onScroll, data-testid, etc.) through to the
// outer scroll container so MUI Autocomplete keeps working correctly.
// See https://v4.mui.com/components/autocomplete/#Virtualize.tsx
const OuterElementContext = createContext<ListboxProps>({});

const OuterElementType = forwardRef<HTMLDivElement, ListboxProps>(
  ({ onScroll: rrOnScroll, ...props }, ref) => {
    const { onScroll: outerOnScroll, ...outerProps } =
      useContext(OuterElementContext);
    // Compose both handlers: spreading outerProps last would silently overwrite
    // react-window's onScroll, breaking virtualization.
    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
      rrOnScroll?.(e);
      outerOnScroll?.(e);
    };
    return <div ref={ref} onScroll={handleScroll} {...props} {...outerProps} />;
  },
);

export const VirtualizedListbox = forwardRef<HTMLDivElement, ListboxProps>(
  (props, ref) => {
    const { children, ...other } = props;
    const itemData = Children.toArray(children);
    const itemCount = itemData.length;

    const itemsToShow = Math.min(10, itemCount) + 0.5;
    const height = itemsToShow * ITEM_SIZE;

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <FixedSizeList
            height={height}
            itemData={itemData}
            itemCount={itemCount}
            itemSize={ITEM_SIZE}
            outerElementType={OuterElementType}
            width="100%"
          >
            {renderRow}
          </FixedSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  },
);
