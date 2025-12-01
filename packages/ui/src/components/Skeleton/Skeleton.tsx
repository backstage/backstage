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
import { SkeletonDefinition } from './definition';
import { SkeletonProps } from './types';
import styles from './Skeleton.module.css';
import clsx from 'clsx';

/** @public */
export const Skeleton = (props: SkeletonProps) => {
  const { classNames, cleanedProps } = useStyles(SkeletonDefinition, {
    width: 80,
    height: 24,
    rounded: false,
    ...props,
  });
  const { className, width, height, rounded, style, ...rest } = cleanedProps;

  return (
    <div
      className={clsx(classNames.root, styles[classNames.root], className)}
      data-rounded={rounded}
      style={{
        width,
        height,
        ...style,
      }}
      {...rest}
    />
  );
};
