import { useEntity } from '@backstage/plugin-catalog-react';
import { useReleases } from '../../hooks/useReleases';
import { getAnnotationFromEntity } from '../../utils/getAnnotationFromEntity';
import React from 'react';
import { ReleaseTable } from '../ReleaseTable';

export const EntityPageOctopusDeploy = (props: { defaultLimit?: number }) => {
    const { entity } = useEntity();

    const projectId = getAnnotationFromEntity(entity);

    const { environments, releases, loading, error } = useReleases(projectId, props.defaultLimit ?? 3);

    return <ReleaseTable environments={environments} releases={releases} loading={loading} error={error} />;
}