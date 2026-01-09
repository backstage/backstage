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

import { useEffect } from 'react';
import { useApi, configApiRef, useAnalytics } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { ErrorPage } from '@backstage/core-components';
import { useTechDocsReaderPage } from '@backstage/plugin-techdocs-react';
import { useLocation } from 'react-router-dom';
import { techdocsTranslationRef } from '../../translation';

type Props = {
  errorMessage?: string;
};

export const TechDocsNotFound = ({ errorMessage }: Props) => {
  const techdocsBuilder =
    useApi(configApiRef).getOptionalString('techdocs.builder');
  const analyticsApi = useAnalytics();
  const { entityRef } = useTechDocsReaderPage();
  const location = useLocation();
  const { t } = useTranslationRef(techdocsTranslationRef);

  useEffect(() => {
    const { pathname, search, hash } = location;
    analyticsApi.captureEvent('not-found', `${pathname}${search}${hash}`, {
      attributes: entityRef,
    });
  }, [analyticsApi, entityRef, location]);

  let additionalInfo = '';
  if (![undefined, 'local'].includes(techdocsBuilder)) {
    additionalInfo = t('notFound.builderNote');
  }

  return (
    <ErrorPage
      status="404"
      statusMessage={errorMessage || t('notFound.title')}
      additionalInfo={additionalInfo}
    />
  );
};
