export enum BuildStatus {
  Null,
  Success,
  Failure,
  Pending,
  Running,
}

export type Build = {
  commitId: string;
  message: string;
  status: BuildStatus;
  uri: string;
};

export type BuildDetails = {
  build: Build;
  author: string;
  logUrl: string;
  overviewUrl: string;
};
