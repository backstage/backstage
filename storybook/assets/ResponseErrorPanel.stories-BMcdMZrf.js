import{j as t}from"./iframe-oBxK6qra.js";import{R as s}from"./ResponseErrorPanel-BVKnP1_R.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-B3IkJU93.js";import"./ErrorPanel-DMsqwtMW.js";import"./WarningPanel-GQJY0cnz.js";import"./ExpandMore-BeGNZDZU.js";import"./AccordionDetails-G0oRx4zU.js";import"./index-B9sM2jn7.js";import"./Collapse-BiFZcuZY.js";import"./MarkdownContent-7zu0eLmB.js";import"./CodeSnippet-3bHpw8wN.js";import"./Box-DfiY0lfn.js";import"./styled-CUSqWafa.js";import"./CopyTextButton-CNo3Wt0d.js";import"./useCopyToClipboard-C-otOoL_.js";import"./useMountedState-ZHVNtiRb.js";import"./Tooltip-BmsdhjHf.js";import"./Popper-CGGPeLTJ.js";import"./Portal-inACr_9c.js";import"./Grid-B7p-OhlU.js";import"./List-Sd8wYk3i.js";import"./ListContext-BbbmxUrC.js";import"./ListItem-DtIi3ktM.js";import"./ListItemText-DoAWL9zZ.js";import"./Divider-B1caK0_E.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
