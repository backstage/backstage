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
import clsx from 'clsx';
import type { GridItemProps, GridProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { GridDefinition, GridItemDefinition } from './definition';
import styles from './Grid.module.css';
import { SurfaceProvider } from '../../hooks/useSurface';

const GridRoot = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  const { classNames, dataAttributes, utilityClasses, style, cleanedProps } =
    useStyles(GridDefinition, { columns: 'auto', gap: '4', ...props });

  const { className, surface, ...rest } = cleanedProps;

  const content = (
    <div
      ref={ref}
      className={clsx(
        classNames.root,
        utilityClasses,
        styles[classNames.root],
        className,
      )}
      style={style}
      {...dataAttributes}
      {...rest}
    />
  );

  return surface ? (
    <SurfaceProvider surface={surface}>{content}</SurfaceProvider>
  ) : (
    content
  );
});

const GridItem = forwardRef<HTMLDivElement, GridItemProps>((props, ref) => {
  const { classNames, dataAttributes, utilityClasses, style, cleanedProps } =
    useStyles(GridItemDefinition, props);

  const { className, surface, ...rest } = cleanedProps;

  const content = (
    <div
      ref={ref}
      className={clsx(
        classNames.root,
        utilityClasses,
        styles[classNames.root],
        className,
      )}
      style={style}
      {...dataAttributes}
      {...rest}
    />
  );

  return surface ? (
    <SurfaceProvider surface={surface}>{content}</SurfaceProvider>
  ) : (
    content
  );
});

/** @public */
export const Grid = {
  Root: GridRoot,
  Item: GridItem,
};
