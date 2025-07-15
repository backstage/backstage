import{b as u}from"./index-DSHF18-l.js";var f={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var l=u(),m=Symbol.for("react.element"),y=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,x=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,v={key:!0,ref:!0,__self:!0,__source:!0};function i(t,r,p){var e,o={},s=null,_=null;p!==void 0&&(s=""+p),r.key!==void 0&&(s=""+r.key),r.ref!==void 0&&(_=r.ref);for(e in r)a.call(r,e)&&!v.hasOwnProperty(e)&&(o[e]=r[e]);if(t&&t.defaultProps)for(e in r=t.defaultProps,r)o[e]===void 0&&(o[e]=r[e]);return{$$typeof:m,type:t,key:s,ref:_,props:o,_owner:x.current}}n.Fragment=y;n.jsx=i;n.jsxs=i;f.exports=n;var c=f.exports;export{c as j};
