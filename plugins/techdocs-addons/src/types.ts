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

import { Entity } from '@backstage/catalog-model';
import { ComponentType } from 'react';
import { AsyncState } from 'react-use/lib/useAsyncFn';

/**
 * Locations for which TechDocs addons may be declared and rendered.
 * @public
 */
export enum TechDocsAddonLocations {
  /**
   * These addons fill up the header from the right, on the same line as the
   * title.
   */
  HEADER = 'header',

  /**
   * These addons appear below the header and above all content; tooling addons
   * can be inserted for convenience.
   */
  SUBHEADER = 'subheader',

  /**
   * These addons appear left of the content and above the navigation.
   */
  PRIMARY_SIDEBAR = 'primary sidebar',

  /**
   * These addons appear right of the content and above the table of contents.
   */
  SECONDARY_SIDEBAR = 'secondary sidebar',

  /**
   * A virtual location which allows mutation of all content within the shadow
   * root by transforming DOM nodes. These addons should return null on render.
   */
  CONTENT = 'content',

  /**
   * A virtual location allowing an instance of the addon to be rendered for
   * every HTML node with the same tag name as the addon name in the markdown
   * content. If no reference is made, no instance will be rendered. Works like
   * regular React components, just being accessible from markdown.
   *
   * todo(backstage/techdocs-core): Keep and implement or remove before
   * releasing this package!
   */
  COMPONENT = 'component',
}

/**
 * Options for creating a TechDocs addon.
 * @public
 */
export type TechDocsAddonOptions<TAddonProps = {}> = {
  name: string;
  location: TechDocsAddonLocations;
  component: ComponentType<TAddonProps>;
};

/**
 * Common response envelope for addon-related hooks.
 * @public
 */
export type TechDocsAddonAsyncMetadata<TValue> = AsyncState<TValue | undefined>;

/**
 * Metadata for TechDocs page
 *
 * @public
 */
export type TechDocsMetadata = {
  site_name: string;
  site_description: string;
};

/**
 * Metadata for TechDocs Entity
 *
 * @public
 */
export type TechDocsEntityMetadata = Entity & {
  locationMetadata?: { type: string; target: string };
};
