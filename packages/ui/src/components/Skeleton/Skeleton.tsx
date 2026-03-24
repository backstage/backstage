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

import type { SkeletonProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { SkeletonDefinition } from './definition';

/** @public */
export const Skeleton = (props: SkeletonProps) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    SkeletonDefinition,
    props,
  );
  const { classes, width, height, style } = ownProps;

  return (
    <div
      className={classes.root}
      {...dataAttributes}
      style={{
        width,
        height,
        ...style,
      }}
      {...restProps}
    />
  );
};
