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

import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

const renderRow = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  return React.cloneElement(data[index], { style });
};

export const VirtualizedListbox = React.forwardRef<
  HTMLDivElement,
  { children?: React.ReactNode }
>((props, ref) => {
  const itemData = React.Children.toArray(props.children);
  const itemCount = itemData.length;

  const itemSize = 36;

  const itemsToShow = Math.min(10, itemCount);
  const height = Math.max(itemSize, itemsToShow * itemSize - 0.5 * itemSize);

  return (
    <div ref={ref}>
      <FixedSizeList
        height={height}
        itemData={itemData}
        itemCount={itemCount}
        itemSize={itemSize}
        width="100%"
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
});
