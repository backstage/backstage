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

import {
  Entity,
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  Alert,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { catalogApiRef } from '../../../api';
import { EntityRefLink } from '../../EntityRefLink';
import { KeyValueListItem, ListItemText } from './common';
import { catalogReactTranslationRef } from '../../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

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
          ? [{ [`metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`]: origin }]
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
  return (
    <ul className="space-y-1">
      {props.header && <KeyValueListItem key="header" entry={props.header} />}
      {props.entities.map(entity => (
        <li key={stringifyEntityRef(entity)} className="px-2 py-1">
          <ListItemText primary={<EntityRefLink entityRef={entity} />} />
        </li>
      ))}
    </ul>
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
      <Alert variant="warning">
        {t('inspectEntityDialog.colocatedPage.alertNoLocation')}
      </Alert>
    );
  } else if (!colocatedEntities?.length) {
    return (
      <Alert variant="info">
        {t('inspectEntityDialog.colocatedPage.alertNoEntity')}
      </Alert>
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
      <h2 className="text-2xl font-semibold">
        {t('inspectEntityDialog.colocatedPage.title')}
      </h2>
      <p className="text-muted-foreground">
        {t('inspectEntityDialog.colocatedPage.description')}
      </p>
      <div className="flex flex-col">
        <Contents entity={props.entity} />
      </div>
    </>
  );
}
