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

import { useMemo, useState } from 'react';
import useObservable from 'react-use/esm/useObservable';
import {
  useApi,
  configApiRef,
  oauthRequestApiRef,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { coreComponentsTranslationRef } from '../../translation';
import {
  ShadcnDialog,
  ShadcnDialogContent,
  DialogHeader,
  DialogFooter,
  ShadcnDialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import LoginRequestListItem from './LoginRequestListItem';

export type OAuthRequestDialogClassKey =
  | 'dialog'
  | 'title'
  | 'contentList'
  | 'actionButtons';

export function OAuthRequestDialog(_props: {}) {
  const [busy, setBusy] = useState(false);
  const oauthRequestApi = useApi(oauthRequestApiRef);
  const configApi = useApi(configApiRef);
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  const authRedirect =
    configApi.getOptionalBoolean('enableExperimentalRedirectFlow') ?? false;

  const requests = useObservable(
    useMemo(() => oauthRequestApi.authRequest$(), [oauthRequestApi]),
    [],
  );

  const handleRejectAll = () => {
    requests.forEach(request => request.reject());
  };

  return (
    <ShadcnDialog open={Boolean(requests.length)}>
      <ShadcnDialogContent
        className={cn('pt-4 max-w-xs w-full')}
        aria-labelledby="oauth-req-dialog-title"
      >
        <main>
          <DialogHeader className="min-w-0" id="oauth-req-dialog-title">
            <ShadcnDialogTitle className="text-base font-semibold">
              {t('oauthRequestDialog.title')}
            </ShadcnDialogTitle>
            {authRedirect ? (
              <DialogDescription>
                {t('oauthRequestDialog.authRedirectTitle')}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="border-y border-border p-0">
            <ul className="divide-y divide-border">
              {requests.map(request => (
                <LoginRequestListItem
                  key={request.provider.title}
                  request={request}
                  busy={busy}
                  setBusy={setBusy}
                />
              ))}
            </ul>
          </div>
        </main>

        <DialogFooter className="py-4 px-0">
          <Button variant="ghost" onClick={handleRejectAll}>
            {t('oauthRequestDialog.rejectAll')}
          </Button>
        </DialogFooter>
      </ShadcnDialogContent>
    </ShadcnDialog>
  );
}
