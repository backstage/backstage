import{j as t}from"./iframe-CdLF-10Q.js";import{R as s}from"./ResponseErrorPanel-DO6VeTxV.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DHrBvqm9.js";import"./ErrorPanel-DUV9SSfF.js";import"./WarningPanel-BmDQ6rpx.js";import"./ExpandMore-DVqt5hF5.js";import"./AccordionDetails-CZjHoqUV.js";import"./index-B9sM2jn7.js";import"./Collapse-B1-4SWZd.js";import"./MarkdownContent-6f6BdLYh.js";import"./CodeSnippet-DwKCsuin.js";import"./Box-BEpYmdO6.js";import"./styled-DKVD7tgY.js";import"./CopyTextButton-5GxBmYDa.js";import"./useCopyToClipboard-BIKQgYSu.js";import"./useMountedState-BDx40LHi.js";import"./Tooltip-r72wdggD.js";import"./Popper-g8OlZzUX.js";import"./Portal-6YsMjpwZ.js";import"./Grid-CH2eTvwA.js";import"./List-C4Q5M6UV.js";import"./ListContext-DDpewh2C.js";import"./ListItem-Ca20zprb.js";import"./ListItemText-4_UOFiGy.js";import"./Divider-CcgYYsI7.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
