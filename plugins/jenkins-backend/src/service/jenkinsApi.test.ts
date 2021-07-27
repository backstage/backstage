/*
 * Copyright 2021 Spotify AB
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
import { JenkinsApiImpl } from './jenkinsApi';
import jenkins from 'jenkins';
import { JenkinsInfo } from './jenkinsInfoProvider';
import { JenkinsBuild, JenkinsProject } from '../types';

jest.mock('jenkins');
const mockedJenkinsClient = {
  job: {
    get: jest.fn(),
    build: jest.fn(),
  },
  build: {
    get: jest.fn(),
  },
};
const mockedJenkins = jenkins as jest.Mocked<any>;
mockedJenkins.mockReturnValue(mockedJenkinsClient);

const jobFullName = 'example-jobName/foo';
const buildNumber = 19;
const jenkinsInfo: JenkinsInfo = {
  baseUrl: 'https://jenkins.example.com',
  headers: { headerName: 'headerValue' },
  jobFullName: 'example-jobName',
};

describe('JenkinsApi', () => {
  const jenkinsApi = new JenkinsApiImpl();

  describe('getProjects', () => {
    const project: JenkinsProject = {
      actions: [],
      displayName: 'Example Build',
      fullDisplayName: 'Example jobName » Example Build',
      fullName: 'example-jobName/exampleBuild',
      inQueue: false,
      lastBuild: {
        actions: [],
        timestamp: 1,
        building: false,
        duration: 10,
        result: 'success',
        displayName: '#7',
        fullDisplayName: 'Example jobName » Example Build #7',
        url: 'https://jenkins.example.com/job/example-jobName/job/exampleBuild',
        number: 7,
      },
    };

    describe('unfiltered', () => {
      it('standard github layout', async () => {
        mockedJenkinsClient.job.get.mockResolvedValueOnce({ jobs: [project] });

        const result = await jenkinsApi.getProjects(jenkinsInfo);

        expect(mockedJenkins).toHaveBeenCalledWith({
          baseUrl: jenkinsInfo.baseUrl,
          headers: jenkinsInfo.headers,
          promisify: true,
        });
        expect(mockedJenkinsClient.job.get).toBeCalledWith({
          name: jenkinsInfo.jobFullName,
          tree: expect.anything(),
        });
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          actions: [],
          displayName: 'Example Build',
          fullDisplayName: 'Example jobName » Example Build',
          fullName: 'example-jobName/exampleBuild',
          inQueue: false,
          lastBuild: {
            actions: [],
            timestamp: 1,
            building: false,
            duration: 10,
            result: 'success',
            displayName: '#7',
            fullDisplayName: 'Example jobName » Example Build #7',
            url:
              'https://jenkins.example.com/job/example-jobName/job/exampleBuild',
            number: 7,
            status: 'success',
            source: {},
          },
          status: 'success',
        });
      });
    });
    describe('filtered by branch', () => {
      it('standard github layout', async () => {
        mockedJenkinsClient.job.get.mockResolvedValueOnce(project);

        const result = await jenkinsApi.getProjects(
          jenkinsInfo,
          'testBranchName',
        );

        expect(mockedJenkins).toHaveBeenCalledWith({
          baseUrl: jenkinsInfo.baseUrl,
          headers: jenkinsInfo.headers,
          promisify: true,
        });
        expect(mockedJenkinsClient.job.get).toBeCalledWith({
          name: `${jenkinsInfo.jobFullName}/testBranchName`,
          tree: expect.anything(),
        });
        expect(result).toHaveLength(1);
      });
    });
    describe('augmented', () => {
      const projectWithScmActions: JenkinsProject = {
        actions: [
          {},
          {},
          {},
          {},
          {
            _class: 'jenkins.scm.api.metadata.ContributorMetadataAction',
            contributor: 'testuser',
            contributorDisplayName: 'Mr. T User',
            contributorEmail: null,
          },
          {},
          {
            _class: 'jenkins.scm.api.metadata.ObjectMetadataAction',
            objectDescription: '',
            objectDisplayName: 'Add LICENSE, CoC etc',
            objectUrl: 'https://github.com/backstage/backstage/pull/1',
          },
          {},
          {},
          {
            _class: 'com.cloudbees.plugins.credentials.ViewCredentialsAction',
            stores: {},
          },
        ],
        displayName: 'Example Build',
        fullDisplayName: 'Example jobName » Example Build',
        fullName: 'example-jobName/exampleBuild',
        inQueue: false,
        lastBuild: {
          actions: [
            {
              _class: 'hudson.model.CauseAction',
              causes: [
                {
                  _class: 'jenkins.branch.BranchIndexingCause',
                  shortDescription: 'Branch indexing',
                },
              ],
            },
            {},
            {},
            {},
            {
              _class: 'org.jenkinsci.plugins.workflow.cps.EnvActionImpl',
              environment: {},
            },
            {},
            {},
            {},
            {},
            {},
            {
              _class: 'hudson.plugins.git.util.BuildData',
              buildsByBranchName: {
                'PR-1': {
                  _class: 'hudson.plugins.git.util.Build',
                  buildNumber: 5,
                  buildResult: null,
                  marked: {
                    SHA1: '14d31bde346fcad64ab939f82d195db36701cfcb',
                    branch: [
                      {
                        SHA1: '14d31bde346fcad64ab939f82d195db36701cfcb',
                        name: 'PR-1',
                      },
                    ],
                  },
                  revision: {
                    SHA1: '6c6b34c0fb91cf077a01fe62d3e8e996b4ea5861',
                    branch: [
                      {
                        SHA1: '14d31bde346fcad64ab939f82d195db36701cfcb',
                        name: 'PR-1',
                      },
                    ],
                  },
                },
              },
              lastBuiltRevision: {
                SHA1: '6c6b34c0fb91cf077a01fe62d3e8e996b4ea5861',
                branch: [
                  {
                    SHA1: '14d31bde346fcad64ab939f82d195db36701cfcb',
                    name: 'PR-1',
                  },
                ],
              },
              remoteUrls: ['https://github.com/backstage/backstage.git'],
              scmName: '',
            },
            {
              _class: 'hudson.plugins.git.util.BuildData',
              buildsByBranchName: {
                master: {
                  _class: 'hudson.plugins.git.util.Build',
                  buildNumber: 5,
                  buildResult: null,
                  marked: {
                    SHA1: '14d31bde346fcad64ab939f82d195db36701cfcb',
                    branch: [
                      {
                        SHA1: '14d31bde346fcad64ab939f82d195db36701cfcb',
                        name: 'master',
                      },
                    ],
                  },
                  revision: {
                    SHA1: '6c6b34c0fb91cf077a01fe62d3e8e996b4ea5861',
                    branch: [
                      {
                        SHA1: '14d31bde346fcad64ab939f82d195db36701cfcb',
                        name: 'master',
                      },
                    ],
                  },
                },
              },
              lastBuiltRevision: {
                SHA1: '6c6b34c0fb91cf077a01fe62d3e8e996b4ea5861',
                branch: [
                  {
                    SHA1: '14d31bde346fcad64ab939f82d195db36701cfcb',
                    name: 'master',
                  },
                ],
              },
              remoteUrls: ['https://github.com/backstage/backstage.git'],
              scmName: '',
            },
            {},
            {},
            {
              _class: 'hudson.tasks.junit.TestResultAction',
              failCount: 2,
              skipCount: 1,
              totalCount: 635,
              urlName: 'testReport',
            },
            {},
            {},
            {
              _class:
                'org.jenkinsci.plugins.pipeline.modeldefinition.actions.RestartDeclarativePipelineAction',
              restartEnabled: false,
              restartableStages: [],
            },
            {},
          ],
          timestamp: 1,
          building: false,
          duration: 10,
          result: 'success',
          displayName: '#7',
          fullDisplayName: 'Example jobName » Example Build #7',
          url:
            'https://jenkins.example.com/job/example-jobName/job/exampleBuild/7/',
          number: 7,
        },
      };

      it('augments project', async () => {
        mockedJenkinsClient.job.get.mockResolvedValueOnce({
          jobs: [projectWithScmActions],
        });

        const result = await jenkinsApi.getProjects(jenkinsInfo);

        expect(result).toHaveLength(1);
        expect(result[0].status).toEqual('success');
      });
      it('augments  build', async () => {
        mockedJenkinsClient.job.get.mockResolvedValueOnce({
          jobs: [projectWithScmActions],
        });

        const result = await jenkinsApi.getProjects(jenkinsInfo);

        expect(result).toHaveLength(1);
        // TODO: I am really just asserting the previous behaviour wth no understanding here.
        // In my 2 Jenkins instances, 1 returns a lot of different and confusing BuildData sections and 1 returns none ☹️
        expect(result[0].lastBuild.source).toEqual({
          branchName: 'master',
          commit: {
            hash: '14d31bde',
          },
          url: 'https://github.com/backstage/backstage/pull/1',
          displayName: 'Add LICENSE, CoC etc',
          author: 'Mr. T User',
        });
      });
      it('finds test report', async () => {
        mockedJenkinsClient.job.get.mockResolvedValueOnce({
          jobs: [projectWithScmActions],
        });

        const result = await jenkinsApi.getProjects(jenkinsInfo);

        expect(result).toHaveLength(1);
        expect(result[0].lastBuild.tests).toEqual({
          total: 635,
          passed: 632,
          skipped: 1,
          failed: 2,
          testUrl:
            'https://jenkins.example.com/job/example-jobName/job/exampleBuild/7/testReport/',
        });
      });
    });
  });
  it('getBuild', async () => {
    const project: JenkinsProject = {
      actions: [],
      displayName: 'Example Build',
      fullDisplayName: 'Example jobName » Example Build',
      fullName: 'example-jobName/exampleBuild',
      inQueue: false,
      lastBuild: {
        actions: [],
        timestamp: 1,
        building: false,
        duration: 10,
        result: 'success',
        displayName: '#7',
        fullDisplayName: 'Example jobName » Example Build #7',
        url: 'https://jenkins.example.com/job/example-jobName/job/exampleBuild',
        number: 7,
      },
    };
    const build: JenkinsBuild = {
      actions: [],
      timestamp: 1,
      building: false,
      duration: 10,
      result: 'success',
      fullDisplayName: 'example-jobName/exampleBuild',
      displayName: 'exampleBuild',
      url: `https://jenkins.example.com/job/example-jobName/job/exampleBuild/build/${buildNumber}`,
      number: buildNumber,
    };
    mockedJenkinsClient.job.get.mockResolvedValueOnce(project);
    mockedJenkinsClient.build.get.mockResolvedValueOnce(build);

    await jenkinsApi.getBuild(jenkinsInfo, jobFullName, buildNumber);

    expect(mockedJenkins).toHaveBeenCalledWith({
      baseUrl: jenkinsInfo.baseUrl,
      headers: jenkinsInfo.headers,
      promisify: true,
    });
    expect(mockedJenkinsClient.job.get).toBeCalledWith({
      name: jobFullName,
      depth: 1,
    });
    expect(mockedJenkinsClient.build.get).toBeCalledWith(
      jobFullName,
      buildNumber,
    );
  });
  it('buildProject', async () => {
    await jenkinsApi.buildProject(jenkinsInfo, jobFullName);

    expect(mockedJenkins).toHaveBeenCalledWith({
      baseUrl: jenkinsInfo.baseUrl,
      headers: jenkinsInfo.headers,
      promisify: true,
    });
    expect(mockedJenkinsClient.job.build).toBeCalledWith(jobFullName);
  });
});
