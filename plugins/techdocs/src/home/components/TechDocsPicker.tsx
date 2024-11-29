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

import { useEffect } from 'react';
import {
  CATALOG_FILTER_EXISTS,
  DefaultEntityFilters,
  EntityFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import { TECHDOCS_ANNOTATION } from '@backstage/plugin-techdocs-common';

class TechDocsFilter implements EntityFilter {
  getCatalogFilters(): Record<string, string | symbol | (string | symbol)[]> {
    return {
      [`metadata.annotations.${TECHDOCS_ANNOTATION}`]: CATALOG_FILTER_EXISTS,
    };
  }
}

type CustomFilters = DefaultEntityFilters & {
  techdocs?: TechDocsFilter;
};

/**
 * Component responsible for updating TechDocs filters
 *
 * @public
 */
export const TechDocsPicker = () => {
  const { updateFilters } = useEntityList<CustomFilters>();

  useEffect(() => {
    updateFilters({
      techdocs: new TechDocsFilter(),
    });
  }, [updateFilters]);

  return null;
};
