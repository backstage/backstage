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

import {
  DashboardPullRequest,
  PullRequestOptions,
  Team,
  TeamMember,
} from '@backstage/plugin-azure-devops-common';

import { AzureDevOpsApi } from './AzureDevOpsApi';
import { Logger } from 'winston';
import limiterFactory from 'p-limit';

export class PullRequestsDashboardProvider {
  private teams = new Map<string, Team>();

  private teamMembers = new Map<string, TeamMember>();

  private constructor(
    private readonly logger: Logger,
    private readonly azureDevOpsApi: AzureDevOpsApi,
  ) {}

  public static async create(
    logger: Logger,
    azureDevOpsApi: AzureDevOpsApi,
  ): Promise<PullRequestsDashboardProvider> {
    const provider = new PullRequestsDashboardProvider(logger, azureDevOpsApi);
    return provider;
  }

  public async readTeams(): Promise<void> {
    this.logger.info('Reading teams.');

    let teams = await this.azureDevOpsApi.getAllTeams();

    // This is used to filter out the default Azure Devops project teams.
    teams = teams.filter(team =>
      team.name && team.projectName
        ? team.name !== `${team.projectName} Team`
        : true,
    );

    this.teams = new Map<string, Team>();
    this.teamMembers = new Map<string, TeamMember>();

    const limiter = limiterFactory(5);

    await Promise.all(
      teams.map(team =>
        limiter(async () => {
          const teamId = team.id;
          const projectId = team.projectId;

          if (teamId) {
            let teamMembers: TeamMember[] | undefined;

            if (projectId) {
              teamMembers = await this.azureDevOpsApi.getTeamMembers({
                projectId,
                teamId,
              });
            }

            if (teamMembers) {
              team.members = teamMembers.reduce((arr, teamMember) => {
                const teamMemberId = teamMember.id;

                if (teamMemberId) {
                  arr.push(teamMemberId);
                  const memberOf = [
                    ...(this.teamMembers.get(teamMemberId)?.memberOf ?? []),
                    teamId,
                  ];
                  this.teamMembers.set(teamMemberId, {
                    ...teamMember,
                    memberOf,
                  });
                }

                return arr;
              }, [] as string[]);

              this.teams.set(teamId, team);
            }
          }
        }),
      ),
    );
  }

  public async getDashboardPullRequests(
    projectName: string,
    options: PullRequestOptions,
  ): Promise<DashboardPullRequest[]> {
    const dashboardPullRequests =
      await this.azureDevOpsApi.getDashboardPullRequests(projectName, options);

    await this.getAllTeams(); // Make sure team members are loaded

    return dashboardPullRequests.map(pr => {
      if (pr.createdBy?.id) {
        const teamIds = this.teamMembers.get(pr.createdBy.id)?.memberOf;
        pr.createdBy.teamIds = teamIds;
        pr.createdBy.teamNames = teamIds?.map(
          teamId => this.teams.get(teamId)?.name ?? '',
        );
      }

      return pr;
    });
  }

  public async getUserTeamIds(email: string): Promise<string[]> {
    await this.getAllTeams(); // Make sure team members are loaded
    return (
      Array.from(this.teamMembers.values()).find(
        teamMember => teamMember.uniqueName === email,
      )?.memberOf ?? []
    );
  }

  public async getAllTeams(): Promise<Team[]> {
    if (!this.teams.size) {
      await this.readTeams();
    }

    return Array.from(this.teams.values());
  }
}
