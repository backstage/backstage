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

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Separator,
} from '@backstage/core-components';
import { usePrevious } from '@react-hookz/web';
import { useEffect, useState } from 'react';
import { useDryRun } from '../DryRunContext';
import { DryRunResultsList } from './DryRunResultsList';
import { DryRunResultsView } from './DryRunResultsView';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../../translation';

export function DryRunResults() {
  const dryRun = useDryRun();
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(true);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const resultsLength = dryRun.results.length;
  const prevResultsLength = usePrevious(resultsLength);
  useEffect(() => {
    if (prevResultsLength === 0 && resultsLength === 1) {
      setHidden(false);
      setExpanded(true);
    } else if (prevResultsLength === 1 && resultsLength === 0) {
      setExpanded(false);
    }
  }, [prevResultsLength, resultsLength]);

  return (
    <div
      hidden={resultsLength === 0 && hidden}
      onTransitionEnd={() => resultsLength === 0 && setHidden(true)}
    >
      <Accordion
        type="single"
        collapsible
        value={expanded ? 'dry-run' : ''}
        onValueChange={val => setExpanded(val === 'dry-run')}
        className="border border-border rounded-md"
      >
        <AccordionItem value="dry-run" className="border-b-0">
          <AccordionTrigger className="h-12 min-h-0 px-4">
            <span className="text-sm font-medium">
              {t('templateEditorPage.dryRunResults.title')}
            </span>
          </AccordionTrigger>
          <Separator orientation="horizontal" />
          <AccordionContent forceMount hidden={!expanded} className="p-0">
            <div className="grid grid-cols-[180px_auto_1fr] grid-rows-[1fr] h-[400px] bg-background">
              <DryRunResultsList />
              <Separator orientation="vertical" />
              <DryRunResultsView />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
