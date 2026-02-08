import{j as t}from"./iframe-BVVWNhNF.js";import{R as s}from"./ResponseErrorPanel-CmFsIyOc.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-CIBQJLIP.js";import"./WarningPanel-BKd-aVLN.js";import"./ExpandMore-DowbklPi.js";import"./AccordionDetails-RAdNuemB.js";import"./index-B9sM2jn7.js";import"./Collapse-BYFMHxpC.js";import"./MarkdownContent-DIwENC3V.js";import"./CodeSnippet-DsEjqB14.js";import"./Box-I6qpNjup.js";import"./styled-BXlk9tEQ.js";import"./CopyTextButton-D4a_r689.js";import"./useCopyToClipboard-BPci2e7u.js";import"./useMountedState-Lmv_QRT4.js";import"./Tooltip-B6-nubZA.js";import"./Popper-CpEGPy4_.js";import"./Portal-DukR7Qds.js";import"./Grid-BhWDjvJh.js";import"./List-CeUn_h_G.js";import"./ListContext-D6HHPv4d.js";import"./ListItem-896bCnNz.js";import"./ListItemText-rQpXHQMd.js";import"./Divider-BEnyyVTc.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"(args: ErrorPanelProps) => <ResponseErrorPanel {...args} />",...e.parameters?.docs?.source}}};const I=["Default","WithTitle"];export{r as Default,e as WithTitle,I as __namedExportsOrder,F as default};
