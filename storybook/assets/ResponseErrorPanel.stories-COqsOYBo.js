import{j as t}from"./iframe-CmjKepAK.js";import{R as s}from"./ResponseErrorPanel-8zg_0Y5-.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-rFkGMQln.js";import"./ErrorPanel-DszDZl6s.js";import"./WarningPanel-Bzp2Jc9K.js";import"./ExpandMore-DpE81Iih.js";import"./AccordionDetails-DeGigw1-.js";import"./index-B9sM2jn7.js";import"./Collapse-Dm6Hazgb.js";import"./MarkdownContent-BMHQGjp4.js";import"./CodeSnippet-o7rWkpzX.js";import"./Box-C55POBiq.js";import"./styled-DL3tZMBP.js";import"./CopyTextButton-Cyk9raB0.js";import"./useCopyToClipboard-DQ8eQiBS.js";import"./useMountedState-CjGZo6tl.js";import"./Tooltip-DYOv2ULC.js";import"./Popper-CMPq-ztF.js";import"./Portal-BqvT6j51.js";import"./Grid-BnHJoKKz.js";import"./List-IEhbKV8f.js";import"./ListContext-2rvRcxSY.js";import"./ListItem-Bnkh6FOH.js";import"./ListItemText-CNtEcy1B.js";import"./Divider-DQqwXrEG.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
