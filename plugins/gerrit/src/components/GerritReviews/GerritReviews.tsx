import { Config } from '@backstage/config';
import {
  Content, Header,
  HeaderLabel, InfoCard, Link,
  OverflowTooltip, Page, Progress, Table, TableColumn,
  TableFilter, TableState
} from '@backstage/core-components';
import { configApiRef, discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { parseGerritJsonResponse, readGerritIntegrationConfig } from '@backstage/integration';
import { Box, Grid, IconButton } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import RemoveIcon from '@material-ui/icons/Remove';
import { Alert } from '@material-ui/lab';
import moment from 'moment';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { DenseTableProps, GerritChange, GerritReviewProps } from '../../GerritTypes';

export const showReviewers = (reviewers: any) => {
  if (reviewers.REVIEWER && reviewers.REVIEWER.length) {
    const transformedReviewList = reviewers.REVIEWER.map((d: any) => ` ${d.name}`).reduce((acc: Array<string>, currVal: string) => {
      if (!currVal.includes('eiffel') && !currVal.includes('CICD') ) {
         acc.push(currVal);
      }
      return acc;
    }, [])
    return transformedReviewList
  }
  return []
}

export const setGerritLabelValueAndName = (labels: any, check: string) => {
  let value = "-"
  let message = `${check}: No votes.`
  let icon: any = (<RemoveIcon style={{ color: 'lightgrey' }} />)
  if (labels[check] ) {
    if (labels[check].approved) {
      value = "+1";
      icon = (<CheckIcon style={{ color: 'green' }} />)
      message = `${check} by ${labels[check].approved.name}`
    }
    if (labels[check].rejected) {
      value = "-1";
      icon = (<ClearIcon style={{ color: 'red' }} />)
      message = `${check} by ${labels[check].rejected.name}`
    }
    if (check === "Code-Review") {
      if (labels[check].approved) {
        value = "+2";
        icon = (<CheckIcon style={{ color: 'green' }} />)
        message = `${check} by ${labels[check].approved.name}`
      }
      if (labels[check].recommended) {
        value = "+1";
        icon = value;
        message = `${check} by ${labels[check].recommended.name}`
      }
      if (labels[check].disliked) {
        value = "-1";
        icon = value;
        message = `${check} by ${labels[check].disliked.name}`
      }
      if (labels[check].rejected) {
        value = "-2";
        icon = (<ClearIcon style={{ color: 'red' }} />)
        message = `${check} by ${labels[check].rejected.name}`
      }
    }
  }
  return (
    { message, value, icon}
  )
}

const findRelatedJIRAs = (inputText: string): JSX.Element => {
  /*
  Description:
  Takes in a string and identifies all substrings that match Jira items,
  then adds them into a string array. The JSX.Element that is returned depends on the
  size of the array
  
  Prameters:
  inputText: string -> A string that may contain jira items
  
  Return:
  JSX.Element -> Either a empty JSK.Element, a link or list of links to jira's found
  */

  const extractSubstrings = (): string[] => {
    const jiraItemRegex = /[A-Z][A-Z0-9]+-(\d+)/g;
    const extractedData: any = [];

    const matches = inputText.match(jiraItemRegex);
    if (matches) {
      matches.forEach((match) => {
        if (!extractedData.includes(match)) {
          extractedData.push(match);
        }
      });
    }
    return extractedData;
  };
  const jiraBaseURL: string = "https://eteamproject.internal.ericsson.com/browse/"
  const extractedArray = extractSubstrings();
  if (extractedArray.length === 1)
    return (
      <Link to={`${jiraBaseURL}${extractedArray[0]}`}>
        <OverflowTooltip text={extractedArray[0]} title={extractedArray[0]}/>
      </Link>
    )
  if (extractedArray.length > 1)
    return (
      <div >
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {extractedArray.map((jira: string, index: any) => (
            <li key={index} style={{ padding: 0 }}>
              <Link to={`${jiraBaseURL}${jira}`}>
                <OverflowTooltip text={jira} title={jira}/>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  return (
    <div />
  )
};

export const getSize = (insertions: 0, deletions: 0) => {
  const changeCount = insertions + deletions
  let size = "-"
  switch (true) {
    case changeCount < 10:
      size = "XS"
      break;
    case changeCount >= 10 && changeCount < 50:
      size = "S"
      break;
    case changeCount >= 50 && changeCount < 250:
      size = "M"
      break;
    case changeCount >= 250 && changeCount < 1000:
      size = "L"
      break;
    default:
      size = "XL"
      break;
  }
  return (
    <OverflowTooltip text={size} title={`Added ${insertions}, Removed ${deletions} lines`} />
  )
}

export const DenseTable = ({ gerritChangesList, tableTitle, repoView }: DenseTableProps) => {
  const gerritConfigApiRef = useApi(configApiRef);
  const gerritConfig = getGerritConfig(gerritConfigApiRef);
  const { baseUrl, cloneUrl } = gerritConfig;

  // Define table column titles and mapping with gerritChange data
  const gerritChangeColumns: TableColumn[] = [
    {
      title: 'ID',
      field: 'id',
      width: '12ch',
      render: (gerritChange: any) => (
        <Link to={`${baseUrl}/c/${gerritChange.fullProject}/+/${gerritChange.id}`}>
          <OverflowTooltip text={gerritChange.id} />
        </Link>
      ),
    },
    {
      title: 'Subject',
      field: 'subject',
      width: '50ch',
      render: (gerritChange: any) => (
        <Link to={`${baseUrl}/c/${gerritChange.fullProject}/+/${gerritChange.id}`}>
          <OverflowTooltip text={gerritChange.subject} />
        </Link>
      ),
    },
    {
      title: 'Status',
      field: 'status',
      searchable: false,
      width: '12ch',
      render: (gerritChange: any) => (
        <OverflowTooltip text={gerritChange.status} />
      )
    },
    {
      title: 'Jira',
      field: 'relatedJIRAs',
      searchable: false,
      width: '10%',
    },
    {
      title: 'Owner',
      field: 'owner.name',
      searchable: false,
      width: '22ch',
      render: (gerritChange: any) => (
        <Link to={`${baseUrl}/q/owner:${gerritChange.owner._account_id}`}>
          <OverflowTooltip
            title={`Name: ${gerritChange.owner.name},
                    ID: ${gerritChange.owner.username},
                    eMail: ${gerritChange.owner.email}`}
            text={`${gerritChange.owner.name}`}
          />
        </Link>
      ),
    },
    {
      title: 'Reviewers',
      field: 'reviewers',
      tooltip: 'Reviewers excluding automated jobs',
      searchable: false,
      width: '16%',
      render: (gerritChange: any) => (
        <OverflowTooltip text={`${gerritChange.reviewers}`}/>
      )
    },
    {
      title: 'Project',
      field: 'project',
      hidden: repoView,
      tooltip: 'project',
      searchable: false,
      width: '15%',
      render: (gerritChange: any) => (
        <Link to={`${baseUrl}/admin/repos/${gerritChange.fullProject}`}>
          <OverflowTooltip
            title={gerritChange.fullProject}
            text={gerritChange.project}/>
        </Link>
      ),
    },
    {
      title: 'Branch',
      field: 'branch',
      searchable: false,
      width: '13%',
      render: (gerritChange: any) => (
        <Link to={`${baseUrl}/plugins/gitiles/${gerritChange.fullProject}/+/refs/heads/${gerritChange.branch}`}>
          <OverflowTooltip text={gerritChange.branch}/>
        </Link>
      ),
    },
    {
      title: 'Created',
      field: 'created',
      type: 'datetime',
      searchable: false,
      width: '10%',
      render: (gerritChange: any) => (
        <OverflowTooltip text={`${gerritChange.created}`}/>
      )
    },
    {
      title: 'Updated',
      field: 'updated',
      type: 'datetime',
      searchable: false,
      width: '10%',
      render: (gerritChange: any) => (
        <OverflowTooltip text={`${gerritChange.updated}`}/>
      )
    },
    {
      title: 'Size',
      field: 'size',
      searchable: false,
      width: '5%',
    },
    {
      title: 'CC/UCC',
      tooltip: 'Comment Count / Unresolved Comment Count',
      searchable: false,
      width: '5%',
      render: (gerritChange: any) => (
        <Tooltip title={`${gerritChange.total_comment_count} comments / ${gerritChange.unresolved_comment_count} unresolved comments`} >
          <div>{`${gerritChange.total_comment_count}/${gerritChange.unresolved_comment_count}`}</div>
        </Tooltip>
      ),
    },
    {
      title: 'CR/CM/V',
      tooltip: 'Code-Review / Commit-Message / Verified',
      searchable: false,
      width: '15ch',
      render: (gerritChange: any) => (
        <Box>
          <Tooltip title={gerritChange.code_review.message}>
            <IconButton size="small" style={{ padding: 0 }}>
              {gerritChange.code_review.icon}
            </IconButton>
          </Tooltip>
          <Tooltip title={gerritChange.commit_message.message}>
            <IconButton size="small" style={{ padding: 0 }}>
              {gerritChange.commit_message.icon}
            </IconButton>
          </Tooltip>
          <Tooltip title={gerritChange.verified.message}>
            <IconButton size="small" style={{ padding: 0 }}>
              {gerritChange.verified.icon}
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const data = gerritChangesList.map(gerritChange => {
    return ({
      id: gerritChange._number,
      subject: gerritChange.subject,
      status: gerritChange.status,
      relatedJIRAs: findRelatedJIRAs(gerritChange.subject),
      project: gerritChange.project.split("/").pop(),
      fullProject: gerritChange.project,
      branch: gerritChange.branch,
      owner: gerritChange.owner,
      created: moment(new Date(gerritChange.created)).fromNow(),
      updated: moment(new Date(gerritChange.updated)).fromNow(),
      reviewers: showReviewers(gerritChange.reviewers),
      size: getSize(gerritChange.insertions, gerritChange.deletions),
      total_comment_count: gerritChange.total_comment_count,
      unresolved_comment_count: gerritChange.unresolved_comment_count,
      code_review: setGerritLabelValueAndName(gerritChange.labels, "Code-Review"),
      commit_message: setGerritLabelValueAndName(gerritChange.labels, "Commit-Message"),
      verified: setGerritLabelValueAndName(gerritChange.labels, "Verified"),
    });
  });

  // Add link to table title in component code review tab
  let title: any = tableTitle
  let gerritRepoHistory: any = ""
  if (repoView) {
    title = (
      <Link to={`${cloneUrl}/${tableTitle}`}>
        {tableTitle}
      </Link>
    )
    gerritRepoHistory = (
      <Link to={`${baseUrl}/gitweb?p=${tableTitle}.git;a=shortlog`}>
      Gerrit Project History
    </Link>
    )
  }

  let filters: TableFilter[] = [
    {
      column: 'Status',
      type: 'multiple-select',
    },
    {
      column: 'Branch',
      type: 'multiple-select',
    },
    {
      column: 'Owner',
      type: 'multiple-select',
    },
    {
      column: 'Reviewers',
      type: 'multiple-select',
    }
  ];
  if (!repoView) {
    filters = [...filters,
    {
      column: 'Project',
      type: 'multiple-select',
    }]
  }
  const initialStates: TableState = {
    filters: {['Status']: ['NEW']}
  }

  return (
    <InfoCard title={title} subheader={gerritRepoHistory} >
      <Table
        options={{ search: true, paging: true, pageSize: 20, tableLayout: 'fixed', emptyRowsWhenPaging: false, padding: 'dense'}}
        columns={gerritChangeColumns}
        data={data}
        filters={filters}
        initialState={initialStates}
        localization={{ toolbar: { searchPlaceholder: 'Search Subject or ID' } }}
      />
    </InfoCard>
  );
};

export function getGerritConfig(config: Config) {
  const gerritConfigArray = config.getOptionalConfigArray('integrations.gerrit') ?? [];
  const gerritConfig = readGerritIntegrationConfig(gerritConfigArray[0]);
  return gerritConfig;
}

const GetGerritCurrentUser = () => {
  const discoveryApi = useApi(discoveryApiRef);
  const proxyBackendBaseUrl = discoveryApi.getBaseUrl('proxy');

  const { value, loading, error } = useAsync(async () => {
    const gerritResponse = await fetch(`${await proxyBackendBaseUrl}/gerrit/a/accounts/self`);
    if (!gerritResponse.ok) {
      throw new Error(gerritResponse.statusText);
    }
    return (await parseGerritJsonResponse(gerritResponse as any) as any).name;
  }, []);

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <HeaderLabel label="Gerrit User" value={value} />
}

export const GerritReviewCard = ({ request, tableTitle }: GerritReviewProps) => {
  const discoveryApi = useApi(discoveryApiRef);
  const { value = [], loading, error } = useAsync(async (): Promise<GerritChange[]> => {
    const proxyBackendBaseUrl = discoveryApi.getBaseUrl('proxy');
    const gerritResponse = await fetch(`${await proxyBackendBaseUrl}/gerrit/a/${request}`);
    if (!gerritResponse.ok) {
      throw new Error(gerritResponse.statusText);
    }
    return await parseGerritJsonResponse(gerritResponse as any) as any;
  }, []);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable gerritChangesList={value} tableTitle={tableTitle} />;
};

export const GerritReviews = () => (
  <Page themeId="tool">
    <Header title="My Gerrit Review Dashboard!">
      <GetGerritCurrentUser />
    </Header>
    <Content>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <GerritReviewCard request="changes/?O=81&S=0&n=50&q=is:open+owner:self" tableTitle="Open Reviews" />
        </Grid>
        <Grid item>
          <GerritReviewCard request="changes/?O=81&S=0&n=50&q=is:open+reviewer:self+-owner:self" tableTitle="Incoming Reviews" />
        </Grid>
        <Grid item>
          <GerritReviewCard request="changes/?O=81&S=0&n=50&q=is:closed+owner:self" tableTitle="Closed Reviews" />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
