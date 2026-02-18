import{j as s}from"./iframe-DHcBEgBH.js";import{C as a}from"./CopyTextButton-BWtlCBa4.js";import"./preload-helper-PPVm8Dsz.js";import"./useCopyToClipboard-C3qsehrP.js";import"./useMountedState-f5Qy4kw8.js";import"./Tooltip-8MUD-NVH.js";import"./Popper-Bsu9O5KR.js";import"./Portal-4pR_an9W.js";const u={title:"Inputs/CopyTextButton",component:a,tags:["!manifest"]},t=()=>s.jsx(a,{text:"The text to copy to clipboard"}),o=()=>s.jsx(a,{text:"The text to copy to clipboard",tooltipText:"Custom tooltip shown on button click"}),e=()=>s.jsx(a,{text:"The text to copy to clipboard",tooltipText:"Waiting 3s before removing tooltip",tooltipDelay:3e3}),r=()=>s.jsx(a,{text:"The text to copy to clipboard","aria-label":"This is an aria label"});t.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"WithTooltip"};e.__docgenInfo={description:"",methods:[],displayName:"LongerTooltipDelay"};r.__docgenInfo={description:"",methods:[],displayName:"WithAriaLabel"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Default = () => <CopyTextButton text="The text to copy to clipboard" />;
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
