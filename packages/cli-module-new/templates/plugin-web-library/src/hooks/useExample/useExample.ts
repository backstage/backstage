import { useEffect } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { toastApiRef } from '@backstage/frontend-plugin-api';

/**
 * Shows an example toast.
 *
 * @public
 */
export function useExample() {
  const toastApi = useApi(toastApiRef);

  useEffect(() => {
    toastApi.post({ title: 'Hello World!' });
  }, [toastApi]);
}
