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
import { useSearch } from '@backstage/plugin-search-react';
import { ShadcnTabs, TabsList, TabsTrigger } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { searchTranslationRef } from '../../translation';

/**
 * @public
 */
export type SearchTypeTabsProps = {
  types: Array<{
    value: string;
    name: string;
  }>;
  defaultValue?: string;
};

export const SearchTypeTabs = (props: SearchTypeTabsProps) => {
  const { setPageCursor, setTypes, types } = useSearch();
  const { defaultValue, types: givenTypes } = props;
  const { t } = useTranslationRef(searchTranslationRef);

  const changeTab = (newType: string) => {
    setTypes(newType !== '' ? [newType] : []);
    setPageCursor(undefined);
  };

  // Radix Tabs only fires onValueChange when the value actually changes,
  // unlike MUI which fires onChange on every click (including re-clicking
  // the active tab). This handler preserves the MUI behavior by calling
  // changeTab when re-clicking the already-active trigger.
  const handleTriggerClick = (triggerValue: string) => {
    const currentValue = types.length === 0 ? '' : types[0];
    if (triggerValue === currentValue) {
      changeTab(triggerValue);
    }
  };

  // Handle any provided defaultValue
  useEffect(() => {
    if (defaultValue) {
      setTypes([defaultValue]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const definedTypes = [
    {
      value: '',
      name: t('searchType.tabs.allTitle'),
    },
    ...givenTypes,
  ];

  return (
    <ShadcnTabs
      value={types.length === 0 ? '' : types[0]}
      onValueChange={changeTab}
      className="border-b border-border"
    >
      <TabsList
        aria-label="List of search types tabs"
        className="h-auto bg-transparent p-0 rounded-none"
      >
        {definedTypes.map((type, idx) => (
          <TabsTrigger
            key={idx}
            value={type.value}
            onClick={() => handleTriggerClick(type.value)}
            className="h-[50px] min-w-[130px] rounded-none border-b-2 border-transparent font-bold text-[13px] text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {type.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </ShadcnTabs>
  );
};
