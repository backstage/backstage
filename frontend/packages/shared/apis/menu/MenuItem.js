import React from 'react';

export default class MenuItem {
  constructor(id, title, options, parent) {
    this.id = id;
    this.title = title;
    this.parent = parent;
    this.children = [];
    this.childrenById = {};

    this.options = options;

    this._visible = true;
  }

  get visibleChildren() {
    return this.children.filter(child => child.visible);
  }

  set visible(value) {
    this._visible = value;
  }

  get visible() {
    return this._visible;
  }

  /**
   * Recursively construct a breadcrumb title path to this node.
   *
   * @param delimiter Defaults to ' > '
   * @returns {string}
   */
  getTitlePath(delimiter = ' > ') {
    if (this.options.ignoreParentsInTitle) {
      return this.title;
    }

    return `${this.parent && this.parent.title ? `${this.parent.title}${delimiter}` : ''}${this.title}`;
  }

  /**
   * Path can be an array of MenuItem ids: ['tools', 'compliance']
   *
   * OR
   *
   * Path can be a dot-delimited string: 'tools.compliance'
   *
   * @param path
   * @returns {MenuItem}
   */
  getByIdPath(path) {
    path = path instanceof Array ? path : path.split('.');

    return path.reduce((menuItem, id) => {
      return menuItem.childrenById[id];
    }, this);
  }

  /**
   * Add a MenuItem instance as a child to this MenuItem.
   *
   * @param menuItem
   * @returns {*}
   */
  add(menuItem) {
    menuItem.parent = this;

    this.childrenById[menuItem.id] = menuItem;
    this.children.push(menuItem);

    return menuItem;
  }

  render() {
    return <div>{this.title}</div>;
  }

  toString() {
    return this.parent ? `${this.parent.toString()}.${this.id}` : this.id;
  }
}
