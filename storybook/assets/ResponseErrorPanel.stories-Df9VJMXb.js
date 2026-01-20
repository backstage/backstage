import{j as t}from"./iframe-Du4yWFmh.js";import{R as s}from"./ResponseErrorPanel-5eAEq_h-.js";import"./preload-helper-PPVm8Dsz.js";import"./ErrorPanel-Bjzvo6fH.js";import"./WarningPanel-YDZfKCG0.js";import"./ExpandMore-B4oHnhmj.js";import"./AccordionDetails-Bs2ZQrVE.js";import"./index-B9sM2jn7.js";import"./Collapse-CJL9VCPm.js";import"./MarkdownContent-DScxBhmk.js";import"./CodeSnippet-QaiBHOZa.js";import"./Box-CkOOyHi_.js";import"./styled-B5kNIoL_.js";import"./CopyTextButton-zIe-ESin.js";import"./useCopyToClipboard-GTE9QNgz.js";import"./useMountedState-DMz1NfKI.js";import"./Tooltip-CxJ8vwKd.js";import"./Popper-Bc6CEfjX.js";import"./Portal-CRhyxH_K.js";import"./Grid-BAWrmmwT.js";import"./List-C8YUr1Px.js";import"./ListContext-CCATEDcQ.js";import"./ListItem-CR_jODVH.js";import"./ListItemText-BFdXXm3F.js";import"./Divider-BJZ8WmAv.js";const F={title:"Data Display/ResponseErrorPanel",component:s,tags:["!manifest"]},r=o=>t.jsx(s,{...o});r.args={error:new Error("Error message from error object"),defaultExpanded:!1};const e=o=>t.jsx(s,{...o});e.args={error:new Error("test"),defaultExpanded:!1,title:"Title prop is passed"};r.__docgenInfo={description:"",methods:[],displayName:"Default",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};e.__docgenInfo={description:"",methods:[],displayName:"WithTitle",props:{error:{required:!0,tsType:{name:"Error"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},titleFormat:{required:!1,tsType:{name:"string"},description:""},title:{required:!1,tsType:{name:"string"},description:""}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => (
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
