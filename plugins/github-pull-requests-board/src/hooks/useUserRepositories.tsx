import { useApi } from '@backstage/core-plugin-api';
import { useEntity, catalogApiRef } from '@backstage/plugin-catalog-react';
import { useCallback, useEffect, useState } from 'react';
import { getProjectNameFromEntity } from '../utils/functions';

export function useUserRepositories() {
  const { entity: teamEntity } = useEntity();
  const catalogApi = useApi(catalogApiRef);
  const [repositories, setRepositories] = useState<string[]>([]);

  const getRepositoriesNames = useCallback(async () => {
    const entitiesList = await catalogApi.getEntities({
      filter: {
        kind: 'Component',
        'spec.type': 'service',
        'spec.owner': teamEntity?.metadata?.name,
      },
    });

    const entitiesNames: string[] = entitiesList.items.map(componentEntity =>
      getProjectNameFromEntity(componentEntity)
    );

    setRepositories([...new Set(entitiesNames)]);
  }, [catalogApi, teamEntity?.metadata?.name]);

  useEffect(() => {
    getRepositoriesNames()
  }, [getRepositoriesNames]);

  return {
    repositories,
  };
}
