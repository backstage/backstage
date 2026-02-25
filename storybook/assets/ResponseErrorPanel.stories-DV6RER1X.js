import{j as t}from"./iframe-ByRYLFwj.js";import{R as s}from"./ResponseErrorPanel-DOdxd3-l.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-CUs-1deS.js";import"./ErrorPanel-quplJSki.js";import"./WarningPanel-CNTjRA-n.js";import"./ExpandMore-BK_H-Jvj.js";import"./AccordionDetails-NtAlPKKr.js";import"./index-B9sM2jn7.js";import"./Collapse-Bm6s8njS.js";import"./MarkdownContent-D2qK6LPH.js";import"./CodeSnippet-BCrFo6Kb.js";import"./Box-D8ylNFTF.js";import"./styled-ASiGQwJu.js";import"./CopyTextButton-CJbouSGI.js";import"./useCopyToClipboard-B6BCrc5N.js";import"./useMountedState-0bFYrJyB.js";import"./Tooltip-DR9Idexm.js";import"./Popper-BHEEGTZh.js";import"./Portal-BZPqZUv7.js";import"./Grid-BWBQHPmq.js";import"./List-D9mAo6Wj.js";import"./ListContext-Dqofe_r2.js";import"./ListItem-CRQYiEBH.js";import"./ListItemText-DWULtL2S.js";import"./Divider-lv9ULMzF.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
