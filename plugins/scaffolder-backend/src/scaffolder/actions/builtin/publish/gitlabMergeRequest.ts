import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { readFile } from 'fs-extra';
import { Gitlab } from '@gitbeaker/node';
import path from 'path';
import globby from 'globby';
import { CommitAction } from '@gitbeaker/core/dist/types/services/Commits';
import {  CreateMergeRequestOptions } from '@gitbeaker/core/dist/types/services/MergeRequests';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import { parseRepoUrl } from './util';

export type GitlabMergeRequestActionInput = {
	projectid: string;
	repoUrl: string;
	title: string;
	description: string;
	destinationBranch: string;
	destinationDir: string;
  };

export const createPublishGitlabMergeRequestAction = (options: {
	integrations: ScmIntegrationRegistry;
  }) => {
	const { integrations } = options;

	return createTemplateAction<GitlabMergeRequestActionInput>({
	  id: 'publish:gitlab-merge-request',
	  schema: {
		input: {
		  required: ['projectid', 'repoUrl', 'destinationDir'],
		  type: 'object',
		  properties: {
			repoUrl: {
				type: 'string',
				title: 'Repository Location',
			},
			projectid: {
			  type: 'string',
			  title: 'projectid',
			  description: 'Project ID of the Gitlab Project',
			},
			title: {
				type: 'string',
				title: 'Merge Request Name',
				description: 'The name for the merge request',
			  },
			description: {
				type: 'string',
				title: 'Merge Request Description',
				description: 'The description of the merge request',
			  },
			destinationBranch: {
				type: 'string',
				title: 'Destination Branch name',
				description: 'The description of the merge request',
			},
			destinationDir: {
				type: 'string',
				title: 'Backstage destinationDir name',
			}
		  },
		},
		output: {
			type: 'object',
			properties: {
			  projectid : {
				title: 'Gitlab Project id',
				type: 'string',
			  },
			  mergeRequestURL: {
				title: 'MergeRequest(MR) URL',
				type: 'string',
			  },
			},
		  },
	},
	  async handler(ctx) {
		const repoUrl  = ctx.input.repoUrl;
		const { host } = parseRepoUrl(repoUrl, integrations);
		const integrationConfig = integrations.gitlab.byHost(host);

		let actions: CommitAction[] = [];
		let mrOptions: CreateMergeRequestOptions = {};
		const formatedTimestamp = ()=> {
			const d = new Date()
			const date = d.toISOString().split('T')[0];
			const time = d.toTimeString().split(' ')[0].replace(/:/g, "_");
			return `${date}_${time}`
		}
		let destinationBranch = ctx.input.destinationBranch? ctx.input.destinationBranch + formatedTimestamp(): "backstage_" + formatedTimestamp();

		if (!integrationConfig) {
		  throw new InputError(
			`No matching integration configuration for host ${host}, please check your integrations config`,
		  );
		}

		if (!integrationConfig.config.token) {
		  throw new InputError(`No token available for host ${host}`);
		}

		const api = new Gitlab({
		  host: integrationConfig.config.baseUrl,
		  token: integrationConfig.config.token,
		});

		const fileRoot = ctx.workspacePath;
		const localFilePaths = await globby([ctx.input.destinationDir + '/**'], {
			cwd: fileRoot,
			gitignore: true,
			dot: true,
		});

        const fileContents = await Promise.all(
			localFilePaths.map(p => readFile(path.resolve(fileRoot, p))),
		);

		const repoFilePaths = localFilePaths.map(repoFilePath => {
			return repoFilePath;
		  });

		for(var i=0; i<repoFilePaths.length;i++) {
			actions.push({ action:'create', filePath:repoFilePaths[i], content: fileContents[i].toString()});
		}


		//TODO: add timestamp to the new branch name create-branchname-timestamp
		let defaultBranch: any = await api.Projects.show(ctx.input.projectid).then((projectJSON) => {
			return projectJSON?.default_branch;
		});

		try {
			await api.Branches.create(ctx.input.projectid, destinationBranch, defaultBranch).then((branchResponse) => {
					return branchResponse;
			});
		} catch(e) {
			throw new InputError(`The branch creation failed ` + e);
		}

		try {
			await api.Commits.create(ctx.input.projectid, destinationBranch, ctx.input.title, actions);
		} catch(e) {
			throw new InputError(`Commiting the changes to ` + destinationBranch + ` failed ` + e);
		}

		try {
			let mergeRequestUrl: any = await api.MergeRequests.create(ctx.input.projectid, destinationBranch, defaultBranch, ctx.input.title, { description: ctx.input.description }).then((mergeRequest) => {
		  		return mergeRequest.web_url
			});
			ctx.output('projectid', ctx.input.projectid);
			ctx.output('mergeRequestUrl', mergeRequestUrl);
		}
		catch(e) {
			throw new InputError(`Creation of the MergeRequest in Gitlab failed.` + e);
		}
	},
	});
};