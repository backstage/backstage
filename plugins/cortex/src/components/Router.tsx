import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState } from '@backstage/core-components';
import { CortexDetailsPage } from './CortexDetailsPage';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { CORTEX_XDR_ANNOTATION } from '../constants';

export const isCortexAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[CORTEX_XDR_ANNOTATION]);

export const isRequiredType = (entity: Entity) => {
  const type = entity.spec?.type ?? '';
  const requiredTypes = useApi(configApiRef).getOptionalStringArray('cortex.allowedTypes');
  return requiredTypes?.includes(type as string) ?? true;
}


/** @public */
export const Router = () => {
  const { entity } = useEntity();
  if (!isCortexAvailable(entity)) {
    return (
      <MissingAnnotationEmptyState annotation={CORTEX_XDR_ANNOTATION} />
    );
  }

  if (!isRequiredType(entity)) {
    return (
      <MissingAnnotationEmptyState annotation={CORTEX_XDR_ANNOTATION} />
    );
  }
  return (
    <Routes>
      <Route path="/" element={<CortexDetailsPage />} />
    </Routes>
  );
};
