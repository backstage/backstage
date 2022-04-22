import { Octokit } from '@octokit/rest';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';

let octokit: any;

export const useOctokitGraphQl = <T>() => {
  const auth = useApi(githubAuthApiRef);

  return (path: string, options?: any): Promise<T> =>
    auth.getAccessToken(['repo'])
      .then((token: string) => {
        if(!octokit) {
          octokit = new Octokit({ auth: token })
        }

        return octokit
      })
      .then(octokitInstance => {
        return octokitInstance.graphql(path, options)
      });
};
