import{j as t}from"./iframe-ByNNXeiS.js";import{R as s}from"./ResponseErrorPanel-D5QWTxBo.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-CTICeqhn.js";import"./WarningPanel-fBpuhxcO.js";import"./ExpandMore-BLvu8MU4.js";import"./AccordionDetails-C7U2wsbT.js";import"./index-B9sM2jn7.js";import"./Collapse-BjluhvND.js";import"./MarkdownContent-Czdavqjx.js";import"./CodeSnippet-DyKHxpoR.js";import"./Box-bD4mu6aM.js";import"./styled-CuXflSyU.js";import"./CopyTextButton-DCj9B9eD.js";import"./useCopyToClipboard-k9NuIUEn.js";import"./useMountedState-BOphWm7n.js";import"./Tooltip-Cn9c8OtC.js";import"./Popper-jt-jzf2T.js";import"./Portal-0sot7Ylp.js";import"./Grid-COH9vICu.js";import"./List-Dw_wv5bM.js";import"./ListContext-CXkvT0sH.js";import"./ListItem-CKlTPKne.js";import"./ListItemText-DCU7V9rR.js";import"./Divider-DmVn_tUx.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
