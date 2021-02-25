import { InputError } from '@backstage/backend-common';

export const parseRepoUrl = (repoUrl: string) => {
  let parsed;
  try {
    parsed = new URL(`https://${repoUrl}`);
  } catch (error) {
    throw new InputError(
      `Invalid repo URL passed to publisher, got ${repoUrl}, ${error}`,
    );
  }
  const host = parsed.host;
  const owner = parsed.searchParams.get('owner');

  if (!owner) {
    throw new InputError(
      `Invalid repo URL passed to publisher: ${repoUrl}, missing owner`,
    );
  }
  const repo = parsed.searchParams.get('repo');
  if (!repo) {
    throw new InputError(
      `Invalid repo URL passed to publisher: ${repoUrl}, missing repo`,
    );
  }

  return { host, owner, repo };
};
