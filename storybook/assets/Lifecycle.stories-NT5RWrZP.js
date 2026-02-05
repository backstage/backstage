import{m as l,j as e,e as d}from"./iframe-M9O-K8SB.js";import"./preload-helper-PPVm8Dsz.js";const p=l(n=>({alpha:{color:n.palette.common.white,fontFamily:"serif",fontWeight:"normal",fontStyle:"italic"},beta:{color:"#4d65cc",fontFamily:"serif",fontWeight:"normal",fontStyle:"italic"}}),{name:"BackstageLifecycle"});function o(n){const i=p(n),{shorthand:h,alpha:c}=n;return h?e.jsx(d,{component:"span",className:i[c?"alpha":"beta"],style:{fontSize:"120%"},children:c?e.jsx(e.Fragment,{children:"α"}):e.jsx(e.Fragment,{children:"β"})}):e.jsx(d,{component:"span",className:i[c?"alpha":"beta"],children:c?"Alpha":"Beta"})}o.__docgenInfo={description:"",methods:[],displayName:"Lifecycle",props:{shorthand:{required:!1,tsType:{name:"boolean"},description:""},alpha:{required:!1,tsType:{name:"boolean"},description:""}}};const u={title:"Feedback/Lifecycle",component:o,tags:["!manifest"]},a=()=>e.jsxs(e.Fragment,{children:["This feature is in ",e.jsx(o,{alpha:!0})]}),s=()=>e.jsxs(e.Fragment,{children:["This feature is in ",e.jsx(o,{alpha:!0,shorthand:!0})]}),r=()=>e.jsxs(e.Fragment,{children:["This feature is in ",e.jsx(o,{})]}),t=()=>e.jsxs(e.Fragment,{children:["This feature is in ",e.jsx(o,{shorthand:!0})]});a.__docgenInfo={description:"",methods:[],displayName:"AlphaDefault"};s.__docgenInfo={description:"",methods:[],displayName:"AlphaShorthand"};r.__docgenInfo={description:"",methods:[],displayName:"BetaDefault"};t.__docgenInfo={description:"",methods:[],displayName:"BetaShorthand"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const AlphaDefault = () => (
  <>
    This feature is in <Lifecycle alpha />
  </>
);
`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const AlphaShorthand = () => (
  <>
    This feature is in <Lifecycle alpha shorthand />
  </>
);
`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const BetaDefault = () => (
  <>
    This feature is in <Lifecycle />
  </>
);
`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const BetaShorthand = () => (
  <>
    This feature is in <Lifecycle shorthand />
  </>
);
`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <>
    This feature is in <Lifecycle alpha />
  </>`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <>
    This feature is in <Lifecycle alpha shorthand />
  </>`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => <>
    This feature is in <Lifecycle />
  </>`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => <>
    This feature is in <Lifecycle shorthand />
  </>`,...t.parameters?.docs?.source}}};const y=["AlphaDefault","AlphaShorthand","BetaDefault","BetaShorthand"];export{a as AlphaDefault,s as AlphaShorthand,r as BetaDefault,t as BetaShorthand,y as __namedExportsOrder,u as default};
