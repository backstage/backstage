import React, { Component } from 'react';
import { Tooltip } from '@material-ui/core';

export default class ListCell extends Component {
  state = {
    expanded: false,
  };

  static listItemStyle = {
    marginTop: '4px',
    marginBottom: '4px',
  };

  static listItemMoreStyle = Object.assign(
    {
      cursor: 'pointer',
      color: 'grey',
    },
    ListCell.listItemStyle,
  );

  render() {
    const { value, column } = this.props;
    if (!value || !column) return null;
    let rows = value;
    const maxRows = column.maxRows ? (column.maxRows === -1 ? 10000 : column.maxRows) : 10;
    const rowsCapped = !this.state.expanded && rows.length > maxRows;

    let slicedRows = rowsCapped ? rows.slice(0, maxRows) : rows;

    let listItemRenderer = column.listItemRenderer || ListCell.defaultListItemRenderer;
    let rendered = slicedRows.map(listItemRenderer.bind(this, { rowsCapped, maxRows, column }));

    if (rowsCapped) {
      rendered.push(
        <div
          role="button"
          tabIndex={0}
          key="showMore"
          onClick={() => this.expandClickHandler()}
          onKeyPress={() => this.expandClickHandler()}
          style={column.listItemMoreStyle || ListCell.listItemMoreStyle}
        >
          {column.moreText || `And ${rows.length - slicedRows.length} More`}
        </div>,
      );
    }

    return rendered;
  }

  expandClickHandler() {
    this.setState({
      expanded: true,
    });
  }

  static sort(a1, a2) {
    if (a1.length === a2.length) {
      return 0;
    }

    return a1.length > a2.length ? -1 : 1;
  }

  static defaultListItemRenderer({ column }, text, index) {
    return (
      <Tooltip key={index} title={text} placement="top">
        <div style={column.listItemStyle || ListCell.listItemStyle}>{text}</div>
      </Tooltip>
    );
  }
}
