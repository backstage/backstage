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

import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Link } from '../../components/Link';
import { useSupportConfig } from '../../hooks';
import { MicDrop } from './MicDrop';
import { StackDetails } from './StackDetails';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

interface IErrorPageProps {
  status?: string;
  statusMessage: string;
  additionalInfo?: ReactNode;
  supportUrl?: string;
  stack?: string;
}

/** @public */
export type ErrorPageClassKey = 'container' | 'title' | 'subtitle';

/**
 * Error page with status and description
 *
 * @public
 *
 */
export function ErrorPage(props: IErrorPageProps) {
  const {
    status = '',
    statusMessage,
    additionalInfo,
    supportUrl,
    stack,
  } = props;
  const navigate = useNavigate();
  const support = useSupportConfig();
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  return (
    <div className={cn('p-16 max-sm:p-4 flex flex-col sm:flex-row flex-wrap')}>
      <div className="w-full sm:w-2/3 md:w-1/3">
        <p data-testid="error" className="text-muted-foreground">
          {t('errorPage.subtitle', { status, statusMessage })}
        </p>
        <p className="text-muted-foreground">{additionalInfo}</p>
        <h2
          className={cn('text-4xl font-bold pb-10 max-sm:pb-8 max-sm:text-2xl')}
        >
          {t('errorPage.title')}
        </h2>
        <h6
          className={cn(
            'text-base font-semibold pb-10 max-sm:pb-8 max-sm:text-2xl',
          )}
        >
          <Link to="#" data-testid="go-back-link" onClick={() => navigate(-1)}>
            {t('errorPage.goBack')}
          </Link>
          ... or please{' '}
          <Link to={supportUrl || support.url}>contact support</Link> if you
          think this is a bug.
        </h6>
        {stack && <StackDetails stack={stack} />}
      </div>
      <MicDrop />
    </div>
  );
}
