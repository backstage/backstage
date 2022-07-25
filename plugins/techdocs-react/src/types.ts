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

import { ComponentType } from 'react';
import { Entity } from '@backstage/catalog-model';

/**
 * TechDocs metadata navigation tree
 *
 * @public
 */
export type TechDocsNav = Array<Record<string, string | TechDocsNav>>;

/**
 * Metadata for TechDocs page
 *
 * @public
 */
export type TechDocsMetadata = {
  site_name: string;
  site_description: string;
  nav?: TechDocsNav;
};

/**
 * Metadata for TechDocs Entity
 *
 * @public
 */
export type TechDocsEntityMetadata = Entity & {
  locationMetadata?: { type: string; target: string };
};

/**
 * Locations for which TechDocs addons may be declared and rendered.
 * @public
 */
export const TechDocsAddonLocations = Object.freeze({
  /**
   * These addons fill up the header from the right, on the same line as the
   * title.
   */
  Header: 'Header',

  /**
   * These addons appear below the header and above all content; tooling addons
   * can be inserted for convenience.
   */
  Subheader: 'Subheader',

  /**
   * These addons are items added to the settings menu list and are designed to make
   * the reader experience customizable, for example accessibility options
   */
  Settings: 'Settings',

  /**
   * These addons appear left of the content and above the navigation.
   */
  PrimarySidebar: 'PrimarySidebar',

  /**
   * These addons appear right of the content and above the table of contents.
   */
  SecondarySidebar: 'SecondarySidebar',

  /**
   * A virtual location which allows mutation of all content within the shadow
   * root by transforming DOM nodes. These addons should return null on render.
   */
  Content: 'Content',

  /**
   * todo(backstage/community): This is a proposed virtual location which would
   * help implement a common addon pattern in which many instances of a given
   * element in markdown would be dynamically replaced at render-time based on
   * attributes provided on that element, for example:
   *
   * ```md
   * ## For Fun
   * <TechDocsAddon>CatGif</TechDocsAddon>
   *
   * ## Component Metadata
   * <TechDocsAddon entityRef="default:component/some-component-name">CatalogEntityCard</TechDocsAddon>
   *
   * ## System Metadata
   * <TechDocsAddon entityRef="default:system/some-system-name">CatalogEntityCard</TechDocsAddon>
   * ```
   *
   * Could correspond to a TechDocs addon named `CatalogEntityCard` with
   * location `TechDocsAddonLocations.COMPONENT`, whose `component` would be
   * the react component that would be rendered in place of all instances of
   * the markdown illustrated above.
   *
   * The `@backstage/plugin-techdocs-react` package would need to be updated to, in
   * cases where such addons had been registered, find all instances of the
   * the `<TechDocsAddon>` tag whose `textContent` corresponded with the name of the
   * addon, then replace them with component instances of the addon component,
   * passing any attributes from the tag as props to the component.
   */
  // Component: 'Component',
} as const);

/**
 * Options for creating a TechDocs addon.
 * @public
 */
export type TechDocsAddonOptions<TAddonProps = {}> = {
  name: string;
  location: keyof typeof TechDocsAddonLocations;
  component: ComponentType<TAddonProps>;
};
