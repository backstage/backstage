import{j as t}from"./iframe-DBsVXRYe.js";import{R as s}from"./ResponseErrorPanel-BM0_isYV.js";import"./preload-helper-PPVm8Dsz.js";import"./makeStyles-u8aTytdp.js";import"./ErrorPanel-C_2-4xfK.js";import"./WarningPanel-DTJyTb6A.js";import"./ExpandMore-X1Sw9hIC.js";import"./AccordionDetails-NV6-MnS3.js";import"./index-B9sM2jn7.js";import"./Collapse-DWkyhCos.js";import"./MarkdownContent-B-wQhPbk.js";import"./CodeSnippet-f1HNpjZM.js";import"./Box-DM8WpBiE.js";import"./styled-CtO3CIMm.js";import"./CopyTextButton-DnqYIBWb.js";import"./useCopyToClipboard-CW8p6N-z.js";import"./useMountedState-D8yjF72b.js";import"./Tooltip-CPJgV8tS.js";import"./Popper-BrV3NxJy.js";import"./Portal-9OHpjUEk.js";import"./Grid-BdpucV2E.js";import"./List-CIVoJXzy.js";import"./ListContext-DUSKHWgB.js";import"./ListItem-DQ9bn4c-.js";import"./ListItemText-Udvvf9eP.js";import"./Divider-DEXssYkW.js";const I={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
