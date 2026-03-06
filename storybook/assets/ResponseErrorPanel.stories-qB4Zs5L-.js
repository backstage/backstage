import{j as t}from"./iframe-DxoM00WU.js";import{R as s}from"./ResponseErrorPanel-DSZuGYwL.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-DpSWpYQd.js";import"./ErrorPanel-DkYrO0IX.js";import"./WarningPanel-CVTYfZJZ.js";import"./ExpandMore-CGZzUraL.js";import"./AccordionDetails-6dcnPqQb.js";import"./index-B9sM2jn7.js";import"./Collapse-D-BKwRaA.js";import"./MarkdownContent-CiLDLTud.js";import"./CodeSnippet-yWpS3zh4.js";import"./Box-BuH3verr.js";import"./styled-4EHbyUJg.js";import"./CopyTextButton-5eKqVxvn.js";import"./useCopyToClipboard-CfqnmD1o.js";import"./useMountedState-DpxGQQbT.js";import"./Tooltip-BzQR3gsg.js";import"./Popper-Ceh68zhn.js";import"./Portal-DXumaV8r.js";import"./Grid-CMfdjtyd.js";import"./List-BeR0746K.js";import"./ListContext-CgvnrPIp.js";import"./ListItem-wzN9QCAC.js";import"./ListItemText-D-C3Y3D8.js";import"./Divider-frXs4-4y.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
