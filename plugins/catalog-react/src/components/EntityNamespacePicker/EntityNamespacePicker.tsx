/*
 * Copyright 2021 The Backstage Authors
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

import { makeStyles } from '@material-ui/core';

import React from 'react';
import { EntityNamespaceFilter } from '../../filters';
import { EntityAutocompletePicker } from '../EntityAutocompletePicker';

/** @public */
export type CatalogReactEntityNamespacePickerClassKey = 'input';

const useStyles = makeStyles(
  {
    input: {},
  },
  {
    name: 'CatalogReactEntityNamespacePicker',
  },
);

/** @public */
export const EntityNamespacePicker = () => {
  const classes = useStyles();
  return (
    <EntityAutocompletePicker
      label="Namespace"
      name="namespace"
      path="metadata.namespace"
      Filter={EntityNamespaceFilter}
      InputProps={{ className: classes.input }}
    />
  );
};
