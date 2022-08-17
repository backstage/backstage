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

import React, { useCallback } from 'react';
import { useOutlet } from 'react-router-dom';

import {
  attachComponentData,
  createReactExtension,
  ElementCollection,
  Extension,
  useElementFilter,
} from '@backstage/core-plugin-api';

import { TechDocsAddonLocations, TechDocsAddonOptions } from './types';

export const TECHDOCS_ADDONS_KEY = 'techdocs.addons.addon.v1';

/**
 * Marks the `<TechDocsAddons>` registry component.
 * @public
 */
export const TECHDOCS_ADDONS_WRAPPER_KEY = 'techdocs.addons.wrapper.v1';

/**
 * TechDocs Addon registry.
 * @public
 */
export const TechDocsAddons: React.ComponentType = () => null;

attachComponentData(TechDocsAddons, TECHDOCS_ADDONS_WRAPPER_KEY, true);

const getDataKeyByName = (name: string) => {
  return `${TECHDOCS_ADDONS_KEY}.${name.toLocaleLowerCase('en-US')}`;
};

/**
 * Create a TechDocs addon overload signature without props.
 * @public
 */
export function createTechDocsAddonExtension(
  options: TechDocsAddonOptions,
): Extension<() => JSX.Element | null>;

/**
 * Create a TechDocs addon overload signature with props.
 * @public
 */
export function createTechDocsAddonExtension<TComponentProps>(
  options: TechDocsAddonOptions<TComponentProps>,
): Extension<(props: TComponentProps) => JSX.Element | null>;

/**
 * Create a TechDocs addon implementation.
 * @public
 */
export function createTechDocsAddonExtension<TComponentProps>(
  options: TechDocsAddonOptions<TComponentProps>,
): Extension<(props: TComponentProps) => JSX.Element | null> {
  const { name, component: TechDocsAddon } = options;
  return createReactExtension({
    name,
    component: {
      sync: (props: TComponentProps) => <TechDocsAddon {...props} />,
    },
    data: {
      [TECHDOCS_ADDONS_KEY]: options,
      [getDataKeyByName(name)]: true,
    },
  });
}

const getTechDocsAddonByName = (
  collection: ElementCollection,
  key: string,
): JSX.Element | undefined => {
  return collection.selectByComponentData({ key }).getElements()[0];
};

const getAllTechDocsAddons = (collection: ElementCollection) => {
  return collection
    .selectByComponentData({
      key: TECHDOCS_ADDONS_WRAPPER_KEY,
    })
    .selectByComponentData({
      key: TECHDOCS_ADDONS_KEY,
    });
};

const getAllTechDocsAddonsData = (collection: ElementCollection) => {
  return collection
    .selectByComponentData({
      key: TECHDOCS_ADDONS_WRAPPER_KEY,
    })
    .findComponentData<TechDocsAddonOptions>({
      key: TECHDOCS_ADDONS_KEY,
    });
};

/**
 * hook to use addons in components
 * @public
 */
export const useTechDocsAddons = () => {
  const node = useOutlet();
  const collection = useElementFilter(node, getAllTechDocsAddons);
  const options = useElementFilter(node, getAllTechDocsAddonsData);

  const findAddonByData = useCallback(
    (data: TechDocsAddonOptions | undefined) => {
      if (!collection || !data) return null;
      const nameKey = getDataKeyByName(data.name);
      return getTechDocsAddonByName(collection, nameKey) ?? null;
    },
    [collection],
  );

  const renderComponentByName = useCallback(
    (name: string) => {
      const data = options.find(option => option.name === name);
      return data ? findAddonByData(data) : null;
    },
    [options, findAddonByData],
  );

  const renderComponentsByLocation = useCallback(
    (location: keyof typeof TechDocsAddonLocations) => {
      const data = options.filter(option => option.location === location);
      return data.length ? data.map(findAddonByData) : null;
    },
    [options, findAddonByData],
  );

  return { renderComponentByName, renderComponentsByLocation };
};
