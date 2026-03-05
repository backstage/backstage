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

import { cloneElement, Fragment, useEffect, useRef, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { searchApiRef, useSearch } from '@backstage/plugin-search-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@backstage/core-components';
import { Separator } from '@backstage/core-components';
import { cn } from '@backstage/core-components';
import { Type as TypeIcon } from 'lucide-react';
import useAsync from 'react-use/esm/useAsync';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { searchTranslationRef } from '../../translation';

/**
 * @public
 */
export type SearchTypeAccordionProps = {
  name: string;
  types: Array<{
    value: string;
    name: string;
    icon: JSX.Element;
  }>;
  defaultValue?: string;
  showCounts?: boolean;
};

export const SearchTypeAccordion = (props: SearchTypeAccordionProps) => {
  const { filters, setPageCursor, setTypes, term, types } = useSearch();
  const searchApi = useApi(searchApiRef);
  const [expanded, setExpanded] = useState(true);
  const { defaultValue, name, showCounts, types: givenTypes } = props;
  const { t } = useTranslationRef(searchTranslationRef);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleClick = (type: string) => {
    return () => {
      setTypes(type !== '' ? [type] : []);
      setPageCursor(undefined);
    };
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
      name: t('searchType.accordion.allTitle'),
      icon: <TypeIcon />,
    },
    ...givenTypes,
  ];
  const selected = types[0] || '';

  const { value: resultCounts } = useAsync(async () => {
    if (!showCounts) {
      return {};
    }
    // Here we cancel the previous requests before making a new one
    // All requests are made with a new AbortController signal
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const counts = await Promise.all(
      definedTypes
        .map(type => type.value)
        .map(async type => {
          const { numberOfResults } = await searchApi.query(
            {
              term,
              types: type ? [type] : [],
              filters:
                types.includes(type) || (!types.length && !type) ? filters : {},
              pageLimit: 0,
            },
            { signal: controller.signal },
          );

          return [
            type,
            numberOfResults !== undefined
              ? t('searchType.accordion.numberOfResults', {
                  number:
                    numberOfResults >= 10000 ? `>10000` : `${numberOfResults}`,
                })
              : ' -- ',
          ];
        }),
    );

    return Object.fromEntries(counts);
  }, [filters, showCounts, term, types]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div>
      <h2 className="text-sm text-foreground">{name}</h2>
      <Accordion
        type="single"
        collapsible
        value={expanded ? 'search-types' : ''}
        onValueChange={val => setExpanded(val === 'search-types')}
        className="bg-card"
      >
        <AccordionItem value="search-types" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm">
            {expanded
              ? t('searchType.accordion.collapse')
              : definedTypes.filter(type => type.value === selected)[0]!.name}
          </AccordionTrigger>
          <AccordionContent className="pb-1 pt-0">
            <nav aria-label="filter by type" className="w-full">
              {definedTypes.map(type => (
                <Fragment key={type.value}>
                  <Separator />
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center gap-2 px-4 py-2 text-left text-sm rounded-sm transition-colors hover:bg-accent',
                      (types[0] === type.value ||
                        (types.length === 0 && type.value === '')) &&
                        'bg-accent text-accent-foreground',
                    )}
                    onClick={handleClick(type.value)}
                  >
                    <span className="flex shrink-0 items-center justify-center h-6 w-6">
                      {cloneElement(type.icon, {
                        className: 'h-6 w-6 text-foreground',
                      })}
                    </span>
                    <span className="flex-1">
                      <span className="block">{type.name}</span>
                      {resultCounts && resultCounts[type.value] && (
                        <span className="block text-xs text-muted-foreground">
                          {resultCounts[type.value]}
                        </span>
                      )}
                    </span>
                  </button>
                </Fragment>
              ))}
            </nav>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
