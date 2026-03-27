/*
 * Copyright 2024 The Backstage Authors
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

/**
 * StackDetails — migrated from MUI Typography/makeStyles to Tailwind utility
 * classes. The responsive padding and font-size adjustments previously handled
 * by MUI theme breakpoints are now expressed via Tailwind responsive prefixes.
 */

import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Link } from '../../components/Link';
import { CodeSnippet } from '../../components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { coreComponentsTranslationRef } from '../../translation';

interface IStackDetailsProps {
  stack: string;
}

/** @public */
export type StackDetailsClassKey = 'title';

/**
 * Error page details with stack trace
 *
 * @public
 *
 */
export function StackDetails(props: IStackDetailsProps) {
  const { stack } = props;
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  if (!detailsOpen) {
    return (
      <h6
        className={cn(
          'text-base font-semibold pb-10 max-sm:pb-8 max-sm:text-2xl',
        )}
      >
        <Link to="#" onClick={() => setDetailsOpen(true)}>
          {t('errorPage.showMoreDetails')}
        </Link>
      </h6>
    );
  }

  return (
    <>
      <h6
        className={cn(
          'text-base font-semibold pb-10 max-sm:pb-8 max-sm:text-2xl',
        )}
      >
        <Link to="#" onClick={() => setDetailsOpen(false)}>
          {t('errorPage.showLessDetails')}
        </Link>
      </h6>
      <CodeSnippet
        text={stack}
        language="text"
        showCopyCodeButton
        showLineNumbers
      />
    </>
  );
}
