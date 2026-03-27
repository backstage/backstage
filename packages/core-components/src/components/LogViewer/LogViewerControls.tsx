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

import { KeyboardEvent } from 'react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { coreComponentsTranslationRef } from '../../translation';
import { LogViewerSearch } from './useLogViewerSearch';

export interface LogViewerControlsProps extends LogViewerSearch {}

export function LogViewerControls(props: LogViewerControlsProps) {
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  const { resultCount, resultIndexStep, toggleShouldFilter } = props;
  const resultIndex = props.resultIndex ?? 0;

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        toggleShouldFilter();
      } else {
        resultIndexStep(event.shiftKey);
      }
    }
  };

  return (
    <>
      {resultCount !== undefined && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => resultIndexStep(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-mono tabular-nums">
            {Math.min(resultIndex + 1, resultCount)}/{resultCount}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => resultIndexStep()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
      <Input
        className="h-7 w-48 text-sm"
        placeholder={t('logViewer.searchField.placeholder')}
        value={props.searchInput}
        onKeyPress={handleKeyPress}
        onChange={e => props.setSearchInput(e.target.value)}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={toggleShouldFilter}
      >
        <ListFilter
          className={cn(
            'h-4 w-4',
            props.shouldFilter ? 'text-primary' : 'text-muted-foreground',
          )}
        />
      </Button>
    </>
  );
}
