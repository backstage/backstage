import{j as t}from"./iframe-CXVefQjv.js";import{R as s}from"./ResponseErrorPanel-BnmmaTTP.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-cSB5pDml.js";import"./ErrorPanel-MxtYpFuZ.js";import"./WarningPanel-nnuElF3h.js";import"./ExpandMore-ikIZxahA.js";import"./AccordionDetails-mtEEQxbQ.js";import"./index-B9sM2jn7.js";import"./Collapse-wHEE5AT7.js";import"./MarkdownContent-Dv_avCwS.js";import"./CodeSnippet-DpXSGNAU.js";import"./Box-D7AnzI4p.js";import"./styled-B7NpzSmh.js";import"./CopyTextButton-BSb2_Qop.js";import"./useCopyToClipboard-DAoWI8pP.js";import"./useMountedState-D7qdGVsq.js";import"./Tooltip-3hD40Mh0.js";import"./Popper-KPvihGZy.js";import"./Portal-BQuMmKqR.js";import"./Grid-hBNd94kt.js";import"./List-S9fButJF.js";import"./ListContext-x0Xd6oQC.js";import"./ListItem-CB67RL_O.js";import"./ListItemText-CJ-vbVsn.js";import"./Divider-D5p3BC6A.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
