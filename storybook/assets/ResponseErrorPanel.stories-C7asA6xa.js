import{j as t}from"./iframe-BmigQEv-.js";import{R as s}from"./ResponseErrorPanel-CrN6M0fP.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-0-n1Rujo.js";import"./ErrorPanel-D87FdHM-.js";import"./WarningPanel-Cdm1EbTH.js";import"./ExpandMore-Cam5MjCc.js";import"./AccordionDetails-DJp48nbG.js";import"./index-B9sM2jn7.js";import"./Collapse-DCf58tzA.js";import"./MarkdownContent-DYnLORy4.js";import"./CodeSnippet-Cogd1Uem.js";import"./Box-YqGKr52F.js";import"./styled-DHllcCHM.js";import"./CopyTextButton-CLEZMcEc.js";import"./useCopyToClipboard-B4Ur9exv.js";import"./useMountedState-DFB9Hb7L.js";import"./Tooltip-oWfERYB1.js";import"./Popper-B-YRGJsw.js";import"./Portal-BhbQiPPq.js";import"./Grid-BZioZTwU.js";import"./List-DPvCCYNu.js";import"./ListContext-DDrpeIYl.js";import"./ListItem-gIkgFmX0.js";import"./ListItemText-BWJ8GOpK.js";import"./Divider-BJZcR2fB.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
