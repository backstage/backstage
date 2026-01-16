import{j as t}from"./iframe-XFwexWAC.js";import{R as s}from"./ResponseErrorPanel-B34mXLgu.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-0ntfFJ4u.js";import"./WarningPanel-CWtEeF6X.js";import"./ExpandMore-DmZgnz1E.js";import"./AccordionDetails-vmXM40VX.js";import"./index-B9sM2jn7.js";import"./Collapse-BtERTKf9.js";import"./MarkdownContent-DGJWTS_J.js";import"./CodeSnippet-B745YxT9.js";import"./Box-DOcmf_lA.js";import"./styled-CDWDroQT.js";import"./CopyTextButton-BU9NUfM0.js";import"./useCopyToClipboard-BxYbXeOS.js";import"./useMountedState-D8mLU74K.js";import"./Tooltip-pAeb8IBW.js";import"./Popper-Cpjma44V.js";import"./Portal-DGqwvRCH.js";import"./Grid-QGplJCTn.js";import"./List-cHbFQZE_.js";import"./ListContext-B0O1h7iD.js";import"./ListItem-BEnPhwl_.js";import"./ListItemText-DimjlXkG.js";import"./Divider-AcqAP6v2.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
