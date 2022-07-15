/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { Grid } from '@material-ui/core';
import React from 'react';
import { AboutCardDefaultFields } from './fields';

/**
 * Props for {@link AboutContent}.
 *
 * @public
 */
export interface AboutContentProps {
  /**
   * The entity here is for backward compatibility only.
   * It's not passed to the children as the children use
   * useEntity hook to access the entity in the current context.
   *
   * The {@link AboutContent} component should only be used
   * within EntityLayout, and the entity prop will be removed
   * in future releases.
   *
   * @deprecated use useEntity hook in the children.
   */
  entity: Entity;
  children?: React.ReactNode;
}

// TODO: It seems the whole AboutContent component here is redundant,
// consider deprecating and removing it.
/** @public */
export const AboutContent = (props: AboutContentProps) => {
  const { children } = props;
  return <Grid container>{children ? children : AboutCardDefaultFields}</Grid>;
};
