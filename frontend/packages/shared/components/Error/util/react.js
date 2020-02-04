import ReactDOM from 'react-dom';
import React from 'react';

/**
 * Walks the dom ancestors until it finds the nearest dom node that has a ref to a React Component and then
 * returns that React Component.
 *
 * @param domNode The DOM node to start with.
 * @returns {*}
 */
export function domNodeToNearestReactComponent(domNode) {
  while (domNode) {
    for (let key in domNode) {
      if (key.startsWith('__reactInternalInstance$')) {
        // Please don't judge me when you read this code.

        if (React.version.startsWith('16')) {
          // In React Fiber, every node in the tree (including dom nodes) is represented in the Fiber tree. So we
          // have to search through all the parents to find the first one that has a stateNode that is a React Component
          let curFiber = domNode[key];

          while (
            curFiber &&
            !(curFiber.stateNode instanceof React.Component || typeof curFiber.stateNode === 'function')
          ) {
            curFiber = curFiber.return;
          }

          return curFiber.stateNode;
        }

        // React 15
        return domNode[key]._currentElement._owner._instance;
      }
    }

    domNode = domNode.parentNode;
  }

  return null;
}

/**
 * Walks the dom ancestors until it finds the nearest dom node that has a ref to a React Component and then returns
 * that dom node.
 *
 * @param domNode The DOM node to start with.
 * @returns {*}
 */
export function domNodeToNearestReactComponentDomNode(domNode) {
  while (domNode) {
    for (let key in domNode) {
      if (key.startsWith('__reactInternalInstance$')) {
        return domNode;
      }
    }

    domNode = domNode.parentNode;
  }

  return null;
}

/**
 * Walks the React Components up through the parent heirarchy.
 *
 * @param component A React Component instance.
 * @param callback A callback to call for each component in the ancestors.
 */
export function walkReactParents(component, callback) {
  if (component._reactInternalFiber) {
    return _walkReactParents16(component, callback);
  } else {
    return _walkReactParents15(component, callback);
  }
}

function _walkReactParents16(component, callback) {
  let ancestors = [];

  let fiber = component._reactInternalFiber;

  while (fiber) {
    let item = fiber.stateNode;

    if (item && (item instanceof React.Component || item instanceof Function)) {
      if (ancestors.indexOf(item) === -1) {
        ancestors.push(item);
      }
    }

    fiber = fiber.return; // return is the parent node, go figure (ask Facebook)
  }

  if (callback) {
    ancestors.forEach(callback);
  }

  return ancestors;
}

function _walkReactParents15(component, callback) {
  let ancestors = [];

  component = component._reactInternalInstance;

  while (component) {
    let item = component._instance || component._currentElement._owner._instance;

    if (ancestors.indexOf(item) === -1) {
      ancestors.push(item);
    }

    component = component._hostParent;
  }

  if (callback) {
    ancestors.forEach(callback);
  }

  return ancestors;
}

/**
 * Returns all Ringa.Controller instances that exist in the ancestor tree.
 *
 * @param component A React Component instance.
 * @returns {Array}
 */
export function getAllReactComponentAncestors(component) {
  return walkReactParents(component);
}

export function findComponentRoot(component, refName) {
  let domNode;

  // First look for a ref to attach to...
  if (!component.refs || !component.refs[refName]) {
    // Second use react-dom to find the root node for the component...

    domNode = ReactDOM.findDOMNode(component);

    if (!domNode) {
      console.warn(
        `attach(): Error finding root DOM node for React Component ${component.constructor.name}. Component ref named '${refName}' does not exist and ReactDOM findDomNode(component) did not return anything. This can happen if the render() method returns null or undefined.`,
      );
    }

    return domNode;
  } else {
    domNode = component.refs[refName];
  }

  return domNode;
}
