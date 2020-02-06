import { buildsV1 } from '@backstage/protobuf-definitions';
import { BuildStatus, Build, BuildDetails } from './types';

const statusTable = {
  [buildsV1.BuildStatus.NULL]: BuildStatus.Null,
  [buildsV1.BuildStatus.SUCCESS]: BuildStatus.Success,
  [buildsV1.BuildStatus.FAILURE]: BuildStatus.Failure,
  [buildsV1.BuildStatus.PENDING]: BuildStatus.Pending,
  [buildsV1.BuildStatus.RUNNING]: BuildStatus.Running,
};

export default class BuildsClient {
  static create(grpcAddress: string): BuildsClient {
    return new BuildsClient(new buildsV1.Client(grpcAddress));
  }

  constructor(private readonly client: buildsV1.Client) {}

  async listBuilds(entityUri: string): Promise<Build[]> {
    const req = new buildsV1.ListBuildsRequest();
    req.setEntityUri(entityUri);

    const res = await this.client.listBuilds(req);

    return res.getBuildsList().map(this.transformBuild);
  }

  async getBuild(buildUri: string): Promise<BuildDetails> {
    const req = new buildsV1.GetBuildRequest();
    req.setBuildUri(buildUri);

    const res = await this.client.getBuild(req);

    const build = res.getBuild();
    if (!build) {
      throw new Error('No build in GetBuild response');
    }
    const details = res.getDetails();
    if (!details) {
      throw new Error('No details in GetBuild response');
    }

    return {
      build: this.transformBuild(build),
      author: details.getAuthor(),
      logUrl: details.getLogUrl(),
      overviewUrl: details.getOverviewUrl(),
    };
  }

  private transformBuild = (build: buildsV1.Build): Build => {
    return {
      commitId: build.getCommitId(),
      message: build.getMessage(),
      status: statusTable[build.getStatus()] || BuildStatus.Null,
      uri: build.getUri(),
    };
  };
}
