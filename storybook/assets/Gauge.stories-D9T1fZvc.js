import{j as e}from"./iframe-DcD9AGXg.js";import{G as c}from"./Gauge-DFya483i.js";import"./preload-helper-PPVm8Dsz.js";import"./index-V-0l0hfC.js";import"./objectSpread2-UzhFSX4U.js";import"./makeStyles-aq0vcWH5.js";import"./Box-CD9U0JkS.js";import"./styled-Dv4Z9rlI.js";const d={width:300},f={title:"Data Display/Gauge",component:c,tags:["!manifest"]},s=()=>e.jsx("div",{style:d,children:e.jsx(c,{value:.8})}),r=()=>e.jsx("div",{style:d,children:e.jsx(c,{value:.5})}),o=()=>e.jsx("div",{style:d,children:e.jsx(c,{value:.2})}),a=()=>e.jsx("div",{style:d,children:e.jsx(c,{value:.2,inverse:!0})}),t=()=>e.jsx("div",{style:d,children:e.jsx(c,{value:89.2,fractional:!1,unit:"m/s"})}),n=()=>e.jsx("div",{style:d,children:e.jsx(c,{getColor:()=>"#f0f",value:.5})});s.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"MediumProgress"};o.__docgenInfo={description:"",methods:[],displayName:"LowProgress"};a.__docgenInfo={description:"",methods:[],displayName:"InverseLowProgress"};t.__docgenInfo={description:"",methods:[],displayName:"AbsoluteProgress"};n.__docgenInfo={description:"",methods:[],displayName:"StaticColor"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Default = () => (
  <div style={containerStyle}>
    <Gauge value={0.8} />
  </div>
);
`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const MediumProgress = () => (
  <div style={containerStyle}>
    <Gauge value={0.5} />
  </div>
);
`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const LowProgress = () => (
  <div style={containerStyle}>
    <Gauge value={0.2} />
  </div>
);
`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const InverseLowProgress = () => (
  <div style={containerStyle}>
    <Gauge value={0.2} inverse />
  </div>
);
`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const AbsoluteProgress = () => (
  <div style={containerStyle}>
    <Gauge value={89.2} fractional={false} unit="m/s" />
  </div>
);
`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const StaticColor = () => (
  <div style={containerStyle}>
    <Gauge getColor={() => "#f0f"} value={0.5} />
  </div>
);
`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <Gauge value={0.8} />
  </div>`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <Gauge value={0.5} />
  </div>`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <Gauge value={0.2} />
  </div>`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <Gauge value={0.2} inverse />
  </div>`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <Gauge value={89.2} fractional={false} unit="m/s" />
  </div>`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <Gauge getColor={() => '#f0f'} value={0.5} />
  </div>`,...n.parameters?.docs?.source}}};const S=["Default","MediumProgress","LowProgress","InverseLowProgress","AbsoluteProgress","StaticColor"];export{t as AbsoluteProgress,s as Default,a as InverseLowProgress,o as LowProgress,r as MediumProgress,n as StaticColor,S as __namedExportsOrder,f as default};
