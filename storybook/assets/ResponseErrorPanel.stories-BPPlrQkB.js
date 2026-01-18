import{j as t}from"./iframe-Yl0Qc67S.js";import{R as s}from"./ResponseErrorPanel-BJLWLyiz.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-DLd7jlxf.js";import"./WarningPanel-DPnP4zkP.js";import"./ExpandMore-DlTYCfZc.js";import"./AccordionDetails-UWNICwr0.js";import"./index-B9sM2jn7.js";import"./Collapse-CReMq_1Z.js";import"./MarkdownContent-DmHmkZd9.js";import"./CodeSnippet-B108T10t.js";import"./Box-DltD7D0m.js";import"./styled-DXbACUbA.js";import"./CopyTextButton-3gQ_70GM.js";import"./useCopyToClipboard-BnQ5eYWr.js";import"./useMountedState-B1Psi6MC.js";import"./Tooltip-N5ZLqhtT.js";import"./Popper-90U13irg.js";import"./Portal-kuGKvNyC.js";import"./Grid-BoLsaJTc.js";import"./List-C5jB0ILm.js";import"./ListContext-BQmyr3YY.js";import"./ListItem-BafF8VBM.js";import"./ListItemText-9ikpSF0R.js";import"./Divider-DRYu6qgR.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
