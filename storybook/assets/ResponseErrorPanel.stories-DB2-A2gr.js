import{j as t}from"./iframe-ByBrTvma.js";import{R as s}from"./ResponseErrorPanel-CSdR3VFn.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DbNf7az6.js";import"./ErrorPanel-C4zrIH-w.js";import"./WarningPanel-HKNPeiOU.js";import"./ExpandMore-DKDbIoE-.js";import"./AccordionDetails-Cf7eRlhQ.js";import"./index-B9sM2jn7.js";import"./Collapse-ZuDko566.js";import"./MarkdownContent-DAycQpu1.js";import"./CodeSnippet-B_m9Zbl6.js";import"./Box-BTaWTKK7.js";import"./styled-D_mu6x9U.js";import"./CopyTextButton-B0WUg9Mo.js";import"./useCopyToClipboard-CowksdiF.js";import"./useMountedState-ClRjsrJA.js";import"./Tooltip-Bj3ZS_EF.js";import"./Popper-batIr5mA.js";import"./Portal-UHK3xnYf.js";import"./Grid-CVJ59jxc.js";import"./List-COw7E98o.js";import"./ListContext-BWIL9NnA.js";import"./ListItem-DP4h3WVe.js";import"./ListItemText-CUqA2Zhn.js";import"./Divider-BW-RA_wr.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
