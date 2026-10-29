/*
 * Copyright 2026 The Backstage Authors
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
import { useLocation } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../alpha/translation';

export function EntityRenamedNotice(): JSX.Element | null {
  const location = useLocation();
  const { t } = useTranslationRef(catalogTranslationRef);
  const [dismissedRef, setDismissedRef] = useState<string>();

  const state = location.state as { formerEntityRef?: unknown } | null;
  const formerEntityRef =
    typeof state === 'object' &&
    state !== null &&
    typeof state.formerEntityRef === 'string' &&
    state.formerEntityRef
      ? state.formerEntityRef
      : undefined;

  if (!formerEntityRef || dismissedRef === formerEntityRef) {
    return null;
  }

  return (
    <Alert
      severity="info"
      onClose={() => setDismissedRef(formerEntityRef)}
      closeText={t('entityPage.renamedNoticeDismiss')}
    >
      {t('entityPage.renamedNotice', { formerEntityRef })}
    </Alert>
  );
}
