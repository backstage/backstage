import{j as t}from"./iframe-DFdcbEiJ.js";import{R as s}from"./ResponseErrorPanel-D8Ggzb_p.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-B3OsaLRR.js";import"./WarningPanel-D07MgOJm.js";import"./ExpandMore-CCqXodF2.js";import"./AccordionDetails-DWgDfIG0.js";import"./index-B9sM2jn7.js";import"./Collapse-Bi_tnvhP.js";import"./MarkdownContent-yQMqdqzq.js";import"./CodeSnippet-BkmLPXrW.js";import"./Box-BjQGvIzi.js";import"./styled-DNdG2dK3.js";import"./CopyTextButton-QsOg2zVP.js";import"./useCopyToClipboard-CoHAd7Ub.js";import"./useMountedState-B2v2il8B.js";import"./Tooltip-D0BdWwmK.js";import"./Popper-zn-2LFE5.js";import"./Portal-DjeB-iF_.js";import"./Grid-Bz80tPVF.js";import"./List-C-NEuts9.js";import"./ListContext-D0DH-Ku-.js";import"./ListItem-LVIqWJQW.js";import"./ListItemText-cZEZ1Dk-.js";import"./Divider-DmWFkQ65.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
