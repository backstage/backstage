import{j as t}from"./iframe-CDMGjht1.js";import{R as s}from"./ResponseErrorPanel-l7hkv1fD.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-CHa0fGo8.js";import"./WarningPanel-DI2PepE0.js";import"./ExpandMore-BW8Ytfi4.js";import"./AccordionDetails-xoWWWHy1.js";import"./index-B9sM2jn7.js";import"./Collapse-T-NVxaZE.js";import"./MarkdownContent-Cqhsm4_s.js";import"./CodeSnippet-CLIpVCVn.js";import"./Box-Dh0DgXaN.js";import"./styled-BhiXTegV.js";import"./CopyTextButton-BUSczag8.js";import"./useCopyToClipboard-Dpkpx4yl.js";import"./useMountedState-BCg_GyJl.js";import"./Tooltip-CrUID85L.js";import"./Popper-CnWXkGYE.js";import"./Portal-Dv12doci.js";import"./Grid-BgC6P4wx.js";import"./List-BZ3qqjn-.js";import"./ListContext-ak2gE-qF.js";import"./ListItem-CGpakNnt.js";import"./ListItemText-DadlRFVX.js";import"./Divider-BQTEKmhn.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
