import{j as t}from"./iframe-B9hgvJLw.js";import{R as s}from"./ResponseErrorPanel-fD74zqn3.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-CtYawyCD.js";import"./WarningPanel-CWYhx9r2.js";import"./ExpandMore-BoLpzv6N.js";import"./AccordionDetails-CKakyLf0.js";import"./index-B9sM2jn7.js";import"./Collapse-FgK-KUTI.js";import"./MarkdownContent-B8lxAtZu.js";import"./CodeSnippet-BVb_NoMX.js";import"./Box-BsI7Fu14.js";import"./styled-CF5nzrfv.js";import"./CopyTextButton-DAUaMyUM.js";import"./useCopyToClipboard-D14CO7yh.js";import"./useMountedState-kHvlJXnr.js";import"./Tooltip-RfNF6Jnk.js";import"./Popper-BAAWK9EZ.js";import"./Portal-pCoOC46-.js";import"./Grid-g3HyMBvJ.js";import"./List-BDdcqK40.js";import"./ListContext-DgcYteU3.js";import"./ListItem-Bp1BuLev.js";import"./ListItemText-Bx_jgiBv.js";import"./Divider-CdNlJD_Q.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
