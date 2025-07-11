import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import * as yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Create a simple issue',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:issues:create',
          name: 'Create issue',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            title: 'Bug report',
            body: 'Found a bug that needs to be fixed',
          },
        },
      ],
    }),
  },
  {
    description: 'Create an issue with labels and assignees',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:issues:create',
          name: 'Create issue with metadata',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            title: 'Feature request',
            body: 'This is a new feature request',
            labels: ['enhancement', 'needs-review'],
            assignees: ['octocat'],
            milestone: 1,
          },
        },
      ],
    }),
  },
  {
    description: 'Create an issue with specific token',
    example: yaml.stringify({
      steps: [
        {
          action: 'github:issues:create',
          name: 'Create issue with token',
          input: {
            repoUrl: 'github.com?repo=repo&owner=owner',
            title: 'Documentation update',
            body: 'Update the documentation for the new API',
            labels: ['documentation'],
            token: 'gph_YourGitHubToken',
          },
        },
      ],
    }),
  },
];
