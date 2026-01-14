import{j as t}from"./iframe-OUC1hy1H.js";import{R as s}from"./ResponseErrorPanel-Dkar7xbU.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-D45LPvzG.js";import"./WarningPanel-4XJbGV6W.js";import"./ExpandMore-YNQPypsM.js";import"./AccordionDetails-BV-iIFxu.js";import"./index-B9sM2jn7.js";import"./Collapse-WWepLYBs.js";import"./MarkdownContent-DHn9pYVo.js";import"./CodeSnippet-DchPM48d.js";import"./Box-BmoTrTFH.js";import"./styled-A6cHt6de.js";import"./CopyTextButton-DRNDJ6Lk.js";import"./useCopyToClipboard-B_WaDLJZ.js";import"./useMountedState-BrWxqueh.js";import"./Tooltip-BQGIC7Cn.js";import"./Popper-vVGWEO2q.js";import"./Portal-DWQSZWuh.js";import"./Grid-DL-Pv4jh.js";import"./List--3INAzqF.js";import"./ListContext-DyoBs2U6.js";import"./ListItem-CyBq-NVx.js";import"./ListItemText-BN19jovg.js";import"./Divider-CEY86Jg2.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
