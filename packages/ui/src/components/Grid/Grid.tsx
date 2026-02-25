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

import { forwardRef } from 'react';
import type { GridItemProps, GridProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { GridDefinition, GridItemDefinition } from './definition';

const GridRoot = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  const { ownProps, restProps, dataAttributes, utilityStyle } = useDefinition(
    GridDefinition,
    { columns: 'auto', gap: '4', ...props },
  );
  const { classes, childrenWithBgProvider } = ownProps;

  return (
    <div
      ref={ref}
      className={classes.root}
      style={{ ...utilityStyle, ...ownProps.style }}
      {...dataAttributes}
      {...restProps}
    >
      {childrenWithBgProvider}
    </div>
  );
});

const GridItem = forwardRef<HTMLDivElement, GridItemProps>((props, ref) => {
  const { ownProps, restProps, dataAttributes, utilityStyle } = useDefinition(
    GridItemDefinition,
    props,
  );
  const { classes, childrenWithBgProvider } = ownProps;

  return (
    <div
      ref={ref}
      className={classes.root}
      style={{ ...utilityStyle, ...ownProps.style }}
      {...dataAttributes}
      {...restProps}
    >
      {childrenWithBgProvider}
    </div>
  );
});

/** @public */
export const Grid = {
  Root: GridRoot,
  Item: GridItem,
};
