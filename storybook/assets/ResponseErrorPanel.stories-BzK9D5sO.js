import{j as t}from"./iframe-DLcIH_b-.js";import{R as s}from"./ResponseErrorPanel-DaAlpNEw.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-DxXUdzmq.js";import"./WarningPanel-B3vPuQN4.js";import"./ExpandMore-C68SGr3c.js";import"./AccordionDetails-tL39bQia.js";import"./index-B9sM2jn7.js";import"./Collapse-BJd8DAV0.js";import"./MarkdownContent-Cp_Yq8fi.js";import"./CodeSnippet-C1jqIUTN.js";import"./Box-DaYdGGLQ.js";import"./styled-CJB3T-Oh.js";import"./CopyTextButton-BGx5v8bI.js";import"./useCopyToClipboard-D3pZMe8I.js";import"./useMountedState-CJM5rP6v.js";import"./Tooltip-DOrjEsZ_.js";import"./Popper-BhVwcAhT.js";import"./Portal-D2sb6xU7.js";import"./Grid-CHWXErYD.js";import"./List-DgCkyPF-.js";import"./ListContext-C-a3EO19.js";import"./ListItem-BtxOUJ8W.js";import"./ListItemText-C61nqRKy.js";import"./Divider-fjKwa6Mv.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
