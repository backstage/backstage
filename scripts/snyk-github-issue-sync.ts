/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Octokit } from '@octokit/rest';
// The GitHub workflow .github/workflows/
import syncJsonOutput from '../snyk.json';

type Vulnerability = {
  description: string;
  id: string;
  packages: Set<string>;
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const fetchSnykGithubIssueMap = async (): Promise<Record<string, number>> => {
  const snykGithubIssueMap: Record<string, number> = {};

  const iterator = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
    owner: 'backstage',
    repo: 'backstage',
    per_page: 100,
    labels: 'snyk',
  });

  for await (const { data: issues } of iterator) {
    for (const issue of issues) {
      const match = /\([([A-Z0-9-]+)\])/.exec(issue.title);

      if (match && match[1]) {
        snykGithubIssueMap[match[1]] = issue.id;
      }
    }
  }

  return snykGithubIssueMap;
};

const createGithubIssue = (vulnerability: Vulnerability) => {
  console.log(
    `Create issue for vulnerability ${
      vulnerability.id
    } affecting packages ${Array.from(vulnerability.packages)}`,
  );
  // TODO(hhogg): Create github issue with the contents from a Snyk issue.
};

const updateGithubIssue = (
  githubIssueId: number,
  vulnerability: Vulnerability,
) => {
  console.log(
    `Update issue ${githubIssueId} for vulnerability ${vulnerability.id}`,
  );
  // TODO(hhogg): Update github issue with the contents from a Snyk issue.
};

const closeGithubIssue = (githubIssueId: number) => {
  console.log(`Delete issue ${githubIssueId}`);
  // TODO(hhogg): Delete a github issue
};

(async () => {
  const snykGithubIssueMap = await fetchSnykGithubIssueMap();
  const vulnerabilityStore: Record<string, Vulnerability> = {};

  // Group the Snyk vulnerabilities, and aggregate the affecting packages.
  syncJsonOutput.forEach(({ projectName, vulnerabilities }) => {
    vulnerabilities.forEach(
      ({ id, description }: { id: string; description: string }) => {
        if (id !== undefined && description !== undefined) {
          if (vulnerabilityStore[id]) {
            vulnerabilityStore[id].packages.add(projectName);
          } else {
            vulnerabilityStore[id] = {
              description,
              id,
              packages: new Set([projectName]),
            };
          }
        }
      },
    );
  });

  // Loop over the grouped vulnerabilities and create/update accordingly
  Object.entries(vulnerabilityStore).forEach(([id, vulnerability]) => {
    if (snykGithubIssueMap[id]) {
      updateGithubIssue(snykGithubIssueMap[id], vulnerability);
    } else {
      createGithubIssue(vulnerability);
    }
  });

  // Loop over the Github issues and delete accordingly.
  Object.entries(snykGithubIssueMap).forEach(([snykId, githubIssueId]) => {
    if (!snykGithubIssueMap[snykId]) {
      closeGithubIssue(githubIssueId);
    }
  });
})();
