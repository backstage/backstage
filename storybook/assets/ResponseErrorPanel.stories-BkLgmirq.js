import{j as t}from"./iframe-BJyhMgZx.js";import{R as s}from"./ResponseErrorPanel-BhMf7Bij.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-m2J_rcv9.js";import"./WarningPanel-DZJY6lkJ.js";import"./ExpandMore-CZtZ9lCo.js";import"./AccordionDetails-BPpQ2yq1.js";import"./index-B9sM2jn7.js";import"./Collapse-Dk3gxg1y.js";import"./MarkdownContent-B5xSYRKQ.js";import"./CodeSnippet-CYEA3v3M.js";import"./Box-DvCgVOwJ.js";import"./styled-LNNxiV8P.js";import"./CopyTextButton-df7laSYD.js";import"./useCopyToClipboard-B8mFz-kX.js";import"./useMountedState-Cu_WIlx5.js";import"./Tooltip-BYcvPGbC.js";import"./Popper-CFXrn5Hd.js";import"./Portal-Bs15JVl2.js";import"./Grid-Ce4w6y7_.js";import"./List-BFZ4Qrp4.js";import"./ListContext-wap519Wf.js";import"./ListItem-C9MlxCoa.js";import"./ListItemText-BGmwo6yn.js";import"./Divider-CW714Rq9.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
