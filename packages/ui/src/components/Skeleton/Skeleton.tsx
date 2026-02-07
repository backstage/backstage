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

import { useStyles } from '../../hooks/useStyles';
import { useSurface } from '../../hooks/useSurface';
import { SkeletonDefinition } from './definition';
import { SkeletonProps } from './types';
import styles from './Skeleton.module.css';
import clsx from 'clsx';
import { CSSProperties } from 'react';

/** @public */
export const Skeleton = (props: SkeletonProps) => {
  const { classNames, cleanedProps } = useStyles(SkeletonDefinition, {
    rounded: false,
    ...props,
  });
  const {
    className,
    width,
    height,
    rounded,
    children,
    onSurface,
    style,
    ...rest
  } = cleanedProps;

  const { surface } = useSurface({ onSurface });

  // Determine if we should use fit-content sizing (when children are present and no explicit dimensions)
  const hasFitContent =
    !!children && width === undefined && height === undefined;

  // Build inline styles
  const inlineStyles: CSSProperties = { ...style };

  // Set width/height with smart defaults
  if (width !== undefined) {
    inlineStyles.width = width;
  } else if (!hasFitContent) {
    // Default to 100% for empty skeletons (better for text inference)
    inlineStyles.width = '100%';
  }

  if (height !== undefined) {
    inlineStyles.height = height;
  }
  // Don't set default height - let typography context determine it via ::before

  return (
    <div
      className={clsx(classNames.root, styles[classNames.root], className)}
      data-rounded={rounded}
      data-fit-content={hasFitContent}
      {...(typeof surface === 'string' ? { 'data-on-surface': surface } : {})}
      style={inlineStyles}
      {...rest}
    >
      {children}
    </div>
  );
};
