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

// Native HTML elements like <p> and <header> are used intentionally for
// semantic markup. The react/forbid-elements rule predates the BUI migration.
/* eslint-disable react/forbid-elements */

import {
  Entity,
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Text, Alert } from '@backstage/ui';
import useAsync from 'react-use/esm/useAsync';
import { catalogApiRef } from '../../../api';
import { EntityRefLink } from '../../EntityRefLink';
import { makeStyles } from '@material-ui/core/styles';
import { ListSection, ListItemRow } from './common';

import { catalogReactTranslationRef } from '../../../translation';

import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

const useStyles = makeStyles({
  header: {
    paddingLeft: 'var(--bui-space-4)',
    marginTop: 'var(--bui-space-4)',
    marginBottom: 'var(--bui-space-4)',
  },
  headerLabel: {
    margin: 0,
    fontFamily: 'monospace',
    fontSize: 'var(--bui-font-size-3)',
    fontWeight: 'var(--bui-font-weight-regular)' as any,
  },
  entityList: {
    marginTop: 'var(--bui-space-4)',
  },
  headerValue: {
    margin: 0,
    marginTop: 'var(--bui-space-1)',
    fontFamily: 'monospace',
    fontSize: 'var(--bui-font-size-3)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

function useColocated(entity: Entity): {
  loading: boolean;
  error?: Error;
  location?: string;
  originLocation?: string;
  colocatedEntities?: Entity[];
} {
  const catalogApi = useApi(catalogApiRef);
  const currentEntityRef = stringifyEntityRef(entity);
  const location = entity.metadata.annotations?.[ANNOTATION_LOCATION];
  const origin = entity.metadata.annotations?.[ANNOTATION_ORIGIN_LOCATION];

  const { loading, error, value } = useAsync(async () => {
    if (!location && !origin) {
      return [];
    }
    const response = await catalogApi.getEntities({
      filter: [
        ...(location
          ? [{ [`metadata.annotations.${ANNOTATION_LOCATION}`]: location }]
          : []),
        ...(origin
          ? [
              {
                [`metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`]: origin,
              },
            ]
          : []),
      ],
    });
    return response.items;
  }, [location, origin]);

  return {
    loading,
    error,
    location,
    originLocation: origin,
    colocatedEntities: value?.filter(
      colocated => stringifyEntityRef(colocated) !== currentEntityRef,
    ),
  };
}

function EntityList(props: { entities: Entity[]; header?: [string, string] }) {
  const classes = useStyles();
  const { t } = useTranslationRef(catalogReactTranslationRef);
  return (
    <>
      {props.header && (
        <header className={classes.header}>
          <h4 className={classes.headerLabel}>{props.header[0]}</h4>
          <p className={classes.headerValue}>{props.header[1]}</p>
        </header>
      )}
      <ListSection
        aria-label={t('inspectEntityDialog.colocatedPage.entityListAriaLabel')}
        className={classes.entityList}
      >
        {props.entities.map(entity => (
          <ListItemRow key={stringifyEntityRef(entity)}>
            <EntityRefLink entityRef={entity} />
          </ListItemRow>
        ))}
      </ListSection>
    </>
  );
}

function Contents(props: { entity: Entity }) {
  const { entity } = props;
  const { t } = useTranslationRef(catalogReactTranslationRef);

  const { loading, error, location, originLocation, colocatedEntities } =
    useColocated(entity);
  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (!location && !originLocation) {
    return (
      <Alert
        status="warning"
        description={t('inspectEntityDialog.colocatedPage.alertNoLocation')}
        mt="4"
      />
    );
  } else if (!colocatedEntities?.length) {
    return (
      <Alert
        status="info"
        description={t('inspectEntityDialog.colocatedPage.alertNoEntity')}
        mt="4"
      />
    );
  }

  if (location === originLocation) {
    return <EntityList entities={colocatedEntities} />;
  }

  const atLocation = colocatedEntities.filter(
    e => e.metadata.annotations?.[ANNOTATION_LOCATION] === location,
  );
  const atOrigin = colocatedEntities.filter(
    e =>
      e.metadata.annotations?.[ANNOTATION_ORIGIN_LOCATION] === originLocation,
  );

  return (
    <>
      {atLocation.length > 0 && (
        <EntityList
          entities={atLocation}
          header={[
            t('inspectEntityDialog.colocatedPage.locationHeader'),
            location!,
          ]}
        />
      )}
      {atOrigin.length > 0 && (
        <EntityList
          entities={atOrigin}
          header={[
            t('inspectEntityDialog.colocatedPage.originHeader'),
            originLocation!,
          ]}
        />
      )}
    </>
  );
}

export function ColocatedPage(props: { entity: Entity }) {
  const { t } = useTranslationRef(catalogReactTranslationRef);
  return (
    <>
      <Text as="p">{t('inspectEntityDialog.colocatedPage.description')}</Text>
      <Contents entity={props.entity} />
    </>
  );
}
