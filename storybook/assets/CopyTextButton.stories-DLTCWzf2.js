import{j as s}from"./iframe-CTfOr1ix.js";import{C as a}from"./CopyTextButton-C9gW30zO.js";import"./preload-helper-PPVm8Dsz.js";import"./useCopyToClipboard-Bl9wB9IS.js";import"./useMountedState-g2Ku3pig.js";import"./Tooltip-bV63MOr0.js";import"./Popper-BxZ3wRuZ.js";import"./Portal-6Q34r_Nq.js";const u={title:"Inputs/CopyTextButton",component:a,tags:["!manifest"]},t=()=>s.jsx(a,{text:"The text to copy to clipboard"}),o=()=>s.jsx(a,{text:"The text to copy to clipboard",tooltipText:"Custom tooltip shown on button click"}),e=()=>s.jsx(a,{text:"The text to copy to clipboard",tooltipText:"Waiting 3s before removing tooltip",tooltipDelay:3e3}),r=()=>s.jsx(a,{text:"The text to copy to clipboard","aria-label":"This is an aria label"});t.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithTooltip"};e.__docgenInfo={description:"",methods:[],displayName:"LongerTooltipDelay"};r.__docgenInfo={description:"",methods:[],displayName:"WithAriaLabel"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Default = () => <CopyTextButton text="The text to copy to clipboard" />;
`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const WithTooltip = () => (
  <CopyTextButton
    text="The text to copy to clipboard"
    tooltipText="Custom tooltip shown on button click"
  />
);
`,...o.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const LongerTooltipDelay = () => (
  <CopyTextButton
    text="The text to copy to clipboard"
    tooltipText="Waiting 3s before removing tooltip"
    tooltipDelay={3000}
  />
);
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const WithAriaLabel = () => (
  <CopyTextButton
    text="The text to copy to clipboard"
    aria-label="This is an aria label"
  />
);
`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:'() => <CopyTextButton text="The text to copy to clipboard" />',...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:'() => <CopyTextButton text="The text to copy to clipboard" tooltipText="Custom tooltip shown on button click" />',...o.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:'() => <CopyTextButton text="The text to copy to clipboard" tooltipText="Waiting 3s before removing tooltip" tooltipDelay={3000} />',...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:'() => <CopyTextButton text="The text to copy to clipboard" aria-label="This is an aria label" />',...r.parameters?.docs?.source}}};const T=["Default","WithTooltip","LongerTooltipDelay","WithAriaLabel"];export{t as Default,e as LongerTooltipDelay,r as WithAriaLabel,o as WithTooltip,T as __namedExportsOrder,u as default};
