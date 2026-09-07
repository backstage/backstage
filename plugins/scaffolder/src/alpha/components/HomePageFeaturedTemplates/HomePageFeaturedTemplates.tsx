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

import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { useApi, useTranslationRef } from '@backstage/frontend-plugin-api';
import { useRouteRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  isTemplateEntityV1beta3,
  type TemplateEntityV1beta3,
} from '@backstage/plugin-scaffolder-common';
import { TemplateCard } from '@backstage/plugin-scaffolder-react/alpha';
import { Button, ButtonLink, Skeleton } from '@backstage/ui';
import { RiErrorWarningLine, RiShapesLine } from '@remixicon/react';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import { useNavigate } from 'react-router-dom';
import { rootRouteRef, selectedTemplateRouteRef } from '../../../routes';
import { scaffolderTranslationRef } from '../../../translation';
import styles from './HomePageFeaturedTemplates.module.css';
import { ScrollControls } from './ScrollControls';
import { StateMessage } from './StateMessage';

export interface HomePageFeaturedTemplatesProps {
  tag: string;
}

export function HomePageFeaturedTemplates({
  tag,
}: HomePageFeaturedTemplatesProps) {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const catalogApi = useApi(catalogApiRef);
  const selectedTemplateRoute = useRouteRef(selectedTemplateRouteRef);
  const templatesRoute = useRouteRef(rootRouteRef);
  const navigate = useNavigate();
  const [track, setTrack] = useState<HTMLDivElement | null>(null);
  const { ref: firstCardRef, inView: firstCardInView } = useInView({
    root: track,
    threshold: 0.99,
    initialInView: true,
  });
  const { ref: lastCardRef, inView: lastCardInView } = useInView({
    root: track,
    threshold: 0.99,
    initialInView: true,
  });
  const { loading, error, value, retry } = useAsyncRetry(
    () =>
      catalogApi.getEntities({
        filter: { kind: 'Template', 'metadata.tags': tag },
      }),
    [catalogApi, tag],
  );

  const templates = (value?.items ?? []).filter(isTemplateEntityV1beta3);

  const openTemplate = (template: TemplateEntityV1beta3) => {
    navigate(
      selectedTemplateRoute({
        namespace: template.metadata.namespace ?? DEFAULT_NAMESPACE,
        templateName: template.metadata.name,
      }),
    );
  };

  if (loading) {
    return (
      <div className={styles.root}>
        <div className={styles.track} role="list" aria-busy="true">
          {Array.from({ length: 3 }, (_, index) => (
            <div className={styles.card} role="listitem" key={index}>
              <Skeleton width="100%" height="100%" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <StateMessage
        icon={RiErrorWarningLine}
        message={t('featuredTemplatesWidget.errorMessage')}
      >
        <Button size="small" variant="secondary" onPress={retry}>
          {t('featuredTemplatesWidget.errorRetryButtonTitle')}
        </Button>
      </StateMessage>
    );
  }

  if (!templates.length) {
    return (
      <StateMessage
        icon={RiShapesLine}
        message={t('featuredTemplatesWidget.emptyMessage')}
      >
        <ButtonLink size="small" variant="secondary" href={templatesRoute()}>
          {t('featuredTemplatesWidget.emptyBrowseAllButtonTitle')}
        </ButtonLink>
      </StateMessage>
    );
  }

  return (
    <div className={styles.root}>
      <div ref={setTrack} className={styles.track} role="list">
        {templates.map((template, index) => (
          <div
            className={styles.card}
            role="listitem"
            key={stringifyEntityRef(template)}
            ref={element => {
              if (index === 0) firstCardRef(element);
              if (index === templates.length - 1) lastCardRef(element);
            }}
          >
            <TemplateCard
              template={template}
              onSelected={() => openTemplate(template)}
            />
          </div>
        ))}
      </div>
      {track && (
        <ScrollControls
          track={track}
          canScrollPrevious={!firstCardInView}
          canScrollNext={!lastCardInView}
        />
      )}
    </div>
  );
}
