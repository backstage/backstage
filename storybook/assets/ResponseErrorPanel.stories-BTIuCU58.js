import{j as t}from"./iframe-mdeHk8Us.js";import{R as s}from"./ResponseErrorPanel-DJSw6oRK.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-De8J-gDX.js";import"./WarningPanel-Cg3FNdiM.js";import"./ExpandMore-4uaBqvpS.js";import"./AccordionDetails-CY4b5vf9.js";import"./index-B9sM2jn7.js";import"./Collapse-B45VguHP.js";import"./MarkdownContent-DOJrLrbX.js";import"./CodeSnippet-DzFJqA_2.js";import"./Box-C_VvrdzU.js";import"./styled-BGP2DNJW.js";import"./CopyTextButton-BqpZzKnD.js";import"./useCopyToClipboard-DVW_Y7r9.js";import"./useMountedState-DqT-X8D-.js";import"./Tooltip-BRtijnu7.js";import"./Popper-D5LaxFiz.js";import"./Portal-CGi5eRlN.js";import"./Grid-DC2Tywm3.js";import"./List-X7Jezm93.js";import"./ListContext-EwKgne2S.js";import"./ListItem-L1zDUeu9.js";import"./ListItemText-DCPofTJa.js";import"./Divider-GxHdmRdJ.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
