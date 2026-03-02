/*
 * Copyright 2020 The Backstage Authors
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

import { CodeSnippet, Button } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../alpha/translation';

const ENTITY_YAML = `metadata:
  name: example
  links:
    - url: https://dashboard.example.com
      title: My Dashboard
      icon: dashboard`;

/** @public */
export type EntityLinksEmptyStateClassKey = 'code';

export function EntityLinksEmptyState() {
  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <>
      <p className="text-sm text-foreground">
        {t('entityLinksCard.emptyDescription')}
      </p>
      <div className="my-4 rounded-md bg-card dark:bg-muted">
        <CodeSnippet
          text={ENTITY_YAML}
          language="yaml"
          showLineNumbers
          highlightedNumbers={[3, 4, 5, 6]}
          customStyle={{ background: 'inherit', fontSize: '115%' }}
        />
      </div>
      <Button to="https://backstage.io/docs/features/software-catalog/descriptor-format#links-optional">
        {t('entityLinksCard.readMoreButtonTitle')}
      </Button>
    </>
  );
}
