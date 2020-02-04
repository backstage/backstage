import JiraUtils from 'shared/apis/jira/jiraUtils';

describe('JiraUtils', () => {
  it('throws proper error when required input is missing', () => {
    expect(() => {
      JiraUtils.makeJiraIssueURL();
    }).toThrowError();
  });

  it('throws proper error when one required input is missing', () => {
    expect(() => {
      JiraUtils.makeJiraIssueURL(1222);
    }).toThrowError();
  });

  it('throws proper error when one input is wrong', () => {
    expect(() => {
      JiraUtils.makeJiraIssueURL(1222, 0);
    }).toThrowError();
  });

  it('does not throw error when input is valid', () => {
    expect(() => {
      JiraUtils.makeJiraIssueURL(1222, 1);
    }).not.toThrowError();
    expect(() => {
      JiraUtils.makeJiraIssueURL(1222, 2);
    }).not.toThrowError();
  });
});
