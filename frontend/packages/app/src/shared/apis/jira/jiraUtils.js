/**
 * Jira utilities for merging results
 */

class JiraUtils {
  static instance;

  constructor() {
    if (JiraUtils.instance) {
      return JiraUtils.instance;
    }
    this.instance = this;
  }

  makeJiraIssueURL = (projectID, issueType) => {
    if (!projectID || !issueType) {
      throw Error('Input projectID and issueType needs to be set');
    }
    if (issueType !== 1 && issueType !== 2) {
      throw Error('issueType must be either 1 (bug) or 2 (feature request)');
    }
    return `https://jira.spotify.net/secure/CreateIssueDetails!init.jspa?priority=3&issuetype=${issueType}&pid=${projectID}`;
  };

  genIssuesWithStatusFromFilterNameMap(issueMap, filtername, statusText) {
    let issues = {};
    if (issueMap.hasOwnProperty(filtername)) {
      issueMap[filtername].forEach(issue => {
        let newIssue = Object.assign({ status: statusText }, issue);
        issues[newIssue.id] = newIssue;
      });
    }
    return issues;
  }

  mergeFilterNameIssues(filterResults) {
    // Extract the results to keys from the results
    let filterMap = {};
    filterResults.forEach(filter => {
      filterMap[filter.filter] = filter.issues;
    });

    // Extract and enhance the warning issues
    const warningIssues = this.genIssuesWithStatusFromFilterNameMap(filterMap, 'APP_RELEASE_RADAR', 'yellow');
    // Extract and enhance the error issues
    const errorIssues = this.genIssuesWithStatusFromFilterNameMap(filterMap, 'APP_IMMEDIATE_ACTION', 'red');
    // Merge the two with overwriting the left objec keys with the right
    const combined = Object.assign({}, warningIssues, errorIssues);

    // flatten to an array
    const issues = Object.values(combined);

    return issues;
  }
}

let _instance = new JiraUtils();

export default _instance;
