export default class EventDispatcher {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    this._map = {};
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Adds an event listener handler for a particular event type.
   *
   * @param type The type of event
   * @param handler The handling function
   */
  addEventListener(type, handler) {
    let map = this._map;

    map[type] = map[type] || [];
    map[type].push(handler);
  }

  /**
   * Returns true if there is at least one handler for the provided type.
   *
   * @param type Event type.
   * @returns {*} True if the event type has an associated handler.
   */
  hasListener(type) {
    return !!this._map[type];
  }

  /**
   * Removes the specific handler associated with the provided event type.
   *
   * @param type Event type.
   * @param handler The handling function to remove.
   */
  removeEventListener(type, handler) {
    if (this._map[type]) {
      let ix = this._map[type].indexOf(handler);
      if (ix !== -1) {
        this._map[type].splice(ix, 1);
      }
    }
  }

  /**
   * Dispatches an event on this bus.
   *
   * @param event A RingaEvent or similar.
   */
  dispatchEvent(event, detail) {
    let map = this._map;
    detail = detail || {};
    detail.target = this;

    if (map[event]) {
      map[event].forEach(handler => {
        handler({ event, detail });
      });
    }
  }
}
