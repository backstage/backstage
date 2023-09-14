import React from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { fianuApiRef } from '../../api';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  FIANU_BADGE_ANNOTATION,
  isFianuBadgeAvailable,
  getFianuBadge,
} from '../annotationHelpers';
import {
  MissingAnnotationEmptyState,
  Progress,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { Entity } from '@backstage/catalog-model';
  
const FianuReport = (props: { entity: Entity }) => {
  const fianuApi = useApi(fianuApiRef);

  const fianuBadge = getFianuBadge(props.entity);
  const { value, loading } = useAsync(async () => {
    const url = await fianuApi.getReportUrl(fianuBadge);
    return url;
  });

  if (loading) {
    return <Progress />;
  }
  return (
    <iframe
      style={{
        display: 'table',
        width: '100%',
        height: '100%',
        border: '0px'
      }}
      title="Fianu Badge"
      src={value}
    />
  );
};

export const FianuComponent = () => {
  const { entity } = useEntity();
  const isReportAvailable = entity && isFianuBadgeAvailable(entity);

  if (isReportAvailable) return <FianuReport entity={entity} />;
  return (
    <MissingAnnotationEmptyState annotation={FIANU_BADGE_ANNOTATION} />
  );  
};
