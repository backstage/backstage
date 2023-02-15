import {
    OCTOPUS_DEPLOY_PROJECT_ID_ANNOTATION
} from '../constants';

import { Entity } from '@backstage/catalog-model';

export function getAnnotationFromEntity(entity: Entity): string {
    const annotation = entity.metadata.annotations?.[OCTOPUS_DEPLOY_PROJECT_ID_ANNOTATION];
    if (!annotation) {
        throw new Error('Value for annotation octopus.com/project-id was not found');
    }
    
    return annotation;
}