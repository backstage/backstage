import{j as t}from"./iframe-CafSZihE.js";import{R as s}from"./ResponseErrorPanel-Cnh5_8Eq.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-Cbj0fdBm.js";import"./WarningPanel-BCt9Bv9g.js";import"./ExpandMore-B67diL7X.js";import"./AccordionDetails-CZxQwlea.js";import"./index-B9sM2jn7.js";import"./Collapse-uTAZOzA3.js";import"./MarkdownContent-C9IhCAop.js";import"./CodeSnippet-BTTGQVt6.js";import"./Box-fRbsHjDs.js";import"./styled-XhcyHdDa.js";import"./CopyTextButton-Xa9XWeEV.js";import"./useCopyToClipboard-C5jlCbNf.js";import"./useMountedState-Bx1mDZHi.js";import"./Tooltip-CWOPvmrv.js";import"./Popper-DcG5vPGv.js";import"./Portal-W2FhbA1a.js";import"./Grid-CE8ncWjM.js";import"./List-B4E6UX55.js";import"./ListContext-CWAV-zjc.js";import"./ListItem-DVuo4x9u.js";import"./ListItemText-B-CF-Ijo.js";import"./Divider-C4EwzhjR.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
