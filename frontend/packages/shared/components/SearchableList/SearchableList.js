import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TrieSearch from 'trie-search';
import {
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { SearchIcon } from 'shared/icons';
import Link from 'shared/components/Link';
import WarningIcon from '@material-ui/icons/Warning';

const RenderSearchIconOrTextInput = ({ displaySearch, searchInput_onChangeHandler, searchIcon_onClickHandler }) => {
  if (displaySearch) {
    return (
      <Input
        autoFocus
        placeholder="Search..."
        onChange={searchInput_onChangeHandler}
        endAdornment={
          <InputAdornment position="end">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    );
  }

  return (
    <IconButton onClick={searchIcon_onClickHandler} data-testid="search-button">
      <SearchIcon />
    </IconButton>
  );
};

const SearchableListStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
    position: 'relative',
    flex: '1',
  },
  header: {
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 16,
  },
  content: {
    height: '100%',
    flex: '1 1 auto',
    overflow: 'auto',
  },
};

export default class SearchableList extends Component {
  static propTypes = {
    title: PropTypes.string,
    items: PropTypes.array.isRequired,
    itemRenderer: PropTypes.func, // itemRenderer(clickHandler, item, index, allItems) => ListItem[]
    onItemClick: PropTypes.func,
    enableSearch: PropTypes.bool,
    style: PropTypes.object,
    showCount: PropTypes.bool,
    className: PropTypes.string,
    itemHeight: PropTypes.number,
    titleStyle: PropTypes.object,
    titleClasses: PropTypes.string,
    labelField: PropTypes.string,
    labelFunction: PropTypes.func,
    linkToFunction: PropTypes.func,
    globalFilter: PropTypes.string, // startsWith matching only due to trie structure
    indexFunction: PropTypes.func,
    trieSearchOptions: PropTypes.object,
  };

  static defaultProps = {
    items: [],
    enableSearch: false,
    style: SearchableListStyles.container,
    showCount: true,
    itemHeight: 35,
  };

  state = {
    displaySearch: false,
    scrollTop: 0,
    filterString: undefined,
  };

  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);
    this.rebuildIndex(props);
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentWillUpdate(nextProps) {
    if (nextProps.items !== this.props.items) {
      this.rebuildIndex(nextProps);
    }
  }

  render() {
    let {
      title,
      items,
      itemRenderer,
      onItemClick,
      autoDisplaySearch,
      enableSearch,
      style,
      showCount,
      className,
      itemHeight,
      titleStyle,
      headerStyle,
      titleClasses,
      renderItemCount = 50,
    } = this.props;
    const { displaySearch, scrollTop } = this.state;

    const filteredItems = this.getFilteredItems(items);

    if (!itemRenderer) {
      itemRenderer = this.defaultItemRenderer;
    }

    if (showCount && title) {
      if (filteredItems && filteredItems.length !== items.length) {
        title = `${title} (${filteredItems.length} / ${items.length})`;
      } else {
        title = `${title} (${items.length})`;
      }
    }

    const searchNoItemsMessage = (
      <ListItem dense style={{ fontSize: 14 }}>
        <ListItemIcon>
          <WarningIcon />
        </ListItemIcon>
        <ListItemText secondary="No items found" />
      </ListItem>
    );

    const topItemIx = Math.floor(scrollTop / itemHeight);
    const result = filteredItems.slice(topItemIx, topItemIx + renderItemCount).map((item, ix, arr) => {
      return itemRenderer(onItemClick, item, topItemIx + ix, arr);
    });
    const totalHeight = filteredItems.length * itemHeight;

    return (
      <div style={className ? undefined : style} className={className}>
        <div style={headerStyle || SearchableListStyles.header}>
          <Typography variant="body1" style={titleStyle} className={titleClasses}>
            {title}
          </Typography>
          {enableSearch ? (
            <RenderSearchIconOrTextInput
              displaySearch={autoDisplaySearch || displaySearch}
              searchInput_onChangeHandler={this.searchInput_onChangeHandler}
              searchIcon_onClickHandler={this.searchIcon_onClickHandler}
            />
          ) : null}
        </div>
        <div style={SearchableListStyles.content} ref="content" onScroll={this.onScrollHandler}>
          <List dense style={{ height: `${totalHeight}px` }}>
            {result.length > 0 ? result : searchNoItemsMessage}
          </List>
        </div>
      </div>
    );
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  focus() {
    if (this.refs.search) {
      this.refs.search.focus();
    }
  }

  getFilteredItems(items) {
    const { filterString } = this.state;
    const { globalFilter } = this.props;

    const filter = filterString || globalFilter;

    if (this.trieSearch && filter) {
      return this.trieSearch.get(filter);
    }

    return items;
  }

  getLabelFor(item) {
    const { labelField = 'label', labelFunction } = this.props;

    if (labelFunction) {
      return labelFunction(item, this);
    }

    return typeof item === 'string' ? item : item[labelField];
  }

  defaultItemRenderer = (onItemClick, item, ix) => {
    const { linkToFunction, itemHeight } = this.props;
    const label = this.getLabelFor(item);
    const key = item.id || label;

    const url = linkToFunction ? linkToFunction(item) : '';

    if (onItemClick) {
      return (
        <ListItem
          dense
          button
          data-testid={`ListItem-${label}`}
          key={key}
          onClick={e => onItemClick.bind(undefined, e, item)()}
          style={{
            fontSize: 14,
            top: ix * itemHeight,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: itemHeight,
            padding: 0,
          }}
        >
          <div style={{ padding: 10 }}>{label}</div>
        </ListItem>
      );
    }

    return (
      <ListItem
        dense
        button
        key={key}
        data-testid={`ListItem-${label}`}
        style={{ fontSize: 14, padding: 0, top: ix * itemHeight, position: 'absolute', height: itemHeight }}
      >
        <Link to={url} style={{ display: 'block', width: '100%', padding: '8px 16px' }}>
          {label}
        </Link>
      </ListItem>
    );
  };

  rebuildIndex(props) {
    const { items, uniqueField, labelField = 'label', indexFunction, trieSearchOptions } = props;

    this.trieSearch = new TrieSearch(
      labelField,
      trieSearchOptions || {
        splitOnRegEx: /([.\-\s_]|(?=[A-Z][a-z]))/,
        splitOnGetRegEx: /([.\-\s_]|(?=[A-Z][a-z]))/,
        insertFullUnsplitKey: true,
        indexField: uniqueField || labelField,
      },
    );

    if (items) {
      items.forEach(item => {
        let str = indexFunction ? indexFunction(item) : this.getLabelFor(item);

        if (str) {
          this.trieSearch.map(str, item);
        } else {
          console.warn('List: attempting to index an empty label for', item, labelField);
        }
      });
    }
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  searchIcon_onClickHandler = () => {
    this.setState({ displaySearch: true });
  };

  searchInput_onChangeHandler = event => {
    this.setState({ filterString: event.target.value });
  };

  onScrollHandler = event => {
    this.setState({
      scrollTop: event.target.scrollTop,
    });
  };
}
