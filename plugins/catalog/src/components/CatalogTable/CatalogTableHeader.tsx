/*
 * Copyright 2025 The Backstage Authors
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

import { useState, useEffect, useMemo } from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import {
  useEntityList,
  EntityTextFilter,
} from '@backstage/plugin-catalog-react';
import { Flex, Text, SearchField, Box } from '@backstage/ui';

/**
 * Props for CatalogTableHeader
 * @internal
 */
export interface CatalogTableHeaderProps {
  title?: string;
  subtitle?: string;
}

/**
 * Header component for the catalog table with title, subtitle, and search
 * @internal
 */
export function CatalogTableHeader(props: CatalogTableHeaderProps) {
  const { title, subtitle } = props;
  const {
    updateFilters,
    queryParameters: { text: textParameter },
  } = useEntityList();

  // Search state management
  const queryParamTextFilter = useMemo(
    () => [textParameter].flat()[0],
    [textParameter],
  );

  const [search, setSearch] = useState(queryParamTextFilter ?? '');

  useDebounce(
    () => {
      updateFilters({
        text: search.length ? new EntityTextFilter(search) : undefined,
      });
    },
    250,
    [search, updateFilters],
  );

  useEffect(() => {
    if (queryParamTextFilter) {
      setSearch(queryParamTextFilter);
    }
  }, [queryParamTextFilter]);

  return (
    <Flex justify="between" align="center" mb="4">
      <Flex direction="column" gap="0">
        {title && (
          <Text variant="title-small" as="h2">
            {title}
          </Text>
        )}
        {subtitle && (
          <Text variant="body-medium" color="secondary">
            {subtitle}
          </Text>
        )}
      </Flex>
      <Box style={{ maxWidth: '300px', width: '100%' }}>
        <SearchField
          aria-label="Search"
          placeholder="Search"
          value={search}
          onChange={setSearch}
        />
      </Box>
    </Flex>
  );
}
