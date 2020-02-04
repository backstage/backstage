import React from 'react';
import CPMClient from 'plugins/capacity/lib/CPMClient';
import TugApi from 'plugins/tugboat/lib/TugApi';

const CHECKED_COMPONENT_TYPES = ['service', 'website'];

async function fetchPoolInformation(roles: any): Promise<{ machineCount: number; hasUniqueRoles: boolean }> {
  try {
    // Only count roles that are unique to this service
    const uniqueRoles = roles.filter((role: any) => role.components.length < 2);

    const cortanaPools = (await CPMClient.getPools(uniqueRoles)) as { desired_capacity: number }[];

    const machineCount = cortanaPools.map(pool => pool.desired_capacity).reduce((sum, capacity) => sum + capacity, 0);

    return { machineCount, hasUniqueRoles: !!uniqueRoles.length };
  } catch (error) {
    throw new Error('Failed to fetch capacity information from cortana');
  }
}

async function fetchInstanceCount(tugboatApi: any, componentId: string): Promise<number> {
  try {
    const tugboatInstallations = await tugboatApi.installation.findByComponent(componentId);

    // Fetch instance statuses for each installation
    const instancesStatuses = (await Promise.all(
      tugboatInstallations.map((installation: any) => tugboatApi.installation.status(installation.id)),
    )) as { statuses: any[] }[];

    // Count running instances in all installations
    const instanceCount = instancesStatuses.reduce(
      (count, instance) => count + instance.statuses.filter(stat => stat.status.running).length,
      0,
    );

    return instanceCount;
  } catch (error) {
    throw new Error('Failed to fetch installation information from tugboat');
  }
}

type Params = {
  componentId: string;
  componentType: string;
  roles: any;
  tugboatApi: TugApi;
};

export default function useResourceChecker({ componentId, componentType, roles, tugboatApi }: Params) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [result, setResult] = React.useState({ instanceCount: 0, machineCount: 0, hasUniqueRoles: false });

  React.useEffect(() => {
    if (!CHECKED_COMPONENT_TYPES.includes(componentType)) {
      setLoading(false);
      return;
    }

    if (roles.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let didCancel = false;

    async function fetchCounts() {
      try {
        const [{ hasUniqueRoles, machineCount }, instanceCount] = await Promise.all([
          fetchPoolInformation(roles),
          fetchInstanceCount(tugboatApi, componentId),
        ]);

        if (!didCancel) {
          setResult({ instanceCount, machineCount, hasUniqueRoles });
          setLoading(false);
        }
      } catch (error) {
        if (!didCancel) {
          setError(error);
          setLoading(false);
        }
      }
    }

    fetchCounts();

    return () => {
      didCancel = true;
    };
  }, [componentType, componentId, roles, tugboatApi]);

  return [loading, error, result];
}
