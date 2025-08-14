import{b as v}from"./index-D8-PC79C.js";var i={exports:{}},t={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var p;function y(){if(p)return t;p=1;var R=v(),a=Symbol.for("react.element"),x=Symbol.for("react.fragment"),c=Object.prototype.hasOwnProperty,l=R.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function s(n,r,_){var e,o={},u=null,f=null;_!==void 0&&(u=""+_),r.key!==void 0&&(u=""+r.key),r.ref!==void 0&&(f=r.ref);for(e in r)c.call(r,e)&&!d.hasOwnProperty(e)&&(o[e]=r[e]);if(n&&n.defaultProps)for(e in r=n.defaultProps,r)o[e]===void 0&&(o[e]=r[e]);return{$$typeof:a,type:n,key:u,ref:f,props:o,_owner:l.current}}return t.Fragment=x,t.jsx=s,t.jsxs=s,t}var m;function O(){return m||(m=1,i.exports=y()),i.exports}var j=O();export{j};
