/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import { colorVariants } from '@backstage/theme';
import { Visit } from '../../api/VisitsApi';
import { CompoundEntityRef, parseEntityRef } from '@backstage/catalog-model';

const useStyles = makeStyles(theme => ({
  chip: {
    color: theme.palette.common.white,
    fontWeight: 'bold',
    margin: 0,
  },
}));
const maybeEntity = (visit: Visit): CompoundEntityRef | undefined => {
  try {
    return parseEntityRef(visit?.entityRef ?? '');
  } catch (e) {
    return undefined;
  }
};
const getColorByIndex = (index: number) => {
  const variants = Object.keys(colorVariants);
  const variantIndex = index % variants.length;
  return colorVariants[variants[variantIndex]][0];
};
const getChipColor = (entity: CompoundEntityRef | undefined): string => {
  const defaultColor = getColorByIndex(0);
  if (!entity) return defaultColor;

  // IDEA: Use or replicate useAllKinds hook thus supporting all software catalog
  //       registered kinds. See:
  //       plugins/catalog-react/src/components/EntityKindPicker/kindFilterUtils.ts
  //       Provide extension point to register your own color code.
  const entityKinds = [
    'component',
    'template',
    'api',
    'group',
    'user',
    'resource',
    'system',
    'domain',
    'location',
  ];
  const foundIndex = entityKinds.indexOf(
    entity.kind.toLocaleLowerCase('en-US'),
  );
  return foundIndex === -1 ? defaultColor : getColorByIndex(foundIndex + 1);
};

export const ItemCategory = ({ visit }: { visit: Visit }) => {
  const classes = useStyles();
  const entity = maybeEntity(visit);

  return (
    <Chip
      size="small"
      className={classes.chip}
      label={(entity?.kind ?? 'Other').toLocaleLowerCase('en-US')}
      style={{ background: getChipColor(entity) }}
    />
  );
};
