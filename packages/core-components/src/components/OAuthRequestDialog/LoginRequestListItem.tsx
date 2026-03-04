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

import { useState } from 'react';
import { isError } from '@backstage/errors';
import {
  configApiRef,
  PendingOAuthRequest,
  useApi,
} from '@backstage/core-plugin-api';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export type LoginRequestListItemClassKey = 'root';

type RowProps = {
  request: PendingOAuthRequest;
  busy: boolean;
  setBusy: (busy: boolean) => void;
};

const LoginRequestListItem = ({ request, busy, setBusy }: RowProps) => {
  const [error, setError] = useState<string>();
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  const configApi = useApi(configApiRef);

  const handleContinue = async () => {
    setBusy(true);
    try {
      await request.trigger();
    } catch (e) {
      setError(isError(e) ? e.message : 'An unspecified error occurred');
    } finally {
      setBusy(false);
    }
  };

  const IconComponent = request.provider.icon;
  const message =
    request.provider.message ??
    t('oauthRequestDialog.message', {
      appTitle: configApi.getString('app.title'),
      provider: request.provider.title,
    });

  return (
    <li
      className={cn(
        'flex items-center gap-3 pl-4 pr-4 py-3',
        busy && 'opacity-50 pointer-events-none',
      )}
      data-disabled={busy || undefined}
    >
      <div className="flex-shrink-0">
        <IconComponent fontSize="large" />
      </div>
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-foreground">
            {request.provider.title}
          </span>
          {message && (
            <span className="block text-sm text-muted-foreground">
              {message}
            </span>
          )}
          {error && (
            <span className="block text-sm text-destructive">{error}</span>
          )}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleContinue}
          disabled={busy}
          className="ml-4 shrink-0"
        >
          {t('oauthRequestDialog.login')}
        </Button>
      </div>
    </li>
  );
};

export default LoginRequestListItem;
