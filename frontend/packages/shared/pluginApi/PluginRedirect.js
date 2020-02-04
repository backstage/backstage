import qs from 'qs';

import { redirect } from 'core/utils/routing';

import { PluginBase } from 'shared/pluginApi';

export default class PluginRedirect {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(pluginOwner, from, to, exactMatch = false) {
    if (!(pluginOwner instanceof PluginBase)) {
      throw new Error('PluginRedirect: pluginOwner must extend PluginBase');
    }

    this.pluginOwner = pluginOwner;
    this.from = from;
    this.to = to;
    this.exactMatch = exactMatch;
  }

  //-----------------------------------
  // Render
  //-----------------------------------
  render() {
    return redirect(this.from, this.redirectMap.bind(this), this.exactMatch);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  redirectMap(props) {
    const { params } = props.match;
    const { search } = props.location;

    let to = this.to;

    Object.entries(params).forEach(([key, value]) => {
      to = to.replace(`:${key}`, value);
    });

    if (search) {
      const searchQuery = qs.parse(search.replace(/^[?#]/, ''));
      Object.entries(searchQuery).forEach(([key, value]) => {
        to = to.replace(`:${key}`, value);
      });
    }

    to = to.replace(':changeId', '');

    return to;
  }
}
