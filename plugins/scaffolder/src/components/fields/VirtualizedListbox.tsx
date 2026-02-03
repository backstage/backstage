/*
 * Copyright 2024 The Backstage Authors
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
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  Children,
} from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

type HTMLDivProps = HTMLAttributes<HTMLDivElement>;

const renderRow = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  return cloneElement(data[index], { style });
};

// Context needed to keep Autocomplete working correctly : https://v4.mui.com/components/autocomplete/#Virtualize.tsx
const OuterElementContext = createContext<HTMLDivProps>({});

const OuterElementType = forwardRef<HTMLDivElement, HTMLDivProps>(
  (props, ref) => {
    const outerProps = useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  },
);

export const VirtualizedListbox = forwardRef<HTMLDivElement, HTMLDivProps>(
  (props, ref) => {
    const { children, ...other } = props;
    const itemData = Children.toArray(children);
    const itemCount = itemData.length;

    const itemSize = 36;

    const itemsToShow = Math.min(10, itemCount) + 0.5;
    const height = itemsToShow * itemSize;

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <FixedSizeList
            height={height}
            itemData={itemData}
            itemCount={itemCount}
            itemSize={itemSize}
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
