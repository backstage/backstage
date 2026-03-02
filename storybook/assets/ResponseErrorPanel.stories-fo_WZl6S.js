import{j as t}from"./iframe-CGY8RtMM.js";import{R as s}from"./ResponseErrorPanel-DPZGLLoJ.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DsrsBIHr.js";import"./ErrorPanel-CVEMhsGR.js";import"./WarningPanel-D3szz0XR.js";import"./ExpandMore-Dmv7QB28.js";import"./AccordionDetails-U1rx4U3Z.js";import"./index-B9sM2jn7.js";import"./Collapse-D-fg3clD.js";import"./MarkdownContent-DYpR2nSA.js";import"./CodeSnippet-BhmLEwNc.js";import"./Box-CzermUI4.js";import"./styled-CKkmDcn6.js";import"./CopyTextButton-BZIaefKs.js";import"./useCopyToClipboard-CAkNDTn8.js";import"./useMountedState-CiwiE7kc.js";import"./Tooltip-CKxlzXa0.js";import"./Popper-DldGGRD9.js";import"./Portal-CPD4eQSx.js";import"./Grid-C7KzSS4F.js";import"./List-BP8Bshto.js";import"./ListContext-CqJ372Q7.js";import"./ListItem-mZsObVR0.js";import"./ListItemText-CUaBPH5v.js";import"./Divider-Br8PYMzl.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
  <ResponseErrorPanel
    error={new Error("Error message from error object")}
    defaultExpanded={false}
  />
);
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const WithTitle = () => (
  <ResponseErrorPanel
    error={new Error("test")}
    defaultExpanded={false}
    title="Title prop is passed"
  />
);
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...e.parameters?.docs?.source}}};const N=["Default","WithTitle"];export{r as Default,e as WithTitle,N as __namedExportsOrder,I as default};
