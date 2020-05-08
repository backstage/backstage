import { circleCIApiRef } from 'api';
import { BuildSummary } from 'circleci-api';
import { CITableBuildInfo } from 'pages/BuildsPage/lib/CITable';

const makeReadableStatus = (status: string | undefined) => {
  if (typeof status === 'undefined') return '';
  return ({
    retried: 'Retried',
    canceled: 'Canceled',
    infrastructure_fail: 'Infra fail',
    timedout: 'Timedout',
    not_run: 'Not run',
    running: 'Running',
    failed: 'Failed',
    queued: 'Queued',
    scheduled: 'Scheduled',
    not_running: 'Not running',
    no_tests: 'No tests',
    fixed: 'Fixed',
    success: 'Success',
  } as Record<string, string>)[status];
};

export const transformBuildSummary = (
  _: typeof circleCIApiRef.T,
  buildData: BuildSummary,
) => {
  const tableBuildInfo: CITableBuildInfo = {
    id: String(buildData.build_num),
    buildName: buildData.subject
      ? buildData.subject +
        (buildData.retry_of ? ` (retry of #${buildData.retry_of})` : '')
      : '',
    onRetryClick: () => {}, //api.retry(String(buildData.build_num)),
    source: {
      branchName: String(buildData.branch),
      commit: {
        hash: String(buildData.vcs_revision),
        url: 'todo',
      },
    },
    status: makeReadableStatus(buildData.status),
    buildUrl: buildData.build_url,
    // tests: {
    //   failed: 0,
    //   passed: 10,
    //   skipped: 3,
    //   testUrl: 'nourlnow',
    //   total: 13,
    // },
  };
  return tableBuildInfo;
};

export const transformBuildSummaries = (
  buildsData: BuildSummary[],
  api: typeof circleCIApiRef.T,
): CITableBuildInfo[] => {
  return buildsData.map((buildSummary) =>
    transformBuildSummary(api, buildSummary),
  );
};
