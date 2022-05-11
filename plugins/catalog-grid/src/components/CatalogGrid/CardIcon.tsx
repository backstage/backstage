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
import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { IconComponent, useApp } from '@backstage/core-plugin-api';
import { CardTitleOptions } from './CatalogGrid';

const useCatalogCardIconStyles = makeStyles({
  imageIcon: {
    maxWidth: '35px',
    maxHeight: '35px',
    borderRadius: '25%',
  },
});
export const CardIcon = ({
  entity,
  options,
}: {
  entity: Entity;
  options: CardTitleOptions;
}) => {
  const classes = useCatalogCardIconStyles();
  const app = useApp();
  const iconResolver = (key?: string): IconComponent =>
    key ? app.getSystemIcon(key) ?? options?.defaultIcon : options?.defaultIcon;
  const key = entity.metadata?.icon as string;
  const image = /^(\w+:)?\/\//.test(key) ? key : null;
  const Icon = iconResolver(key);
  if (!image && !Icon) return <></>;
  return (
    <Box mr={1}>
      {image && (
        <img
          alt={`${entity?.metadata?.name} Icon`}
          src={image}
          aria-hidden="true"
          className={classes.imageIcon}
        />
      )}
      {!image && Icon && <Icon fontSize="large" />}
    </Box>
  );
};
