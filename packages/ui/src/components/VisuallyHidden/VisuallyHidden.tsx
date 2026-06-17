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

import { useDefinition } from '../../hooks/useDefinition';
import { VisuallyHiddenDefinition } from './definition';
import { VisuallyHiddenProps } from './types';

/**
 * Visually hides content while keeping it accessible to screen readers.
 * Useful for descriptive labels and other screen-reader-only content.
 *
 * Note: This component is for content that should ALWAYS remain visually hidden.
 * For skip links that become visible on focus, use a different approach.
 *
 * @public
 */
export const VisuallyHidden = (props: VisuallyHiddenProps) => {
  const { ownProps, restProps } = useDefinition(
    VisuallyHiddenDefinition,
    props,
  );
  const { classes } = ownProps;

  return <div className={classes.root} {...restProps} />;
};
