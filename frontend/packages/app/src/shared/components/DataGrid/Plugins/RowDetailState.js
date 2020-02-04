import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Plugin, Getter, Action } from '@devexpress/dx-react-core';

/*
  This plugin is derived from the original RowDetailState plugin made by the Devexpress team.
  (https://github.com/DevExpress/devextreme-reactive/blob/master/packages/dx-react-grid/src/plugins/row-detail-state.jsx)

  Contrary to the original implementation, ours allows the user to make any column expandable.
  Instead of keeping an array of expanded rows, we keep a dictionary with where the value is
  either an empty string or the name of the currently expanded column. This allows users to
  have more than one expandable column and show different content based on which column is expanded.
*/

class RowDetailState extends PureComponent {
  static getDerivedStateFromProps(newProps, prevState) {
    if (!prevState.defaultExpandedRows && newProps.defaultExpandedRows) {
      return { expandedRows: newProps.defaultExpandedRows, defaultExpandedRows: newProps.defaultExpandedRows };
    }
    return null;
  }

  static propTypes = {
    expandedRows: PropTypes.object,
    defaultExpandedRows: PropTypes.object,
    onExpandedRowsChange: PropTypes.func,
  };

  static defaultProps = {
    expandedRows: {},
  };

  constructor(props) {
    super(props);
    this.toggleDetailRowExpanded = this.toggleDetailRowExpanded.bind(this);
  }

  state = {
    expandedRows: this.props.expandedRows || this.props.defaultExpandedRows,
  };

  toggleDetailRowExpanded({ rowId, column }) {
    const expandedRows = { ...this.state.expandedRows };

    if (expandedRows[rowId] !== column) {
      expandedRows[rowId] = column;
    } else {
      expandedRows[rowId] = '';
    }

    this.setState({ expandedRows });
    if (this.props.onExpandedRowsChange) {
      this.props.onExpandedRowsChange(expandedRows);
    }
  }

  render() {
    const { expandedRows } = this.state;

    return (
      <Plugin name="RowDetailState">
        <Getter name="expandedRows" value={expandedRows} />
        <Action name="toggleDetailRowExpanded" action={this.toggleDetailRowExpanded} />
      </Plugin>
    );
  }
}

export default RowDetailState;
