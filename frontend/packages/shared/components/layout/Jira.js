import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ListItemIcon, Typography } from '@material-ui/core';
import Link from 'shared/components/Link';
import JiraUtils from 'shared/apis/jira/jiraUtils';
import JiraIcon from 'shared/assets/icons/jira.svg';

/**
 * Jira component to be used inside a SupportButton block.
 */
export default class Jira extends Component {
  static propTypes = {
    projectID: PropTypes.number.isRequired,
  };

  render() {
    const { projectID } = this.props;
    return (
      <Fragment>
        <ListItemIcon>
          <img src={JiraIcon} alt="Jira" width={24} height={24} />
        </ListItemIcon>
        <div>
          <Typography variant="subtitle1">Jira</Typography>
          <Typography>
            <Link to={JiraUtils.makeJiraIssueURL(projectID, 1)}>Report a bug</Link>
          </Typography>
          <Typography>
            <Link to={JiraUtils.makeJiraIssueURL(projectID, 2)}>Feature request</Link>
          </Typography>
        </div>
      </Fragment>
    );
  }
}
