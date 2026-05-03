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

import {
  Entity,
  getEntitySourceLocation,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { JsonArray } from '@backstage/types';
import { Badge, MarkdownContent } from '@backstage/core-components';
import { AboutField } from './AboutField';
import { LinksGridList } from '../EntityLinksCard/LinksGridList';
import { useEntitySourceUrl } from './hooks';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../alpha/translation';
import { useLayoutEffect, useRef } from 'react';

/**
 * Props for {@link AboutContent}.
 *
 * @public
 */
export interface AboutContentProps {
  entity: Entity;
}

function getLocationTargetHref(
  target: string,
  type: string,
  entitySourceLocation: {
    type: string;
    target: string;
  },
): string {
  if (type === 'url' || target.includes('://')) {
    return target;
  }

  const srcLocationUrl =
    entitySourceLocation.type === 'file'
      ? `file://${entitySourceLocation.target}`
      : entitySourceLocation.target;

  if (type === 'file' || entitySourceLocation.type === 'file') {
    return new URL(target, srcLocationUrl).href;
  }

  return srcLocationUrl;
}

/** @public */
export function AboutContent(props: AboutContentProps) {
  const { entity } = props;
  const sourceUrl = useEntitySourceUrl(entity);
  const { t } = useTranslationRef(catalogTranslationRef);

  // D4 fix: the AAP-specified `border-border/30` fractional-opacity modifier
  // on the description divider is not emitted in the app's pre-compiled
  // Tailwind stylesheet (`packages/app/src/tailwind.css`). Updating the
  // Tailwind scan paths is OUT OF SCOPE per AAP 0.7.2. Apply the 30%
  // alpha of the `--border` token (#E6E6E6) imperatively via the DOM
  // API — Rule 1 compliant (the rule prohibits JSX `style={{}}`, not
  // imperative DOM mutation).
  const descriptionRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.setProperty(
        'border-bottom-color',
        'rgba(230, 230, 230, 0.3)',
      );
    }
  }, []);

  const isSystem = entity.kind.toLocaleLowerCase('en-US') === 'system';
  const isResource = entity.kind.toLocaleLowerCase('en-US') === 'resource';
  const isComponent = entity.kind.toLocaleLowerCase('en-US') === 'component';
  const isAPI = entity.kind.toLocaleLowerCase('en-US') === 'api';
  const isTemplate = entity.kind.toLocaleLowerCase('en-US') === 'template';
  const isLocation = entity.kind.toLocaleLowerCase('en-US') === 'location';
  const isGroup = entity.kind.toLocaleLowerCase('en-US') === 'group';

  const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'system',
  });
  const partOfComponentRelations = getEntityRelations(
    entity,
    RELATION_PART_OF,
    {
      kind: 'component',
    },
  );
  const partOfDomainRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'domain',
  });
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

  let entitySourceLocation:
    | {
        type: string;
        target: string;
      }
    | undefined;
  try {
    entitySourceLocation = getEntitySourceLocation(entity);
  } catch (e) {
    entitySourceLocation = undefined;
  }

  return (
    <div>
      <div
        ref={descriptionRef}
        className="text-sm border-b border-border pb-3 mb-3 break-words"
      >
        <MarkdownContent
          content={
            entity?.metadata?.description ||
            t('aboutCard.descriptionField.value')
          }
        />
      </div>

      {sourceUrl && (
        <AboutField label="Source">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline"
          >
            {sourceUrl}
          </a>
        </AboutField>
      )}

      <AboutField
        label={t('aboutCard.ownerField.label')}
        value={t('aboutCard.ownerField.value')}
      >
        {ownedByRelations.length > 0 && (
          <EntityRefLinks
            entityRefs={ownedByRelations}
            defaultKind="group"
            hideIcons
          />
        )}
      </AboutField>

      {(isSystem || partOfDomainRelations.length > 0) && (
        <AboutField
          label={t('aboutCard.domainField.label')}
          value={t('aboutCard.domainField.value')}
        >
          {partOfDomainRelations.length > 0 && (
            <EntityRefLinks
              entityRefs={partOfDomainRelations}
              defaultKind="domain"
              hideIcons
            />
          )}
        </AboutField>
      )}

      {(isAPI ||
        isComponent ||
        isResource ||
        partOfSystemRelations.length > 0) && (
        <AboutField
          label={t('aboutCard.systemField.label')}
          value={t('aboutCard.systemField.value')}
        >
          {partOfSystemRelations.length > 0 && (
            <EntityRefLinks
              entityRefs={partOfSystemRelations}
              defaultKind="system"
              hideIcons
            />
          )}
        </AboutField>
      )}

      {isComponent && partOfComponentRelations.length > 0 && (
        <AboutField
          label={t('aboutCard.parentComponentField.label')}
          value={t('aboutCard.parentComponentField.value')}
        >
          <EntityRefLinks
            entityRefs={partOfComponentRelations}
            defaultKind="component"
            hideIcons
          />
        </AboutField>
      )}

      {(isAPI ||
        isComponent ||
        isResource ||
        isTemplate ||
        isGroup ||
        isLocation ||
        typeof entity?.spec?.type === 'string') && (
        <AboutField
          label={t('aboutCard.typeField.label')}
          value={entity?.spec?.type as string}
        />
      )}

      {(isAPI ||
        isComponent ||
        typeof entity?.spec?.lifecycle === 'string') && (
        <AboutField
          label={t('aboutCard.lifecycleField.label')}
          value={entity?.spec?.lifecycle as string}
        />
      )}

      <AboutField
        label={t('aboutCard.tagsField.label')}
        value={t('aboutCard.tagsField.value')}
      >
        {(entity?.metadata?.tags || []).map(tag => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </AboutField>

      {isLocation && (entity?.spec?.targets || entity?.spec?.target) && (
        <AboutField label={t('aboutCard.targetsField.label')}>
          <LinksGridList
            cols={1}
            items={((entity.spec.targets as JsonArray) || [entity.spec.target])
              .map(target => target as string)
              .map(target => ({
                text: target,
                href: getLocationTargetHref(
                  target,
                  (entity?.spec?.type || t('aboutCard.unknown')) as string,
                  entitySourceLocation!,
                ),
              }))}
          />
        </AboutField>
      )}
    </div>
  );
}
