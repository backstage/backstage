import{j as t}from"./iframe-je00FURG.js";import{R as s}from"./ResponseErrorPanel-BNUaaLwE.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-D9kr6r3A.js";import"./WarningPanel-Dcuu5cbX.js";import"./ExpandMore-WI6HnxKN.js";import"./AccordionDetails-D7NCYtPs.js";import"./index-B9sM2jn7.js";import"./Collapse-C_uADL9y.js";import"./MarkdownContent-DkENAc60.js";import"./CodeSnippet-Ctc7NF_9.js";import"./Box-D5OPEor2.js";import"./styled-xFV0esG7.js";import"./CopyTextButton-CsqW7A3R.js";import"./useCopyToClipboard--lbvSauh.js";import"./useMountedState-BIjkbirw.js";import"./Tooltip-D5bghJxt.js";import"./Popper-C-tdByCl.js";import"./Portal-CNYY4S2y.js";import"./Grid-B0PQ6h2h.js";import"./List-DQRaF7f8.js";import"./ListContext-CO6-aiX7.js";import"./ListItem-DfuXVJU9.js";import"./ListItemText-CIKD7UvW.js";import"./Divider-CEZbmPKt.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
