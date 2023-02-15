import { useApi } from "@backstage/core-plugin-api";
import useAsync from "react-use/lib/useAsync";
import { octopusDeployApiRef, OctopusEnvironment, OctopusReleaseProgression } from "../api";

export function useReleases(
    projectId: string,
    releaseHistoryCount: number
): {
    environments?: OctopusEnvironment[],
    releases?: OctopusReleaseProgression[]
    loading: boolean;
    error?: Error;
} {
    const api = useApi(octopusDeployApiRef);
    
    const { value, loading, error } = useAsync(() => {
        return api.getReleaseProgression(projectId, releaseHistoryCount);
    }, [ api, projectId, releaseHistoryCount ]);

    return {
        environments: value?.Environments,
        releases: value?.Releases,
        loading,
        error
    };
}