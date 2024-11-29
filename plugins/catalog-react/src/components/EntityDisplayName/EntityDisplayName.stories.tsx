/*
 * Copyright 2022 The Backstage Authors
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

import React, { ComponentType } from 'react';
import { EntityDisplayName, EntityDisplayNameProps } from './EntityDisplayName';
import { wrapInTestApp } from '@backstage/test-utils';

const defaultArgs = {
  entityRef: 'component:default/playback',
};

export default {
  title: 'Catalog /EntityDisplayName',
  decorators: [(Story: ComponentType<{}>) => wrapInTestApp(<Story />)],
};

export const Default = (args: EntityDisplayNameProps) => (
  <EntityDisplayName {...args} />
);
Default.args = defaultArgs;
