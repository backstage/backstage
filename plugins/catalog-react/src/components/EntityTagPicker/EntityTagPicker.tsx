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

import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { EntityTagFilter } from '../../filters';
import { EntityAutocompletePicker } from '../EntityAutocompletePicker/EntityAutocompletePicker';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export type CatalogReactEntityTagPickerClassKey = 'input';

/** @public */
export type EntityTagPickerProps = {
  showCounts?: boolean;
  initialFilter?: string[];
  hidden?: boolean;
};

const useStyles = makeStyles(
  { input: {} },
  { name: 'CatalogReactEntityTagPicker' },
);

/** @public */
export const EntityTagPicker = (props: EntityTagPickerProps) => {
  const classes = useStyles();
  const { t } = useTranslationRef(catalogReactTranslationRef);

  return (
    <EntityAutocompletePicker
      label={t('entityTagPicker.title')}
      name="tags"
      path="metadata.tags"
      Filter={EntityTagFilter}
      showCounts={props.showCounts}
      InputProps={{ className: classes.input }}
      initialSelectedOptions={props.initialFilter ? props.initialFilter : []}
      hidden={props.hidden}
    />
  );
};
