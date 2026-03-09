import{j as t}from"./iframe-DyesWYDr.js";import{R as s}from"./ResponseErrorPanel-DXIYAJf8.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-qFKHfDO-.js";import"./ErrorPanel-D7sxCFFv.js";import"./WarningPanel-KvN-Mhwi.js";import"./ExpandMore-CDUPlP8M.js";import"./AccordionDetails-Cmbt_HLo.js";import"./index-B9sM2jn7.js";import"./Collapse-WPBzMyoM.js";import"./MarkdownContent-BrwT6_1g.js";import"./CodeSnippet-BjY6zTEj.js";import"./Box-km7zlvMw.js";import"./styled-Dfa_ap0s.js";import"./CopyTextButton-BVgCDtuW.js";import"./useCopyToClipboard-DEw17vii.js";import"./useMountedState-BVo_ywvs.js";import"./Tooltip-BTxoZZD7.js";import"./Popper-CEy5HCpt.js";import"./Portal-rWyDgme_.js";import"./Grid-BVpgiwP1.js";import"./List-CxzFB0_1.js";import"./ListContext-f5RS08Ml.js";import"./ListItem-CPW55C5k.js";import"./ListItemText-3YzUEJeB.js";import"./Divider-BJkEr-uk.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
