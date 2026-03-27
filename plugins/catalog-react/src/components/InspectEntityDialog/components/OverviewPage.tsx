/*
 * Copyright 2022 The Backstage Authors
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

import { AlphaEntity } from '@backstage/catalog-model/alpha';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { EntityRefLink } from '../../EntityRefLink';
import {
  Container,
  HelpIcon,
  KeyValueListItem,
  ListItemText,
  ListSubheader,
} from './common';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { CopyTextButton } from '@backstage/core-components';
import { catalogReactTranslationRef } from '../../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

export function OverviewPage(props: { entity: AlphaEntity }) {
  const {
    apiVersion,
    kind,
    metadata,
    spec,
    relations = [],
    status = {},
  } = props.entity;

  const groupedRelations = groupBy(
    sortBy(relations, r => r.targetRef),
    'type',
  );
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const entityRef = stringifyEntityRef(props.entity);
  return (
    <>
      <h2 className="text-2xl font-semibold">
        {t('inspectEntityDialog.overviewPage.title')}
      </h2>
      <div className="flex flex-col">
        <Container title={t('inspectEntityDialog.overviewPage.identity.title')}>
          <ul className="space-y-1">
            <li className="px-2 py-1 flex items-center">
              <ListItemText primary="apiVersion" secondary={apiVersion} />
            </li>
            <li className="px-2 py-1 flex items-center">
              <ListItemText primary="kind" secondary={kind} />
            </li>
            {spec?.type && (
              <li className="px-2 py-1 flex items-center">
                <ListItemText
                  primary="spec.type"
                  secondary={spec.type?.toString()}
                />
              </li>
            )}
            {metadata.uid && (
              <li className="px-2 py-1 flex items-center">
                <ListItemText primary="uid" secondary={metadata.uid} />
                <div className="ml-auto">
                  <CopyTextButton text={metadata.uid} />
                </div>
              </li>
            )}
            {metadata.etag && (
              <li className="px-2 py-1 flex items-center">
                <ListItemText primary="etag" secondary={metadata.etag} />
                <div className="ml-auto">
                  <CopyTextButton text={metadata.etag} />
                </div>
              </li>
            )}
            <li className="px-2 py-1 flex items-center">
              <ListItemText primary="entityRef" secondary={entityRef} />
              <div className="ml-auto">
                <CopyTextButton text={entityRef} />
              </div>
            </li>
          </ul>
        </Container>

        <Container title={t('inspectEntityDialog.overviewPage.metadata.title')}>
          {!!Object.keys(metadata.annotations || {}).length && (
            <div>
              <ListSubheader>
                {t('inspectEntityDialog.overviewPage.annotations')}
                <HelpIcon to="https://backstage.io/docs/features/software-catalog/well-known-annotations" />
              </ListSubheader>
              <ul className="space-y-1">
                {Object.entries(metadata.annotations!).map(entry => (
                  <KeyValueListItem key={entry[0]} indent entry={entry} />
                ))}
              </ul>
            </div>
          )}
          {!!Object.keys(metadata.labels || {}).length && (
            <div>
              <ListSubheader>
                {t('inspectEntityDialog.overviewPage.labels')}
              </ListSubheader>
              <ul className="space-y-1">
                {Object.entries(metadata.labels!).map(entry => (
                  <KeyValueListItem key={entry[0]} indent entry={entry} />
                ))}
              </ul>
            </div>
          )}
          {!!metadata.tags?.length && (
            <div>
              <ListSubheader>
                {t('inspectEntityDialog.overviewPage.tags')}
              </ListSubheader>
              <ul className="space-y-1">
                {metadata.tags.map((tag, index) => (
                  <li
                    key={`${tag}-${index}`}
                    className="px-2 py-1 flex items-center"
                  >
                    <span className="mr-2 w-6 shrink-0" />
                    <ListItemText primary={tag} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>

        {!!relations.length && (
          <Container
            title={t('inspectEntityDialog.overviewPage.relation.title')}
            helpLink="https://backstage.io/docs/features/software-catalog/well-known-relations"
          >
            {Object.entries(groupedRelations).map(
              ([type, groupRelations], index) => (
                <div key={index}>
                  <ListSubheader>{type}</ListSubheader>
                  <ul className="space-y-1">
                    {groupRelations.map(group => (
                      <li
                        key={group.targetRef}
                        className="px-2 py-1 flex items-center"
                      >
                        <ListItemText
                          primary={
                            <EntityRefLink entityRef={group.targetRef} />
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </Container>
        )}

        {!!status.items?.length && (
          <Container
            title={t('inspectEntityDialog.overviewPage.status.title')}
            helpLink="https://backstage.io/docs/features/software-catalog/well-known-statuses"
          >
            {status.items.map((item, index) => (
              <div key={index}>
                <p className="text-sm font-medium">
                  {item.level}: {item.type}
                </p>
                <div className="ml-2">{item.message}</div>
              </div>
            ))}
          </Container>
        )}
      </div>
    </>
  );
}
