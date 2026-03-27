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

import { Button, CodeSnippet, EmptyState } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';

const EXAMPLE = `auth:
  providers:
    google:
      development:
        clientId: \${AUTH_GOOGLE_CLIENT_ID}
        clientSecret: \${AUTH_GOOGLE_CLIENT_SECRET}
`;

export const EmptyProviders = () => {
  const { t } = useTranslationRef(userSettingsTranslationRef);
  return (
    <EmptyState
      missing="content"
      title={t('emptyProviders.title')}
      description={t('emptyProviders.description')}
      action={
        <>
          {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to native elements with Tailwind */}
          <p className="text-sm text-muted-foreground">
            {t('emptyProviders.action.title')}
          </p>
          <CodeSnippet
            text={EXAMPLE}
            language="yaml"
            showLineNumbers
            highlightedNumbers={[3, 4, 5, 6, 7, 8]}
            customStyle={{ background: 'inherit', fontSize: '115%' }}
          />
          <Button to="https://backstage.io/docs/auth/add-auth-provider">
            {t('emptyProviders.action.readMoreButtonTitle')}
          </Button>
        </>
      }
    />
  );
};
